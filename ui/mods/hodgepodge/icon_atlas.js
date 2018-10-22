(function() {
  "use strict";

  var assignedIndex = function(id) {
    return model.strategicIcons().indexOf(id)
  }

  var tryToAssignString = function(to) {
    var a = assignedIndex(to)
    if (a > -1) return

    model.strategicIcons().push(to)
  }

  var tryToAssignObject = function(obj) {
    Object.keys(obj).forEach(tryToAssignString)
  }

  var tryToAssignArray = function(array) {
    _.uniq(array).forEach(function(to) {
      if (typeof(to) == 'string') {
        tryToAssignString(to)
      } else {
        tryToAssignObject(to)
      }
    })
  }

  model.requestIcons = function(icons) {
    if (Array.isArray(icons)) {
      tryToAssignArray(icons)
    } else {
      tryToAssignObject(icons)
    }

    model.strategicIcons.notifySubscribers()
  }

  model.releaseIcons = function(icons) {}

  model.strategicIcons.subscribe(model.sendIconList)

  var added = _.compact(HodgePodge.addedUnits.map(function(unit) {
    if (unit.si_name === null) return null
    return unit.si_name || unit.spec_id.match(/\/(\w+).json/)[1]
  }))
  if (added.length > 0) {
    model.requestIcons(added)
    console.log('hodgepodge added +' + added.length.toString() + ', ' + model.strategicIcons().length.toString() + ' icons total')
  }
})()
