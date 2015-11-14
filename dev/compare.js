define([
  'hodgepodge/digest',
  'dev/jsondiff',
], function(digest, jsondiff) {
  var extras = HodgePodge.customUnits.map(function(unit) {
    return unit.spec_id
  })

  return function compare(specs) {
    var start = Date.now()

    var ids = _.uniq(Object.keys(last_unit_specs).concat(extras))
    ids.forEach(function(id) {
    //['/pa/units/land/bot_nanoswarm/bot_nanoswarm.json'].forEach(function(id) {
      var d = digest(id, orderedIds, specs)
      var diff = jsondiff.diff(d, last_unit_specs[id])
      if (diff) {
        //var keys = Object.keys(diff)
        //if (keys.length == 1 && keys[0] == 'build') return
        console.log(id, diff)
        console.log(d, last_unit_specs[id])//, specs[id])
      }
    })
    console.log('done', Date.now() - start)
  }
})
