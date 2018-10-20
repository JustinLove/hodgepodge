(function() {
  "use strict";

  var added = _.compact(HodgePodge.addedUnits.map(function(unit) {
    if (unit.si_name === null) return null
    return unit.si_name || unit.spec_id.match(/\/(\w+).json/)[1]
  }))
  if (added.length > 0) {
    model.strategicIcons(_.union(model.strategicIcons(), added))
    setTimeout(model.sendIconList, 5000)
    console.log('hodgepodge added +' + added.length.toString() + ', ' + model.strategicIcons().length.toString() + ' icons total')
  }
})()