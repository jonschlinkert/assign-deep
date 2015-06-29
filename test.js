/*!
 * assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

/* deps: mocha */
require('should');
var assert = require('assert');
var assign = require('./');

describe('assign', function () {
  it('should deeply assign properties of objects to the first object:', function () {
    var one = {b: {c: {d: 'e'}}};
    var two = {b: {c: {f: 'g', j: 'i'}}};
    assign(one, two).should.eql({b: {c: {d: 'e', f: 'g', j: 'i'}}});
  });

  it('should update a value when a duplicate is assigned:', function () {
    var one = {b: {c: {d: 'e'}}};
    var two = {b: {c: {d: 'f'}}};
    assign(one, two).should.eql({b: {c: {d: 'f'}}});
  });

  it('should not loop over arrays:', function () {
    var one = {b: {c: {d: 'e', g: ['b']}}};
    var two = {b: {c: {d: 'f', g: ['a']}}};
    assign(one, two).should.eql({b: {c: {d: 'f', g: ['a']}}});
  });

  it('should deeply assign values from multiple objects:', function () {
    var foo = {};
    var bar = {a: 'b'};
    var baz = {c: 'd', g: {h: 'i'}};
    var quux = {e: 'f', g: {j: 'k'}};

    assign(foo, bar, baz, quux);
    foo.should.eql({a: 'b', c: 'd', e: 'f', g: {h: 'i', j: 'k'}});
  });

  it('should not assign primitive arguments:', function () {
    var one = {b: {c: {d: 'e', g: ['b']}}};
    var two = 5;
    assign(one, two).should.eql(one);
  });

  it('should assign primitive values:', function () {
    var one = {b: {c: {d: 'e', g: ['b']}}};
    var two = {b: 5};
    assign(one, two).should.eql({b: 5});
  });

  it('should assign null values:', function () {
    var one = {b: {c: {d: 'e', g: ['b']}}};
    var two = {b: null, c: null};
    assign(one, two).should.eql({b: null, c: null});
  });

  it('should assign undefined values:', function () {
    var one = {b: {c: {d: 'e', g: ['b']}}};
    var two = {b: undefined};
    assign(one, two).should.eql({b: undefined});
  });

  it('should assign properties to a function:', function () {
    function one() {}
    one.a = 'b';
    one.c = 'd';

    var two = {e: 'f', g: ['h']};
    assign(one, two);
    one.g.should.eql(['h']);
    one.g.should.equal(two.g);
    assert.equal(typeof one, 'function');
  });

  it('should assign properties from a function:', function () {
    function one() {}
    one.a = 'b';
    one.c = 'd';

    var two = {e: 'f', g: ['h']};
    assign(two, one);
    two.g.should.eql(['h']);
    two.g.should.equal(two.g);
    assert.equal(typeof two, 'object');
  });
});

