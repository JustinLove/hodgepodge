(function() {
  "use strict";

  console.log('loaded icon atlas')

  var canvas = document.createElement('canvas')
  var gl = canvas.getContext("webgl");
  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
  //var max_texture_size = gl.getParameter(gl.MAX_TEXTURE_SIZE)
  var max_renderbuffer_size = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)
  var maxIcons = Math.floor(max_renderbuffer_size / 52)
  gl = canvas = undefined

  model.iconPool = model.iconPool || []
  var testNoFreeSlots = false

  // two entries, second is used by game
  var duplicateCommander = model.strategicIcons().filter(function(icon) {
    return icon == 'commander'
  }).length >= 2
  if (duplicateCommander) {
    model.iconPool.push('commander')
  }
  if (api.content.usingTitans()) {
    model.iconPool.push('deep_space_radar')
  }
  model.iconPool = model.iconPool.concat([
    'energy_storage_adv',
    'metal_storage_adv',
    'tank_lava',
    'paratrooper',
    'tutorial_titan_commander',
    'metal_spot_preview',
    'avatar',
  ])

  model.iconManagmentSetup = function() {
    model.slotUsage = model.strategicIcons().map(function(id) {
      return [id]
    })
    if (!testNoFreeSlots) {
      for (var i = model.slotUsage.length;i < maxIcons;i++) {
        model.slotUsage[i] = []
      }
      model.iconPool.forEach(function(id) {
        var i = model.strategicIcons().indexOf(id)
        //console.log('unused?', id, i)
        if (i > -1) {
          model.slotUsage[i] = []
        }
      })
    }
  }

  var assignedIndex = function(id) {
    for (var index = 0;index < model.slotUsage.length;index++) {
      var i = model.slotUsage[index].indexOf(id)
      if (i > -1) return index
    }

    return -1
  }

  var emptySlot = function() {
    for (var i = 0;i < model.slotUsage.length;i++) {
      if (model.slotUsage[i].length < 1) return i
    }

    return -1
  }

  var assign = function(to, i) {
    var from = model.strategicIcons()[i]
    //console.log('replacing', from, to)
    model.strategicIcons()[i] = to
    model.slotUsage[i].push(to)
  }

  var alias = function(to, i) {
    var from = model.strategicIcons()[i]
    //console.log('alias', from, to)
    model.slotUsage[i].push(to)
  }

  var release = function(to) {
    model.slotUsage.forEach(function(slot) {
      var i = slot.indexOf(to)
      if (i > -1) {
        slot.splice(i, 1)
      }
    })
  }

  var tryToAssignString = function(to) {
    var a = assignedIndex(to)
    if (a > -1) return a

    var e = emptySlot()
    if (e > -1) {
      assign(to, e)
      return e
    }

    return -1
  }

  var tryToAssignAlias = function(to, aliases) {
    for (var i in aliases) {
      var a = assignedIndex(aliases[i])
      if (a > -1) {
        alias(to, a)
        return a
      }
    }

    return -1
  }

  var tryToAssignObject = function(obj) {
    Object.keys(obj).forEach(function(to) {
      var s = tryToAssignString(to)
      if (s > -1) return s

      return tryToAssignAlias(to, obj[to])
    })
  }

  var tryToAssignArray = function(array) {
    _.uniq(array).forEach(function(to) {
      if (typeof(to) == 'string') {
        tryToAssignString(to)
      } else {
        tryToAssignObject(to)
      }
    })
  }

  model.requestIcons = function(icons) {
    if (Array.isArray(icons)) {
      tryToAssignArray(icons)
    } else {
      tryToAssignObject(icons)
    }

    model.strategicIcons.notifySubscribers()
  }

  model.releaseIcons = function(icons) {
    if (!testNoFreeSlots) {
      _.uniq(icons).forEach(release)
    }
  }


  var sendLayered = function() {
    var list = model.strategicIcons();

    var layers = Math.max.apply(Math, model.slotUsage.map(function(slot) {
      return slot.length
    }))

    console.log('sending icons. layers:', layers)
    for (var l = layers-1;l >= 0;l--) {
      model.slotUsage.forEach(function(slot, i) {
        if (slot[l]) {
          list[i] = slot[l]
        }
      })
      //console.log(l, list.slice(0))
      engine.call('handle_icon_list', list, 52);
    }
  }

  model.strategicIcons.subscribe(sendLayered)

  model.iconManagmentSetup()

  var removed = _.compact(HodgePodge.removedUnits.map(function(unit) {
    if (unit.si_name === null) return null
    return unit.si_name || unit.spec_id.match(/\/(\w+).json/)[1]
  }))
  if (removed.length > 0) {
    model.releaseIcons(removed)
  }

  var added = _.compact(HodgePodge.addedUnits.map(function(unit) {
    if (unit.si_name === null) return null
    var si_name = unit.si_name || unit.spec_id.match(/\/(\w+).json/)[1]
    if (unit.si_fallback) {
      var o = {}
      o[si_name] = unit.si_fallback
      return o
    } else {
      return si_name
    }
  }))
  if (added.length > 0) {
    model.requestIcons(added)
    console.log('hodgepodge added +' + added.length.toString() + ', ' + model.strategicIcons().length.toString() + '/' + maxIcons + ' icons')
  }
})()
