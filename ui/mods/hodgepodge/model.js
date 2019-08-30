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
})()
