(function() {
  console.log('units specs')

  var last_unit_specs
  if (handlers.unit_specs) {
    var base_unit_specs = handlers.unit_specs
    handlers.unit_specs = function(payload) {
      last_unit_specs = JSON.parse(JSON.stringify(payload))
      console.log('page unit specs', last_unit_specs)
      base_unit_specs(payload)
    }
  } else {
    handlers.unit_specs = function(payload) {
      last_unit_specs = JSON.parse(JSON.stringify(payload))
      console.log('no native unit specs', last_unit_specs)
    }
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

  requireGW(['shared/gw_specs'], function(specs) {
    //console.log('loaded', specs)
    // [] is truthy but concatiates to strings as ''
    specs.genUnitSpecs(['/pa/units/land/base_bot/base_bot.json', '/pa/units/land/baboom/baboom.json'], []).then(function(gend) {
      Object.keys(gend).forEach(function(id) {
        gend[id] = flattenBaseSpecs(gend[id], gend, '')
      })
      //console.log('gend', gend)
      if (handlers.unit_specs && last_unit_specs) {
        console.log('baboom', gend['/pa/units/land/baboom/baboom.json'])
        console.log('last bomb', last_unit_specs['/pa/units/land/bot_bomb/bot_bomb.json'])
        var id = '/pa/units/land/baboom/baboom.json'
        var unit = gend[id]
        var tool = gend[unit.tools[0].spec_id]
        var ammo = gend[tool.ammo_id]
        unit.consumption = unit.consumption || {}
        unit.production = unit.production || {}
        unit.storage = unit.storage || {}
        var hacked = {
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
          consumption: {
            metal: unit.production.metal || 0,
            energy: unit.production.energy || 0,
          },
          storage: {
            metal: unit.storage.metal || 0,
            energy: unit.storage.energy || 0,
          },
          structure: unit.unit_types.indexOf('UNITTYPE_Structure') != -1,
          titan: unit.unit_types.indexOf('UNITTYPE_Titan') != -1,
        }
        console.log(hacked)

        last_unit_specs[id] = hacked
        handlers.unit_specs(JSON.parse(JSON.stringify(last_unit_specs)))
      }
    })
  })
})()
