/*!
 * assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

require('should');
var assignDeep = require('./');

describe('assignDeep', function () {
  it('should deeply assign properties of objects to the first object:', function () {
    var one = {b: {c: {d: 'e'}}};
    var two = {b: {c: {f: 'g', j: 'i'}}};
    assignDeep(one, two).should.eql({b: {c: {d: 'e', f: 'g', j: 'i'}}});
  });

  it('should update a value when a duplicate is assigned:', function () {
    var one = {b: {c: {d: 'e'}}};
    var two = {b: {c: {d: 'f'}}};
    assignDeep(one, two).should.eql({b: {c: {d: 'f'}}});
  });

  it('should not merge arrays:', function () {
    var one = {b: {c: {d: 'e', g: ['b']}}};
    var two = {b: {c: {d: 'f', g: ['a']}}};
    assignDeep(one, two).should.eql({b: {c: {d: 'f', g: ['a']}}});
  });
});
