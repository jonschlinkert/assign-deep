'use strict';

require('mocha');
const assert = require('assert');
const assign = require('./');

describe('assign', () => {
  it('should deeply assign properties of additional objects to the first object', () => {
    let one = { b: { c: { d: 'e' } } };
    let two = { b: { c: { f: 'g', j: 'i' } } };
    assert.deepEqual(assign(one, two), { b: { c: { d: 'e', f: 'g', j: 'i' } } });
  });

  it('should not assign values in arrays (same as Object.assign)', () => {
    let abc = ['a', 'b'];
    let xyz = ['c', 'd'];
    assert(assign(abc, xyz), xyz);

    let obj = { b: [{ a: { a: 0 } }] };
    let one = assign({}, obj);
    let two = assign({}, obj);

    assert(one !== obj);
    assert(two !== obj);
    assert(one !== two);
    assert(one.b === two.b);
    one.b[0].a = { b: 0 };
    two.b[0].a = { c: 0 };
    assert.deepEqual(one.b[0].a, { c: 0 });
  });

  it('should extend properties onto a function', () => {
    function target() {}
    let one = { b: { c: { d: 'e' } } };
    let two = { b: { c: { f: 'g', j: 'i' } } };
    assign(target, one, two);
    assert.deepEqual(target.b, { c: { d: 'e', f: 'g', j: 'i' } });
  });

  it('should extend ignore primitives', () => {
    function target() {}
    let one = { b: { c: { d: 'e' } } };
    let two = { b: { c: { f: 'g', j: 'i' } } };
    assign('foo', target, one, two);
    assert.deepEqual(target.b, { c: { d: 'e', f: 'g', j: 'i' } });
  });

  it('should extend deeply nested functions', () => {
    let fn = function() {};
    let target = {};
    let one = { b: { c: { d: fn } } };
    let two = { b: { c: { f: 'g', j: 'i' } } };
    assign(target, one, two);
    assert.deepEqual(target.b, { c: { d: fn, f: 'g', j: 'i' } });
  });

  it('should extend deeply nested functions with properties', () => {
    let fn = function() {};
    fn.foo = 'foo';
    fn.bar = 'bar';

    let target = {};
    let one = { b: { c: { d: fn } } };
    let two = { b: { c: { f: 'g', j: 'i' } } };
    assign(target, one, two);
    assert.deepEqual(target.b, { c: { d: fn, f: 'g', j: 'i' } });
  });

  it('should invoke getters and setters', () => {
    let name, username;
    let config = {
      set name(val) {
        name = val;
      },
      get name() {
        return name;
      },
      set username(val) {
        username = val;
      },
      get username() {
        return username || 'jonschlinkert';
      },
      get other() {
        return 'other';
      }
    };
    let locals = {
      get name() {
        return 'Brian';
      },
      get username() {
        return 'doowb';
      }
    }
    let result = assign(config, locals);
    assert(result === config);
    assert.equal(result.name, 'Brian');
    assert.equal(result.username, 'doowb');
    assert.equal(result.other, 'other');
  });

  it('should extend functions with nested properties', () => {
    let aaa = () => {};
    aaa.foo = { y: 'y' };
    aaa.bar = { z: 'z' };

    let bbb = () => {};
    bbb.foo = { w: 'w' };
    bbb.bar = { x: 'x' };

    let result = assign(aaa, bbb);
    assert(aaa === result);

    assert.deepEqual(result.foo, { y: 'y', w: 'w' });
    assert.deepEqual(result.bar, { z: 'z', x: 'x' });
  });

  it('should extend properties from functions to functions', () => {
    function target() {}
    function one() {}
    function two() {}
    one.b = { c: { d: 'e' } };
    two.b = { c: { f: 'g', j: 'i' } };
    assign(target, one, two);
    assert.deepEqual(target.b, { c: { d: 'e', f: 'g', j: 'i' } });
  });

  it('should update a value when a duplicate is assigned', () => {
    let one = { b: { c: { d: 'e' } } };
    let two = { b: { c: { d: 'f' } } };
    assert.deepEqual(assign(one, two), { b: { c: { d: 'f' } } });
  });

  it('should not loop over arrays', () => {
    let one = { b: { c: { d: 'e', g: ['b'] } } };
    let two = { b: { c: { d: 'f', g: ['a'] } } };
    assert.deepEqual(assign(one, two), { b: { c: { d: 'f', g: ['a'] } } });
  });

  it('should deeply assign values from multiple objects', () => {
    let foo = {};
    let bar = { a: 'b' };
    let baz = { c: 'd', g: { h: 'i' } };
    let quux = { e: 'f', g: { j: 'k' } };

    assign(foo, bar, baz, quux);
    assert.deepEqual(foo, { a: 'b', c: 'd', e: 'f', g: { h: 'i', j: 'k' } });
  });

  it('should not assign primitive arguments', () => {
    let one = { b: { c: { d: 'e', g: ['b'] } } };
    let two = 5;
    assert.deepEqual(assign(one, two), one);
  });

  it('should assign primitive values', () => {
    let one = { b: { c: { d: 'e', g: ['b'] } } };
    let two = { b: 5 };
    assert.deepEqual(assign(one, two), { b: 5 });
  });

  it('should assign over primitive values', () => {
    let one = { b: { c: { d: 'e', g: ['b'] } } };
    let two = { b: 5 };
    let three = { b: function() {} };
    three.b.foo = 'bar';
    assert.deepEqual(assign(one, two, three), three);
  });

  it('should assign null values', () => {
    let one = { b: { c: { d: 'e', g: ['b'] } } };
    let two = { b: null, c: null };
    assert.deepEqual(assign(one, two), { b: null, c: null });
  });

  it('should assign undefined values', () => {
    let one = { b: { c: { d: 'e', g: ['b'] } } };
    let two = { b: undefined };
    assert.deepEqual(assign(one, two), { b: undefined });
  });

  it('should assign properties to a function', () => {
    function one() {}
    one.a = 'b';
    one.c = 'd';

    let two = { e: 'f', g: ['h'] };
    assign(one, two);
    assert.deepEqual(one.g, ['h']);
    assert.equal(one.g, two.g);
    assert.equal(typeof one, 'function');
  });

  it('should assign properties from a function', () => {
    function one() {}
    one.a = 'b';
    one.c = 'd';

    let two = { e: 'f', g: ['h'] };
    assign(two, one);
    assert.deepEqual(two.g, ['h']);
    assert.equal(two.g, two.g);
    assert.equal(typeof two, 'object');
  });

  it('should deeply mix the properties of object into the first object.', () => {
    let a = assign({ a: { aa: 'aa' } }, { a: { bb: 'bb' } }, { a: { cc: 'cc' } });
    assert.deepEqual(a, { a: { aa: 'aa', bb: 'bb', cc: 'cc' } });

    let b = assign(
      { a: { aa: 'aa', dd: { ee: 'ff' } } },
      { a: { bb: 'bb', dd: { gg: 'hh' } } },
      { a: { cc: 'cc', dd: { ii: 'jj' } } }
    );
    assert.deepEqual(b, { a: { aa: 'aa', dd: { ee: 'ff', gg: 'hh', ii: 'jj' }, bb: 'bb', cc: 'cc' } });
  });

  it('should merge object properties without affecting any object', () => {
    let obj1 = { a: 0, b: 1 };
    let obj2 = { c: 2, d: 3 };
    let obj3 = { a: 4, d: 5 };

    let actual = { a: 4, b: 1, c: 2, d: 5 };

    assert.deepEqual(assign({}, obj1, obj2, obj3), actual);
    assert.notDeepEqual(actual, obj1);
    assert.notDeepEqual(actual, obj2);
    assert.notDeepEqual(actual, obj3);
  });

  it('should do a deep merge', () => {
    let obj1 = { a: { b: 1, c: 1, d: { e: 1, f: 1 } } };
    let obj2 = { a: { b: 2, d: { f: 'f' } } };

    assert.deepEqual(assign(obj1, obj2), { a: { b: 2, c: 1, d: { e: 1, f: 'f' } } });
  });

  it('should use the last value defined', () => {
    let obj1 = { a: 'b' };
    let obj2 = { a: 'c' };

    assert.deepEqual(assign(obj1, obj2), { a: 'c' });
  });

  it('should use the last value defined on nested object', () => {
    let obj1 = { a: 'b', c: { d: 'e' } };
    let obj2 = { a: 'c', c: { d: 'f' } };

    assert.deepEqual(assign(obj1, obj2), { a: 'c', c: { d: 'f' } });
  });

  it('should shallow clone when an empty object is passed', () => {
    let obj1 = { a: 'b', c: { d: 'e' } };
    let obj2 = { a: 'c', c: { d: 'f' } };

    let res = assign({}, obj1, obj2);
    assert.deepEqual(res, { a: 'c', c: { d: 'f' } });
  });

  it('should merge additional objects into the first', () => {
    let obj1 = { a: { b: 1, c: 1, d: { e: 1, f: 1 } } };
    let obj2 = { a: { b: 2, d: { f: 'f' } } };

    assign(obj1, obj2);
    assert.deepEqual(obj1, { a: { b: 2, c: 1, d: { e: 1, f: 'f' } } });
  });

  it('should clone objects during merge', () => {
    let obj1 = { a: { b: 1 } };
    let obj2 = { a: { c: 2 } };

    let target = assign({}, obj1, obj2);
    assert.deepEqual(target, { a: { b: 1, c: 2 } });
    assert.deepEqual(target.a, { b: 1, c: 2 });
  });

  it('should deep clone arrays during merge', () => {
    let obj1 = { a: [1, 2, [3, 4]] };
    let obj2 = { b: [5, 6] };

    let actual = assign(obj1, obj2);
    assert.deepEqual(actual.a, [1, 2, [3, 4]]);
    assert.deepEqual(actual.a[2], [3, 4]);
    assert.deepEqual(actual.b, obj2.b);
  });

  it('should copy source properties', () => {
    assert(assign({ test: true }).test, true);
  });

  it('should not deep clone arrays', () => {
    assert.deepEqual(assign([1, 2, 3]), [1, 2, 3]);
    assert.deepEqual(assign([1, 2, 3], {}), [1, 2, 3]);
  });

  it('should iterate over sparse arguments', () => {
    let actual = assign({}, undefined, { a: 'b' }, undefined, { c: 'd' });
    assert.deepEqual(actual, { a: 'b', c: 'd' });
  });

  it('should clone RegExps', () => {
    let fixture = /test/g;
    let actual = assign(fixture);
    assert.deepEqual(actual, fixture);
  });

  it('should clone Dates', () => {
    let fixture = new Date();
    let actual = assign(fixture);
    assert.deepEqual(actual, fixture);
  });

  it('should not clone objects created with custom constructor', () => {
    function TestType() {}
    let fixture = new TestType();
    let actual = assign(fixture);
    assert.deepEqual(actual, fixture);
  });
});

describe('symbols', () => {
  it('should return the first object when one argument is passed', () => {
    assert.deepEqual(assign({ a: 'b' }), { a: 'b' });
  });

  if (typeof Symbol !== 'undefined') {
    it('should assign symbol properties from an object to the receiver', () => {
      let a = {};
      let b = {};
      let key = Symbol('abc');
      b[key] = 'xyz';
      assign(a, b);
      assert.equal(a[key], 'xyz');
    });

    it('should deeply assign symbol properties', () => {
      let a = { c: { e: { f: {} } } };
      let b = { c: { e: { g: {} } } };
      let foo = Symbol('foo');
      let bar = Symbol('bar');
      a.c.e.f[foo] = 'xyz';
      b.c.e.g[bar] = 'xyz';
      assign(a, b);
      assert.equal(a.c.e.f[foo], 'xyz');
      assert.equal(a.c.e.g[bar], 'xyz');
    });

    it('should assign symbol properties from each object to the receiver', () => {
      let target = {};
      let a = {};
      let aa = Symbol('aa');
      a[aa] = 'aa';

      let b = {};
      let bb = Symbol('bb');
      b[bb] = 'bb';

      let c = {};
      let cc = Symbol('cc');
      c[cc] = 'cc';

      assign(target, a, b, c);
      assert.equal(target[aa], 'aa');
      assert.equal(target[bb], 'bb');
      assert.equal(target[cc], 'cc');
    });

    it('should not assign non-enumerable symbols', () => {
      let a = {};
      let key = Symbol('abc');
      function App() {}
      App.prototype[key] = 'xyz';
      let app = new App();
      assign(a, app);
      assert.equal(typeof a[key], 'undefined');
    });

    it('should return the receiver object', () => {
      let a = {};
      let b = {};
      let key = Symbol('abc');
      b[key] = 'xyz';
      let res = assign(a, b);
      assert.equal(res[key], 'xyz');
    });
  }
});
