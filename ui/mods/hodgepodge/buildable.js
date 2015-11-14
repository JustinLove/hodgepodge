define([], function() {
  var compile = function compile(filter) {
    //console.log(filter)
    filter = filter.replace(/\|/g, " | ");
    filter = filter.replace(/\&/g, " & ");
    filter = filter.replace(/\(/g, " ( ");
    filter = filter.replace(/\)/g, " ) ");
    filter = filter.replace(/\-/g, " - ");
    var filterTokens = filter.split(" ");
    for (var i = 0; i < filterTokens.length; i++) {
      if (filterTokens[i] != "("
       && filterTokens[i] != ")"
       && filterTokens[i] != "|"
       && filterTokens[i] != "&"
       && filterTokens[i] != "-"
       && filterTokens[i] != "") {
        filterTokens[i] = "($.inArray('UNITTYPE_" + filterTokens[i] + "', unitTypes) > -1)";
      }

      if (filterTokens[i] == "-") {
        filterTokens[i] = "& !";
      }
    }
    filterString = filterTokens.join("");
    //console.log(filterString)
    return new Function('unitTypes', 'return ' + filterString)
  }

  return function buildable(filter, ids, specs) {
    //var start = Date.now()
    var f = compile(filter)
    var builds = ids.filter(function(id) { 
      var currentUnitTypes = specs[id].unit_types;
      return currentUnitTypes && f(currentUnitTypes)
    });
    //console.log('buildable', Date.now() - start)
    return builds
  }
})
