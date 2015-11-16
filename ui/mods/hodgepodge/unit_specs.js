(function() {
  console.log('unit specs')

  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.hodgepodge = 'coui://ui/mods/hodgepodge'
  config.paths.dev = 'coui://dev'
  config.paths.shared = 'coui://ui/main/game/galactic_war/shared/js'

  window.last_unit_specs = null
  window.orderedIds = null

  if (handlers.unit_specs) {
    var base_unit_specs = handlers.unit_specs
    handlers.unit_specs = function(payload) {
      last_unit_specs = JSON.parse(JSON.stringify(payload))
      console.log('page unit specs', last_unit_specs)

      base_unit_specs(payload)
    }
  } else {
    // for testing in new_game
    handlers.unit_specs = function(payload) {
      last_unit_specs = JSON.parse(JSON.stringify(payload))
      console.log('no native unit specs', last_unit_specs)
    }
  }
})()

require([
  'hodgepodge/spec_loader',
  'hodgepodge/digest',
  //'dev/compare',
], function(spec_loader, digest/*, compare*/) {
  "use strict";

  var extras = HodgePodge.customUnits.map(function(unit) {
    return unit.spec_id
  })

  var digestAll = function(specs) {
    var digests = {}
    var ids = _.uniq(Object.keys(last_unit_specs).concat(extras))
    ids.forEach(function(id) {
      digests[id] = digest(id, orderedIds, specs)
    })
    api.Panel.message('', 'unit_specs', digests);
  }

  spec_loader.loadOrderedUnitList().then(function(ids) {
    orderedIds = _.uniq(ids.concat(extras))
    spec_loader.loadUnitSpecs(orderedIds).then(digestAll)
  })
})
