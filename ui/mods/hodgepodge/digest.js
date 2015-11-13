define([], function() {
  "use strict"

  var commandOrder = [
    "Move",
    "SpecialMove",
    "Patrol",
    "Build",
    "FactoryBuild",
    "Attack",
    "Reclaim",
    "Repair", 
    "Assist",
    "Load",
    "Unload",
    "Use",
    "FireSecondaryWeapon",
  ]

  var fixupCommands = function(command_caps) {
    var commands = command_caps.map(function(c) {
      return c.replace('ORDER_', '')
    }),
    commands = _.uniq(commands)
    commands = commands.sort(function(a, b) {
      return commandOrder.indexOf(a) - commandOrder.indexOf(b)
    })
    return commands
  }

  return function(id, specs) {
    var unit = specs[id]
    var weapon
    var magazine
    var build_arm
    if (unit && unit.tools) {
      unit.tools.forEach(function(handle) {
        var tool = specs[handle.spec_id]
        if (tool) {
          //console.log(handle, tool, tool.tool_type, weapon, tool.primary_weapon)
          if (tool.tool_type == 'TOOL_Weapon' && (!weapon || tool.primary_weapon)) {
            weapon = tool
            if (!weapon.only_fire_once && weapon.ammo_source != 'infinite') {
              magazine = tool
            }
          }
          if (tool.tool_type == 'TOOL_BuildArm' && !build_arm) {
            build_arm = tool
          }
        }
      })
    }
    var ammo
    if (weapon) {
      if (Array.isArray(weapon.ammo_id)) {
        ammo = specs[weapon.ammo_id[0].id]
      } else {
        ammo = specs[weapon.ammo_id]
      }
    }
    unit.command_caps = unit.command_caps || []
    unit.consumption = unit.consumption || {}
    unit.production = unit.production || {}
    unit.storage = unit.storage || {}
    var digested = {
      ammo_capacity: magazine && magazine.ammo_capacity,
      ammo_demand: magazine && magazine.ammo_demand,
      ammo_per_shot: magazine && magazine.ammo_per_shot,
      build_arm: build_arm && build_arm.construction_demand,
      commands: fixupCommands(unit.command_caps),
      consumption: {
        metal: unit.consumption.metal || 0,
        energy: unit.consumption.energy || 0,
      },
      cost: unit.build_metal_cost || 0,
      damage: ammo ? ammo.damage || 0 : undefined,
      description: unit.description,
      max_health: unit.max_health || 0,
      name: unit.display_name,
      navigation: unit.navigation && {
        moveSpeed: unit.navigation.move_speed,
        turnInPlace: !!unit.navigation.turn_in_place,
        turnSpeed: unit.navigation.turn_speed / 57.29577791868205, // * Math.PI * 2 / 360
      },
      production: {
        metal: unit.production.metal || 0,
        energy: unit.production.energy || 0,
      },
      projectiles: unit.buildable_projectiles,
      rate_of_fire: weapon && weapon.rate_of_fire,
      sicon_override: unit.si_name,
      storage: {
        metal: unit.storage.metal || 0,
        energy: unit.storage.energy || 0,
      },
      structure: unit.unit_types.indexOf('UNITTYPE_Structure') != -1,
      titan: unit.unit_types.indexOf('UNITTYPE_Titan') != -1,
      teleporter: unit.teleporter && {energy_demand: unit.teleporter.energy_demand || 0},
    }
    Object.keys(digested).forEach(function(key) {
      if (digested[key] === undefined) {
        delete digested[key]
      }
    })
    //console.log(digested)
    return digested
  }
})
