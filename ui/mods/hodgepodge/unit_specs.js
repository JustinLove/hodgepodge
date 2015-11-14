(function() {
  console.log('unit specs')

  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.hodgepodge = 'coui://ui/mods/hodgepodge'
  config.paths.dev = 'coui://dev'
  config.paths.shared = 'coui://ui/main/game/galactic_war/shared/js'

  window.last_unit_specs = null
  window.orderedIds = null

  if (location == 'coui://ui/main/game/live_game/live_game_build_bar.html') {
    var base_unit_specs = handlers.unit_specs
    handlers.unit_specs = function(payload) {
      last_unit_specs = JSON.parse(JSON.stringify(payload))
      console.log('build bar unit specs', last_unit_specs)

      var stockRan = (model.unitSpecs.state() == 'pending')
      base_unit_specs(payload)
      if (!stockRan) {
        model.parseUnitSpecs(payload)
      }
    }
  } else if (handlers.unit_specs) {
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
    handlers.unit_specs(digests)
  }

  spec_loader.loadOrderedUnitList().then(function(ids) {
    orderedIds = _.uniq(ids.concat(extras))
    spec_loader.loadUnitSpecs(orderedIds).then(digestAll)
  })
})

if (location == 'coui://ui/main/game/live_game/live_game_build_bar.html') {
  // this is stock, but vanilla version is deferred.then which can only fire once
  // except: we don't have BuildSet so we cheat with model.buildSet().constructor
  model.parseUnitSpecs = function(payload) {
    // Fix up cross-unit references
    function crossRef(units) {
      for (var id in units) {
        var unit = units[id];
        unit.id = id;
        if (unit.build) {
          for (var b = 0; b < unit.build.length; ++b) {
            var ref = units[unit.build[b]];
            if (!ref) {
              ref = { id: unit.build[b] };
              units[ref.id] = ref;
            }
            unit.build[b] = ref;
          }
        }
        if (unit.projectiles) {
          for (var p = 0; p < unit.projectiles.length; ++p) {
            var ref = units[unit.projectiles[p]];
            if (!ref) {
              ref = { id: unit.projectiles[p] };
              units[ref.id] = ref;
            }
            unit.projectiles[p] = ref;
          }
        }
      }
    }
    crossRef(payload);

    var misc_unit_count = 0;

    function addBuildInfo(unit, id) {
      unit.buildIcon = Build.iconForUnit(unit);

      // Remove spec tag. (foo/bar/baz.json.ai -> foo/bar/baz.json)
      var strip = /(.*\.json)[^\/]*$/.exec(id);
      if (_.size(strip) > 1)
        id = strip[1];
      var target = model.buildHotkeyModel.SpecIdToGridMap()[id];
      if (!target) {
        target = ['misc', misc_unit_count];
        misc_unit_count++;
      }

      unit.buildGroup = target[0];
      unit.buildIndex = target[1];
    };
    for (var id in payload) {
      addBuildInfo(payload[id], id);
    }

    function makeBuildLists(units) {
      var result = {};
      for (var id in units) {
        var unit = units[id];
        if (!unit.build && !unit.projectiles)
          continue;

        var rawList = [];

        _.forEach(['build', 'projectiles'], function (element) {
          if (unit[element]) {
            for (var b = 0; b < unit[element].length; ++b) {
              var target = unit[element][b];
              if (typeof (target) === 'string')
                continue;

              rawList.push(target);
            }
          }
        });

        var build = _.filter(rawList, function (element) {
          return (element.buildGroup !== 'misc');
        });
        if (build.length)
          result[id] = build;
      }
      return result;
    }

    // -------------------- following line is added --------------------
    var BuildSet = model.buildSet().constructor

    var buildLists = makeBuildLists(payload);
    model.buildSet(new BuildSet({
      units: payload,
      buildLists: buildLists,
      grid: model.buildHotkeyModel.SpecIdToGridMap(),
      specTag: model.specTag
    }));
  };
}
