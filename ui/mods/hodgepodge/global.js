(function() {
  window.HodgePodge = {
    addedUnits: [],
    removedUnits: [],
    addUnits: function(units) {
      units.forEach(function(unit) {
        HodgePodge.addedUnits.push(unit)
      })
    },
    removeUnits: function(units) {
      units.forEach(function(unit) {
        HodgePodge.removedUnits.push(unit)
      })
    },
  }
})()
