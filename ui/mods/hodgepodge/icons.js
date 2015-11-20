(function() {
  console.log('hodgepodge icons', !!atlasMessage)
  if (atlasMessage) {
    var removed = _.compact(HodgePodge.removedUnits.map(function(unit) {
      return unit.si_name || unit.spec_id.match(/\/(\w+).json/)[1]
    }))
    if (removed.length > 0) {
      atlasMessage.message('icon_atlas', 'release_icons', removed)
    }

    var added = _.compact(HodgePodge.addedUnits.map(function(unit) {
      return unit.si_name || unit.spec_id.match(/\/(\w+).json/)[1]
    }))
    if (added.length > 0) {
      atlasMessage.message('icon_atlas', 'request_icons', added)
    }

    if (removed.length > 0 || added.length > 0) {
      atlasMessage.message('icon_atlas', 'update_and_freeze_icon_changes')
    }
  }
})()
