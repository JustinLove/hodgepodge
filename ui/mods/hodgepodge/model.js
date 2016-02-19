(function() {
  "use strict";

  if (!window.model) return

  if (model.ammoBuildHover) {
    HodgePodge.addedUnits.forEach(function(unit) {
      if (unit.ammo_build_hover) {
        model.ammoBuildHover[unit.spec_id] = unit.ammo_build_hover
      }
    })
  }

  if (model.buildSet) {
    model.buildSet.subscribe(function(set) {
      if (!set) return
      set.tabs().forEach(function(tab) {
        var its = tab.items()
        tab.skipLastRow(!(its[5].id || its[11].id || its[17].id))
      })
    })
  }
})()
