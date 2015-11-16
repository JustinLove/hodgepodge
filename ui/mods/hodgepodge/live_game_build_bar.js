(function() {
  var base_unit_specs = handlers.unit_specs
  handlers.unit_specs = function(payload) {
    var stockRan = (model.unitSpecs.state() == 'pending')
    base_unit_specs(payload)
    if (!stockRan) {
      model.parseUnitSpecs(payload)
    }
  }
})()

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
