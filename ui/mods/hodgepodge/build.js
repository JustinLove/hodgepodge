(function() {
  "use strict";

  console.log('build')

  if (!window.Build) return

  var assigned = {}

  var available = function(build) {
    if (!build) return false
    var tab = build[0]
    return !(assigned[tab] && assigned[tab][build[1]])
  }

  var assign = function(build, id) {
    var tab = build[0]
    assigned[tab] = assigned[tab] || []
    assigned[tab][build[1]] = id
  }

  var stockbuild = new Build.HotkeyModel().SpecIdToGridMap()
  var stockids = Object.keys(stockbuild)
  var removedids = HodgePodge.removedUnits.map(function(unit) {
    return unit.spec_id
  })
  _.difference(stockids, removedids).forEach(function(id) {
    assign(stockbuild[id], id)
  })

  var buildsOnRow = function(build) {
    if (!build) return []
    var tab = build[0]
    var row = Math.floor(build[1] / 6) * 6
    var slots = []
    for (var i = row;i < row + 6;i++) {
      slots.push([tab, i])
    }
    return slots
  }

  var buildsInTab = function(build) {
    if (!build) return []
    var tab = build[0]
    var slots = []
    for (var i = 0;i < 18;i++) {
      slots.push([tab, i])
    }
    return slots
  }

  var unassignedUnits = HodgePodge.addedUnits.filter(function(unit) {
    return Array.isArray(unit.preferred_builds)
  })

  var preferredLengths = unassignedUnits.map(function(unit) {
    return unit.preferred_builds.length
  })
  var maximumBuilds = Math.max.apply(Math, preferredLengths)

  var pass = function(candidates) {
    unassignedUnits = unassignedUnits.filter(function(unit) {
      var open = candidates(unit).filter(available)
      if (open.length > 0) {
        unit.assigned_build = open[0]
        assign(open[0], unit.spec_id)
        return false
      }

      return true
    })
  }

  for (var b = 0;b < maximumBuilds;b++) {
    // pass: assign requested slot
    pass(function(unit) {return [unit.preferred_builds[b]]})

    // pass: assign an empty slot on the same row
    pass(function(unit) {return buildsOnRow(unit.preferred_builds[b])})

    // pass: assign to any empty slot in a desired tab
    pass(function(unit) {return buildsInTab(unit.preferred_builds[b])})
  }

  // pass: punt into ammo tab
  pass(function(unit) {return buildsInTab(['ammo', 0])})

  // pass: punt into extra tab
  var n = 0
  while (unassignedUnits.length > 0) {
    var tab = 'extra' + n
    n = n + 1
    pass(function(unit) {return buildsInTab([tab, 0])})
  }

  var source = Build.HotkeyModel.toString()
  HodgePodge.removedUnits.forEach(function(unit) {
    var item = new RegExp('[ \\t]+"' + unit.spec_id + '":\\s*\\["\\w+",\\s*\\d+\\],\\r\\n')
    source = source.replace(item, '')
  })
  HodgePodge.addedUnits.forEach(function(unit) {
    if (unit.assigned_build) {
      var item = '"' + unit.spec_id + '": ' + JSON.stringify(unit.assigned_build)
      source = source.replace(/\](\r\n\s+)/, '],$1    ' + item + '$1')
    }
  })
  Build.HotkeyModel = eval('(' + source + ')')

  if (model.buildHotkeyModel) {
    var build = model.buildHotkeyModel.SpecIdToGridMap()
    HodgePodge.removedUnits.forEach(function(unit) {
      delete build[unit.spec_id]
    })
    HodgePodge.addedUnits.forEach(function(unit) {
      if (unit.assigned_build) {
        build[unit.spec_id] = unit.assigned_build
      }
    })
    model.buildHotkeyModel.SpecIdToGridMap.notifySubscribers()
  }

  if (model.buildSet) {
    model.buildSet.subscribe(function(set) {
      if (!set) return
      set.tabs().forEach(function(tab) {
        var its = tab.items()
        tab.skipLastRow(!(its[5].id || its[11].id || its[17].id))
      })
    })
  }
})()
