import test from 'ava';
import * as _ from 'lodash';

test('one plus three equals two', (t): void => {
  t.is(1+2, 3);
});

test('minimum of map not infinity', (t): void => {
  const expected = 5;
  let m = new Map<number, number>();
  for (let i of _.range(5)) {
    m.set(i, Infinity);
  }
  m.set(0, expected);
  const actual = _.min(Array.from(m.values()));
  t.is(actual, expected);
});

test('deep equal not ===', (t): void => {
  const U = new Map<number,number>();
  const V = new Map<number,number>();
  t.not(U,V);
  t.false(U === V);
  t.deepEqual(U,V);
});

let testObject = {
  [Symbol.toPrimitive](hint: string): number|string|symbol {
    console.log("Symbol.toPrimitive:", hint);
    switch(hint) {
      case "number": return 6;
      case "string": return "testObject";
      case "default": return 5;
      default: return 8;
    }
  }
};

test('map does bad equal', (t): void => {
  let a = {name: "john"};
  let b = {name: 'john'};
  t.deepEqual(a,b);
  t.not(a,b);
  let m = new Map<any,any>();
  m.set(a, 1);
  t.true(m.has(a));
  m.set(b, 3);
  t.true(m.has(b));
  t.is(m.get(a), 1);
  t.is(m.get(b), 3);
  t.false(m.delete({name: "john"}));
});

test('toPrimitive', (t): void => {
  t.is(testObject + '', '5');
  t.is(`${testObject}`, "testObject");
  t.is(+testObject, 6);
  let m = new Map<any,any>();
  console.log("next:");
  m.set(testObject, 4);
  t.true(m.has(testObject));
  t.is(m.get(testObject), 4);
});

test('toString exists on everything', (t): void => {
  const a = "apple";
  const b = 55;
  const c = ["apple", 55, {a:[]}];
  const d = {string:"", number:0, list:[], object:{}};
  t.is(a.toString(), "apple");
  t.is(b.toString(), "55");
  t.is(c.toString(), "apple,55,[object Object]");
  t.is(d.toString(), "[object Object]");
  t.is(a.valueOf(), "apple");
  t.is(b.valueOf(), 55);
  t.is(c.valueOf(), c);
  t.deepEqual(c.valueOf(), ["apple", 55, {a:[]}]);
  t.is(d.valueOf(), d);
  t.deepEqual(d.valueOf(), {string:"",number:0,list:[],object:{}});
});
