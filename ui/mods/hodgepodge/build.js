(function() {
  "use strict";

  console.log('build')


  if (!window.Build) return

  var assigned = {}

  var available = function(build) {
    var tab = build[0]
    return !(assigned[tab] && assigned[tab][build[1]])
  }

  var assign = function(build, id) {
    var tab = build[0]
    assigned[tab] = assigned[tab] || []
    assigned[tab][build[1]] = id
  }

  var stockbuild = new Build.HotkeyModel().SpecIdToGridMap()
  Object.keys(stockbuild).forEach(function(id) {
    assign(stockbuild[id], id)
  })

  var unassignedUnits = HodgePodge.customUnits

  // pass: assign requested slot
  unassignedUnits = unassignedUnits.filter(function(unit) {
    //unit.preferred_builds = [['vehicle', 1]]
    var open = unit.preferred_builds.filter(available)
    if (open.length > 0) {
      unit.assigned_build = open[0]
      assign(open[0], unit.spec_id)
      return false
    }

    return true
  })

  var buildsOnRow = function(build) {
    var tab = build[0]
    var row = Math.floor(build[1] / 6) * 6
    var slots = []
    for (var i = row;i < row + 6;i++) {
      slots.push([tab, i])
    }
    return slots
  }

  // pass: assign an empty slot on the same row
  unassignedUnits = unassignedUnits.filter(function(unit) {
    for (var b in unit.preferred_builds) {
      var open = buildsOnRow(unit.preferred_builds[b]).filter(available)
      if (open.length > 0) {
        unit.assigned_build = open[0]
        assign(open[0], unit.spec_id)
        return false
      }
    }

    return true
  })

  // pass: punt into extra tab
  unassignedUnits.forEach(function(unit, i) {
    var tab = build[0]
    unit.assigned_build = ['extra', i]
    assign(['extra', i], unit.spec_id)
  })

  var source = Build.HotkeyModel.toString()
  HodgePodge.customUnits.forEach(function(unit) {
    var item = '"' + unit.spec_id + '": ' + JSON.stringify(unit.assigned_build)
    source = source.replace(/\](\r\n\s+)/, '],$1    ' + item + '$1')
  })
  Build.HotkeyModel = eval('(' + source + ')')

  if (model.buildHotkeyModel) {
    var build = model.buildHotkeyModel.SpecIdToGridMap()
    HodgePodge.customUnits.forEach(function(unit) {
      build[unit.spec_id] = unit.assigned_build
      //console.log(build[unit.spec_id])
    })
    model.buildHotkeyModel.SpecIdToGridMap.notifySubscribers()
  }
})()
