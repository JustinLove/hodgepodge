(function() {
  console.log('hodgepodge icons', !!atlasMessage)
  if (atlasMessage) {
    var icons = _.compact(HodgePodge.customUnits.map(function(unit) {
      return unit.si_name || unit.spec_id.match(/\/(\w+).json/)[1]
    }))
    if (icons.length > 0) {
      atlasMessage.message('icon_atlas', 'request_icons', icons)
      atlasMessage.message('icon_atlas', 'update_and_freeze_icon_changes')
    }
  }
})()
