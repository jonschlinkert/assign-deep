/*!
 * assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require('is-plain-object');

/**
 * Expose `assign`
 */

module.exports = assign;

function assign(o, objects) {
  if (!isObject(o)) return {};
  if (!isObject(objects)) return o;

  var len = arguments.length - 1;
  for (var i = 0; i < len; i++) {
    var obj = arguments[i + 1];
    if (isObject(obj)) {
      extend(o, obj);
    }
  }
  return o;
}

function extend(o, obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var val = obj[key];
      if (isObject(val)) {
        assign(o[key], val);
      } else {
        o[key] = val;
      }
    }
  }
  return o;
}
