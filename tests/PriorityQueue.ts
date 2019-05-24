import anyTest, {TestInterface} from 'ava';
import { FibonacciHeap } from "@tyriar/fibonacci-heap";

interface IContext {
  Q: FibonacciHeap<number, any>;
}

const test = anyTest as TestInterface<IContext>;

test.beforeEach((t): void => {
  t.context.Q = new FibonacciHeap<number, any>();
});

test("constructor", (t): void => {
  const Q = new FibonacciHeap<number, any>();
  let ret: any;
  t.deepEqual(Q, t.context.Q);
  t.true(Q.isEmpty());
  t.is(Q.size(), 0);
  ret = Q.findMinimum();
  t.is(ret, null);
  ret = Q.extractMinimum();
  t.is(ret, null);
});

test("isEmpty", (t): void => {
  const Q = t.context.Q;
  t.true(Q.isEmpty());

  Q.insert(1);
  t.false(Q.isEmpty());

  Q.extractMinimum();
  t.true(Q.isEmpty());
});

test("insert", (t): void => {
  const Q = t.context.Q;
  for (let i = 0; i < 100; ++i) {
    let k = i - 50;
    t.is(Q.size(), i);
    let ret = Q.insert(k, i**2);
    t.is(ret.key, k);
    t.is(ret.value, i**2);
    t.is(Q.size(), i+1);
  }
});

test("extractMinimum", (t): void => {
  const Q = t.context.Q;
  const values = [5, 3, 4, 1, 2];
  const sorted = values.sort();

  // insert unsorted values
  for (const v of values) {
    Q.insert(v);
  }

  // assert they are sorted
  for (const i of sorted) {
    t.is(Q.extractMinimum()!.key, i);
  }

  t.is(Q.extractMinimum(), null);
});

test("decreaseKey", (t): void => {
  const Q = t.context.Q;

  // should throw an exception given a non-existent node
  t.throws((): void => { Q.decreaseKey(undefined as any, 0); });

  // should throw an exception given a new key larger than old
  const node = Q.insert(1);
  t.throws((): void => { Q.decreaseKey(node, 2); });

  // should decrease the node
  Q.insert(2);
  Q.decreaseKey(node, 0);
  const key = Q.findMinimum()!.key;
  t.is(key, node.key);
  t.is (key, 0);
});
