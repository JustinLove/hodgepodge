define([], function() {
  return function(filter, ids, specs) {
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
        filterTokens[i] = "$.inArray('UNITTYPE_" + filterTokens[i] + "', currentUnitTypes) > -1";
      }

      if (filterTokens[i] == "-") {
        filterTokens[i] = "& !";
      }
    }
    filterString = filterTokens.join("");
    return ids.filter(function(id) { 
      var currentUnitTypes = specs[id].unit_types;
      return currentUnitTypes && eval(filterString);
    });
  }
})
