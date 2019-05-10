// Import npm module
import { FibonacciHeap } from '@tyriar/fibonacci-heap';

// Construct FibonacciHeap
const heap = new FibonacciHeap<number, any>();
// Insert keys only
heap.insert(3);
heap.insert(7);
// Insert keys and values
heap.insert(8, {foo: 'bar'});
heap.insert(1, {foo: 'baz'});

// Extract all nodes in order
while (!heap.isEmpty()) {
  const node:any = heap.extractMinimum();
  console.log('key: ' + node.key + ', value: ' + node.value);
}
console.log()
// > key: 1, value: [object Object]
// > key: 3, value: undefined
// > key: 7, value: undefined
// > key: 8, value: [object Object]

const heap1 = new FibonacciHeap<number, any>(function(a:any, b:any) {
  if (a.key < b.key) return 1;
  if (a.key > b.key) return -1;
  return 0;
});
heap1.insert(3);
heap1.insert(7);
heap1.insert(8, {});
heap1.insert(1, {});

while (!heap1.isEmpty()) {
  const node:any = heap1.extractMinimum();
  console.log('key: ' + node.key + ', value: ' + node.value);
}
console.log()

// Construct custom compare FibonacciHeap
const heap2 = new FibonacciHeap<string, string>(function (a:any, b:any) {
  return (a.key + a.value).localeCompare(b.key + b.value);
});
heap2.insert('2', 'B');
heap2.insert('1', 'a');
heap2.insert('1', 'A');
heap2.insert('2', 'b');

// Extract all nodes in order
while (!heap2.isEmpty()) {
  const node:any = heap2.extractMinimum();
  console.log('key: ' + node.key + ', value: ' + node.value);
}
// > key: 1, value: a
// > key: 1, value: A
// > key: 2, value: b
// > key: 2, value: B
