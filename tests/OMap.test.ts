import test, { TestInterface } from 'ava';
import * as _ from 'lodash';
import { OMap } from "../src/structures/OMap";

class V {
  private _id: number;
  public get id(): number { return this._id; }
  public constructor(id: number) { this._id = id; }
}

const ava = test as TestInterface<{om: OMap<V, number>}>;

ava.beforeEach((t): void => {
  t.context = {om: new OMap<V,number>()};
});

ava("constructor", (t): void => {
  const OM = t.context.om;
  t.deepEqual(OM, new OMap<V,number>());
  t.is(OM.size, 0);
});

ava("insert", (t): void => {
  const OM = t.context.om;
  const size = 5;
  for (const i of _.range(size)) {
    OM.set(new V(i), i**2);
    t.is(OM.size, i + 1);
    t.true(OM.has(new V(i)));
    t.is(OM.get(new V(i)), i**2);
  }
});



ava("clear", (t): void => {
  const OM = t.context.om;
  const size = 5;
  for (const i of _.range(size)) {
    OM.set(new V(i), i**2);
    t.is(OM.size, i + 1);
  }
  OM.clear();
  t.is(OM.size, 0);
  for (const i of _.range(size)) {
    t.is(OM.get(new V(i)), undefined);
  }
});

ava("delete", (t): void => {
  const OM = t.context.om;
  const size = 5;
  for (const i of _.range(size)) {
    OM.set(new V(i), i**2);
  }
  t.is(OM.size, 5);
  for (const i of _.range(size)) {
    t.is(OM.size, size - i);
    t.true(OM.delete(new V(i)));
  }
  t.is(OM.size, 0);
});

ava("no duplicate entries", (t): void => {
  const OM = t.context.om;
  const size = 5;
  const index = 0;
  for (const i of _.range(size)) {
    OM.set(new V(index), i**2);
    t.is(OM.size, 1);
    t.is(OM.get(new V(index)), i**2);
  }
});

ava("forEach insertion order", (t): void => {
  const OM = t.context.om;
  const size = 5;
  let keys: V[] = [];
  let vals: number[] = [];
  for (const i of _.range(size)) {
    keys.push(new V(i));
    vals.push(i**2);
    OM.set(keys[keys.length-1], vals[vals.length-1]);
  }

  OM.forEach((v,k): void => {
    t.is(k, keys.shift());
    t.is(v, vals.shift());
  });
});

ava("entries insertion order", (t): void => {
  const OM = t.context.om;
  const size = 5;
  const keys: V[] = [];
  const vals: number[] = [];
  for (const i of _.range(size)) {
    let k = new V(i);
    let v = i**2;
    keys.push(k);
    vals.push(v);
    OM.set(k,v);
  }

  for (const kv of Array.from(OM.entries())) {
    t.is(kv[0],keys.shift());
    t.is(kv[1],vals.shift());
  }
});

ava("keys insertion order", (t): void => {
  const OM = t.context.om;
  const size = 5;
  const keys: V[] = [];
  for (const i of _.range(size)) {
    let k = new V(i);
    keys.push(k);
    OM.set(k, i**2);
  }

  for (const k of Array.from(OM.keys())) {
    t.is(k,keys.shift());
  }
});

ava("values insertion order", (t): void => {
  const OM = t.context.om;
  const size = 5;
  const vals: number[] = [];
  for (const i of _.range(size)) {
    let v = i**2;
    vals.push(v);
    OM.set(new V(i), v);
  }

  for (const v of Array.from(OM.values())) {
    t.is(v,vals.shift());
  }
});

ava("minimum of OMap is not Infinity", (t): void => {
  const OM = t.context.om;
  const size = 5;
  for (const i of _.range(size)) {
    OM.set(new V(i), Infinity);
  }
  t.is(_.min(Array.from(OM.values())), Infinity);
  OM.set(new V(0), 0);
  t.is(_.min(Array.from(OM.values())), 0);
});
