(function() {
  console.log('unit specs')

  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.hodgepodge = 'coui://ui/mods/hodgepodge'
  config.paths.dev = 'coui://dev'
  config.paths.shared = 'coui://ui/main/game/galactic_war/shared/js'

  window.last_unit_specs = null

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
})()

require([
  'hodgepodge/spec_loader',
  'hodgepodge/digest',
  'dev/jsondiff',
], function(spec_loader, digest, jsondiff) {
  "use strict";

  var analyze = function(specs) {
    //console.log('hover ship', specs['/pa/units/sea/hover_ship/hover_ship.json'])
    //console.log('base ship', specs['/pa/units/sea/base_ship/base_ship.json'])
    Object.keys(last_unit_specs).forEach(function(id) {
    //['/pa/units/sea/naval_factory/naval_factory.json'].forEach(function(id) {
      var d = digest(id, orderedIds, specs)
      var diff = jsondiff.diff(d, last_unit_specs[id])
      if (diff) {
        //var keys = Object.keys(diff)
        //if (keys.length == 1 && keys[0] == 'build') return
        console.log(id, diff)
        console.log(d, last_unit_specs[id])//, specs[id])
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

  var orderedIds
  spec_loader.loadOrderedUnitList().then(function(ids) {
    orderedIds = _.uniq(ids)
    spec_loader.loadUnitSpecs(ids).then(analyze)
  })
})
