define([], function() {
  "use strict"

  return function(id, specs) {
    var unit = specs[id]
    var tool = unit && unit.tools && unit.tools[0] && specs[unit.tools[0].spec_id]
    var ammo = tool && specs[tool.ammo_id]
    unit.command_caps = unit.command_caps || []
    unit.consumption = unit.consumption || {}
    unit.navigation = unit.navigation || {}
    unit.production = unit.production || {}
    unit.storage = unit.storage || {}
    var digested = {
      ammo_capacity: tool && tool.ammo_capacity,
      ammo_demand: tool && tool.ammo_demand,
      ammo_per_shot: tool && tool.ammo_per_shot,
      commands: unit.command_caps.map(function(c) {return c.replace('ORDER_', '')}),
      consumption: {
        metal: unit.consumption.metal || 0,
        energy: unit.consumption.energy || 0,
      },
      cost: unit.build_metal_cost,
      damage: ammo && ammo.damage || 0,
      description: unit.description,
      max_health: unit.max_health,
      name: unit.display_name,
      navigation: {
        move_speed: unit.navigation.move_speed,
        turn_in_place: !!unit.navigation.turn_in_place,
        turn_speed: unit.navigation.turn_speed / 57.29 //????
      },
      production: {
        metal: unit.production.metal || 0,
        energy: unit.production.energy || 0,
      },
      rate_of_fire: tool && tool.rate_of_fire || 0,
      storage: {
        metal: unit.storage.metal || 0,
        energy: unit.storage.energy || 0,
      },
      structure: unit.unit_types.indexOf('UNITTYPE_Structure') != -1,
      titan: unit.unit_types.indexOf('UNITTYPE_Titan') != -1,
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
