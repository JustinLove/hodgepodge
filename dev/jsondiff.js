define(['dev/jsondiffpatch'], function(jsondiffpatch) {
  "use strict";

  var jsondiff = jsondiffpatch.create()
  var epsilon = 0.000001
  var significant = function(context) {
    if (typeof context.left === 'number' && typeof context.right === 'number') {
      if (Math.abs(context.right - context.left) > epsilon) {
        context.setResult([context.left, context.right]).exit();
      } else {
        context.setResult(undefined).exit();
      }
    }
  };
  significant.filterName = 'significant';
  jsondiff.processor.pipes.diff.before('trivial', significant);

  return jsondiff
})
