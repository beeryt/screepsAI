import test from 'ava';
import * as _ from 'lodash';
import { OMap } from "../src/structures/OMap";

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

class V {
  private _id: number;
  public get id(): number { return this._id; }
  public constructor(id: number) { this._id = id; }
}

test('minimum of OMap is not infinity', (t): void => {
  const expected = 5;
  let m = new OMap<V, number>();
  for (let i of _.range(expected)) {
    m.set(new V(i), Infinity);
  }
  m.set(new V(0), expected);
  const actual = _.min(Array.from(m.values()));
  t.is(actual, expected);
});
