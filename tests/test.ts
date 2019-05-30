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
