define(['shared/gw_specs'], function(loader) {
  var loadUnitSpecs = function(specIds) {
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

    return _.merge({}, base, spec);
  }

  return {
    load: loadUnitSpecs,
    flattenBaseSpecs: flattenBaseSpecs,
  }
})