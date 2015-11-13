(function() {
  console.log('unit specs')

  var last_unit_specs

  var loadUnitSpecs = function() {
    var def = $.Deferred()
    requireGW(['shared/gw_specs'], function(loader) {
      console.log('loaded', loader)
      // [] is truthy but concatiates to strings as ''
      loader.genUnitSpecs(Object.keys(last_unit_specs), []).then(function(specs) {
        Object.keys(specs).forEach(function(id) {
          specs[id] = flattenBaseSpecs(specs[id], specs, '')
        })
        //console.log('specs', specs)
        def.resolve(specs)
      })
    })

    return def.promise()
  }

  var analyze = function(specs) {
    //console.log('hover ship', specs['/pa/units/sea/hover_ship/hover_ship.json'])
    //console.log('base ship', specs['/pa/units/sea/base_ship/base_ship.json'])
    Object.keys(last_unit_specs).forEach(function(id) {
      var d = digest(id, specs)
      if (JSON.stringify(d) != JSON.stringify(last_unit_specs[id])) {
        console.log(d, last_unit_specs[id])
      } else {
        console.log('match', id)
      }
    })

    /*
    console.log('baboom', specs['/pa/units/land/baboom/baboom.json'])
    console.log('last bomb', last_unit_specs['/pa/units/land/bot_bomb/bot_bomb.json'])
    var id = '/pa/units/land/baboom/baboom.json'
    last_unit_specs[id] = digest(id, specs)
    */

    //handlers.unit_specs(JSON.parse(JSON.stringify(last_unit_specs)))
  }

  var digest = function(id, specs) {
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

  function flattenBaseSpecs(spec, specs, tag) {
    if (!spec.hasOwnProperty('base_spec'))
      return spec;

    var base = specs[spec.base_spec];
    if (!base) {
      base = specs[spec.base_spec + tag];
      if (!base)
        return spec;
    }

    spec = _.cloneDeep(spec);
    delete spec.base_spec;

    base = flattenBaseSpecs(base, specs, tag);

    return _.merge({}, base, spec);
  }

  if (handlers.unit_specs) {
    var base_unit_specs = handlers.unit_specs
    handlers.unit_specs = function(payload) {
      if (!last_unit_specs) {
        loadUnitSpecs().then(analyze)
      }
      last_unit_specs = JSON.parse(JSON.stringify(payload))
      console.log('page unit specs', last_unit_specs)
      base_unit_specs(payload)
    }
  } else {
    handlers.unit_specs = function(payload) {
      if (!last_unit_specs) {
        loadUnitSpecs().then(analyze)
      }
      last_unit_specs = JSON.parse(JSON.stringify(payload))
      console.log('no native unit specs', last_unit_specs)
    }
  }

})()
