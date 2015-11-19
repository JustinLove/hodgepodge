(function() {
  window.HodgePodge = {
    customUnits: [],
    addUnits: function(units) {
      units.forEach(function(unit) {
        HodgePodge.customUnits.push(unit)
      })
    }
  }

  // this mod is early priority, so icon reloader won't be loaded
  //  during our normal scene mod
  scene_mod_list['live_game'] = scene_mod_list['live_game'] || []
  scene_mod_list['live_game'].push('coui://ui/mods/hodgepodge/icons.js')
})()
