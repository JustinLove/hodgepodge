(function() {
  window.HodgePodge = {
    customUnits: [],
    addUnits: function(units) {
      units.forEach(function(unit) {
        HodgePodge.customUnits.push(unit)
      })
    }
  }
})()
