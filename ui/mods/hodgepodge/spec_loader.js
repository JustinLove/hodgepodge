define(['shared/gw_specs'], function(loader) {
  var loadOrderedUnitList = function loadOrderedUnitList() {
    return $.getJSON("coui://pa/units/unit_list.json").then(function(list) {
      return list.units
    })
  }

  var loadUnitSpecs = function loadUnitSpecs(specIds) {
    var def = $.Deferred()
    // [] is truthy but concatiates to strings as ''
    loader.genUnitSpecs(specIds, []).then(function(specs) {
      Object.keys(specs).forEach(function(id) {
        specs[id] = flattenBaseSpecs(specs[id], specs, '')
      })
      //console.log('specs', specs)
      def.resolve(specs)
    })

    return def.promise()
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

    return _.merge({}, base, spec, customMerge);
  }

  var customMerge = function customMerge(objectValue, sourceValue, key, object, source) {
    if (Array.isArray(sourceValue)) {
      return sourceValue
    } else {
      return undefined // default
    }
  }

  return {
    loadOrderedUnitList: loadOrderedUnitList,
    loadUnitSpecs: loadUnitSpecs,
    flattenBaseSpecs: flattenBaseSpecs,
  }
})
