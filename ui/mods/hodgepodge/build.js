(function() {
  "use strict";

  if (!window.Build) return

  if (api.content.usingTitans()) {
    console.log('HodgePodge build, removing deep space')

    HodgePodge.removedUnits.unshift(
      {spec_id: "/pa/units/orbital/deep_space_radar/deep_space_radar.json"})
  } else {
    console.log('HodgePodge build, removing titans')
    ;[
      "/pa/units/air/bomber_heavy/bomber_heavy.json",
      "/pa/units/air/solar_drone/solar_drone.json",
      "/pa/units/air/support_platform/support_platform.json",
      "/pa/units/air/titan_air/titan_air.json",
      "/pa/units/land/artillery_unit_launcher/artillery_unit_launcher.json",
      "/pa/units/land/bot_nanoswarm/bot_nanoswarm.json",
      "/pa/units/land/bot_support_commander/bot_support_commander.json",
      "/pa/units/land/bot_tesla/bot_tesla.json",
      "/pa/units/land/tank_flak/tank_flak.json",
      "/pa/units/land/tank_hover/tank_hover.json",
      "/pa/units/land/tank_nuke/tank_nuke.json",
      "/pa/units/land/titan_bot/titan_bot.json",
      "/pa/units/land/titan_structure/titan_structure.json",
      "/pa/units/land/titan_vehicle/titan_vehicle.json",
      "/pa/units/orbital/orbital_battleship/orbital_battleship.json",
      "/pa/units/orbital/orbital_probe/orbital_probe.json",
      "/pa/units/orbital/orbital_railgun/orbital_railgun.json",
      "/pa/units/orbital/titan_orbital/titan_orbital.json",
      "/pa/units/sea/drone_carrier/carrier/carrier.json",
      "/pa/units/sea/drone_carrier/drone/drone.json",
      "/pa/units/sea/fabrication_barge/fabrication_barge.json",
      "/pa/units/sea/hover_ship/hover_ship.json",
    ].forEach(function(id) {
      HodgePodge.removedUnits.unshift({spec_id: id})
    })
  }

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
    for (var row = 12;row >= 0;row -= 6) {
      for (var i = row;i < row + 6;i++) {
        slots.push([tab, i])
      }
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

  HodgePodge.removedUnits.forEach(function(unit) {
    delete Build.HotkeyModel.SpecIdToGridMap[unit.spec_id]
  })
  HodgePodge.addedUnits.forEach(function(unit) {
    if (unit.assigned_build) {
      Build.HotkeyModel.SpecIdToGridMap[unit.spec_id] = unit.assigned_build
    }
  })
})()
