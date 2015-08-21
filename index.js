/*!
 * assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var lazy = require('lazy-cache')(require);
// lazily require dependencies (with aliases)
lazy('is-extendable', 'isObject');
lazy('kind-of', 'typeOf');

function assign(target, objects) {
  target = target || {};

  var len = arguments.length;
  for (var i = 1; i < len; i++) {
    var val = arguments[i];
    if (lazy.isObject(val)) {
      extend(target, val);
    }
  }
  return target;
}

/**
 * Shallow extend
 */

function extend(target, obj) {
  for (var key in obj) {
    if (hasOwn(obj, key)) {
      var val = obj[key];
      if (lazy.typeOf(val) === 'object') {
        target[key] = extend(target[key] || {}, val);
      } else {
        target[key] = val;
      }
    }
  }
  return target;
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Expose `assign`
 */

module.exports = assign;
