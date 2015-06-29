/*!
 * assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require('is-extendable');
var typeOf = require('kind-of');

function assign(o/*, objects*/) {
  if (!isObject(o)) { o = {}; }

  var len = arguments.length;
  for (var i = 1; i < len; i++) {
    extend(o, arguments[i]);
  }
  return o;
}

/**
 * Shallow extend
 */

function extend(target, obj) {
  if (!isObject(obj)) {
    return target;
  }

  if (isObject(obj)) {
    for (var key in obj) {
      if (hasOwn(obj, key)) {
        var val = obj[key];

        // `val` an object with keys?
        if (typeOf(val) === 'object') {
          target[key] = extend(target[key] || {}, val);
        } else {
          target[key] = val;
        }
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
