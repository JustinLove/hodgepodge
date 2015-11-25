(function() {
  console.log('hodgepodge icons', !!atlasMessage)
  if (atlasMessage) {
    var removed = _.compact(HodgePodge.removedUnits.map(function(unit) {
      if (unit.si_name === null) return null
      return unit.si_name || unit.spec_id.match(/\/(\w+).json/)[1]
    }))
    if (removed.length > 0) {
      atlasMessage.message('icon_atlas', 'release_icons', removed)
    }

    var added = _.compact(HodgePodge.addedUnits.map(function(unit) {
      if (unit.si_name === null) return null
      var si_name = unit.si_name || unit.spec_id.match(/\/(\w+).json/)[1]
      if (unit.si_fallback) {
        var o = {}
        o[si_name] = unit.si_fallback
        return o
      } else {
        return si_name
      }
    }))
    if (added.length > 0) {
      atlasMessage.message('icon_atlas', 'request_icons', added)
    }

    if (removed.length > 0 || added.length > 0) {
      atlasMessage.message('icon_atlas', 'update_and_freeze_icon_changes')
    }
  }
})()
