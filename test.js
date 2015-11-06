'use strict';

require('mocha');
var assert = require('assert');
var assign = require('./');

describe('assign', function() {
  it('should deeply assign properties of objects to the first object:', function() {
    var one = {b: {c: {d: 'e'}}};
    var two = {b: {c: {f: 'g', j: 'i'}}};
    assert.deepEqual(assign(one, two), {b: {c: {d: 'e', f: 'g', j: 'i'}}});
  });

  it('should extend properties onto a function:', function() {
    function target() {}
    var one = {b: {c: {d: 'e'}}};
    var two = {b: {c: {f: 'g', j: 'i'}}};
    assign(target, one, two);
    assert.deepEqual(target.b, {c: {d: 'e', f: 'g', j: 'i'}});
  });

  it('should extend properties from functions to functions:', function() {
    function target() {}
    function one() {}
    function two() {}
    one.b = {c: {d: 'e'}};
    two.b = {c: {f: 'g', j: 'i'}};
    assign(target, one, two);
    assert.deepEqual(target.b, {c: {d: 'e', f: 'g', j: 'i'}});
  });

  it('should update a value when a duplicate is assigned:', function() {
    var one = {b: {c: {d: 'e'}}};
    var two = {b: {c: {d: 'f'}}};
    assert.deepEqual(assign(one, two), {b: {c: {d: 'f'}}});
  });

  it('should not loop over arrays:', function() {
    var one = {b: {c: {d: 'e', g: ['b']}}};
    var two = {b: {c: {d: 'f', g: ['a']}}};
    assert.deepEqual(assign(one, two), {b: {c: {d: 'f', g: ['a']}}});
  });

  it('should deeply assign values from multiple objects:', function() {
    var foo = {};
    var bar = {a: 'b'};
    var baz = {c: 'd', g: {h: 'i'}};
    var quux = {e: 'f', g: {j: 'k'}};

    assign(foo, bar, baz, quux);
    assert.deepEqual(foo, {a: 'b', c: 'd', e: 'f', g: {h: 'i', j: 'k'}});
  });

  it('should not assign primitive arguments:', function() {
    var one = {b: {c: {d: 'e', g: ['b']}}};
    var two = 5;
    assert.deepEqual(assign(one, two), one);
  });

  it('should assign primitive values:', function() {
    var one = {b: {c: {d: 'e', g: ['b']}}};
    var two = {b: 5};
    assert.deepEqual(assign(one, two), {b: 5});
  });

  it('should assign null values:', function() {
    var one = {b: {c: {d: 'e', g: ['b']}}};
    var two = {b: null, c: null};
    assert.deepEqual(assign(one, two), {b: null, c: null});
  });

  it('should assign undefined values:', function() {
    var one = {b: {c: {d: 'e', g: ['b']}}};
    var two = {b: undefined};
    assert.deepEqual(assign(one, two), {b: undefined});
  });

  it('should assign properties to a function:', function() {
    function one() {}
    one.a = 'b';
    one.c = 'd';

    var two = {e: 'f', g: ['h']};
    assign(one, two);
    assert.deepEqual(one.g, ['h']);
    assert.equal(one.g, two.g);
    assert.equal(typeof one, 'function');
  });

  it('should assign properties from a function:', function() {
    function one() {}
    one.a = 'b';
    one.c = 'd';

    var two = {e: 'f', g: ['h']};
    assign(two, one);
    assert.deepEqual(two.g, ['h']);
    assert.equal(two.g, two.g);
    assert.equal(typeof two, 'object');
  });

  it('should deeply mix the properties of object into the first object.', function() {
    var a = assign({a: {aa: 'aa'} }, {a: {bb: 'bb'} }, {a: {cc: 'cc'} });
    assert.deepEqual(a, {a: {aa: 'aa', bb: 'bb', cc: 'cc'} });

    var b = assign({a: {aa: 'aa', dd: {ee: 'ff'} } }, {a: {bb: 'bb', dd: {gg: 'hh'} } }, {a: {cc: 'cc', dd: {ii: 'jj'} } });
    assert.deepEqual(b, {a: {aa: 'aa', dd: {ee: 'ff', gg: 'hh', ii: 'jj'}, bb: 'bb', cc: 'cc'} });
  });

  it('should merge object properties without affecting any object', function() {
    var obj1 = {a: 0, b: 1};
    var obj2 = {c: 2, d: 3};
    var obj3 = {a: 4, d: 5};

    var actual = {a: 4, b: 1, c: 2, d: 5 };

    assert.deepEqual(assign({}, obj1, obj2, obj3), actual);
    assert.notDeepEqual(actual, obj1);
    assert.notDeepEqual(actual, obj2);
    assert.notDeepEqual(actual, obj3);
  });

  it('should do a deep merge', function() {
    var obj1 = {a: {b: 1, c: 1, d: {e: 1, f: 1}}};
    var obj2 = {a: {b: 2, d: {f: 'f'}}};

    assert.deepEqual(assign(obj1, obj2), {a: {b: 2, c: 1, d: {e: 1, f: 'f'} }});
  });

  it('should use the last value defined', function() {
    var obj1 = {a: 'b'};
    var obj2 = {a: 'c'};

    assert.deepEqual(assign(obj1, obj2), {a: 'c'});
  });

  it('should use the last value defined on nested object', function() {
    var obj1 = {a: 'b', c: {d: 'e'}};
    var obj2 = {a: 'c', c: {d: 'f'}};

    assert.deepEqual(assign(obj1, obj2), {a: 'c', c: {d: 'f'}});
  });

  it('should shallow clone when an empty object is passed', function() {
    var obj1 = {a: 'b', c: {d: 'e'}};
    var obj2 = {a: 'c', c: {d: 'f'}};

    var res = assign({}, obj1, obj2);
    assert.deepEqual(res, {a: 'c', c: {d: 'f'}});
  });

  it('should merge additional objects into the first:', function() {
    var obj1 = {a: {b: 1, c: 1, d: {e: 1, f: 1}}};
    var obj2 = {a: {b: 2, d: {f: 'f'} }};

    assign(obj1, obj2);
    assert.deepEqual(obj1, {a: {b: 2, c: 1, d: {e: 1, f: 'f'} }});
  });

  it('should clone objects during merge', function() {
    var obj1 = {a: {b: 1}};
    var obj2 = {a: {c: 2}};

    var target = assign({}, obj1, obj2);
    assert.deepEqual(target, {a: {b: 1, c: 2}});
    assert.deepEqual(target.a, {b: 1, c: 2});
  });

  it('should deep clone arrays during merge', function() {
    var obj1 = {a: [1, 2, [3, 4]]};
    var obj2 = {b: [5, 6]};

    var actual = assign(obj1, obj2);
    assert.deepEqual(actual.a, [1, 2, [3, 4]]);
    assert.deepEqual(actual.a[2], [3, 4]);
    assert.deepEqual(actual.b, obj2.b);
  });

  it('should copy source properties', function() {
    assert(assign({ test: true }).test, true);
  });

  it('should not deep clone arrays', function() {
    assert.deepEqual(assign([1, 2, 3]), [1, 2, 3]);
    assert.deepEqual(assign([1, 2, 3], {}), [1, 2, 3]);
  });

  it('should work with sparse objects:', function() {
    var actual = assign({}, undefined, {a: 'b'}, undefined, {c: 'd'});
    assert.deepEqual(actual, {a: 'b', c: 'd'});
  });

  it('should clone RegExps', function() {
    var fixture = /test/g;
    var actual = assign(fixture);
    assert.deepEqual(actual, fixture);
  });

  it('should clone Dates', function() {
    var fixture = new Date();
    var actual = assign(fixture);
    assert.deepEqual(actual, fixture);
  });

  it('should not clone objects created with custom constructor', function() {
    function TestType() { }
    var fixture = new TestType();
    var actual = assign(fixture);
    assert.deepEqual(actual, fixture);
  });
});

describe('symbols', function() {
  it('should return the first object when one argument is passed:', function() {
    assert.deepEqual(assign({a: 'b'}), {a: 'b'});
  });

  if (typeof Symbol !== 'undefined') {
    it('should assign symbol properties from an object to the receiver', function() {
      var a = {};
      var b = {};
      var key = Symbol('abc');
      b[key] = 'xyz';
      assign(a, b);
      assert.equal(a[key], 'xyz');
    });

    it('should assign symbol properties from each object to the receiver', function() {
      var target = {};
      var a = {};
      var aa = Symbol('aa');
      a[aa] = 'aa';

      var b = {};
      var bb = Symbol('bb');
      b[bb] = 'bb';

      var c = {};
      var cc = Symbol('cc');
      c[cc] = 'cc';

      assign(target, a, b, c);
      assert.equal(target[aa], 'aa');
      assert.equal(target[bb], 'bb');
      assert.equal(target[cc], 'cc');
    });

    it('should not assign non-enumerable symbols', function() {
      var a = {};
      var key = Symbol('abc');
      function App() {}
      App.prototype[key] = 'xyz';
      var app = new App();
      assign(a, app);
      assert.equal(typeof a[key], 'undefined');
    });

    it('should return the receiver object', function() {
      var a = {};
      var b = {};
      var key = Symbol('abc');
      b[key] = 'xyz';
      var res = assign(a, b);
      assert.equal(res[key], 'xyz');
    });
  }
});
