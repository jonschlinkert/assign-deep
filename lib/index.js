/*!
 * assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017-present, Jon Schlinkert.
 * Released under the MIT License.
 */
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var assignSymbols = require('assign-symbols');

var toString = Object.prototype.toString;

var assign = module.exports = function (target) {
  var i = 0;

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isPrimitive(target)) target = args[i++];
  if (!target) target = {};

  for (; i < args.length; i++) {
    if (isObject(args[i])) {
      var _arr = Object.keys(args[i]);

      for (var _i = 0; _i < _arr.length; _i++) {
        var key = _arr[_i];

        if (isObject(target[key]) && isObject(args[i][key])) {
          assign(target[key], args[i][key]);
        } else {
          target[key] = args[i][key];
        }
      }

      assignSymbols(target, args[i]);
    }
  }

  return target;
};

function isObject(val) {
  return typeof val === 'function' || toString.call(val) === '[object Object]';
}

function isPrimitive(val) {
  return _typeof(val) === 'object' ? val === null : typeof val !== 'function';
}