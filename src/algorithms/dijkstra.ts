import { FibonacciHeap, INode } from "@tyriar/fibonacci-heap";
import { ObjectMap, IKey } from "../ObjectMap";

export interface IGraph<V>
{
  vertices: Iterable<V>;
  edges: Iterable<[V,V]>;
  weight(u: V, v: V): number;
  neighbors(v: V): Iterable<V>;
}

export function dijkstra<V extends IKey>(graph: IGraph<V>, source: V): [ObjectMap<V, number>, ObjectMap<V, V>] {
  const node = new ObjectMap<V, INode<number,string>>();
  const keys = new Map<string, V>();
  const dist = new ObjectMap<V, number>();
  const prev = new ObjectMap<V, V>();
  const Q = new FibonacciHeap<number, string>();

  dist.set(source, 0);
  let distCounter = 1;
  let vertCounter = 0;
  for (const v of graph.vertices) {
    vertCounter += 1;
    keys.set(v.toString(), v);
    if (!_.isEqual(_.toPlainObject(v),_.toPlainObject(source))) {
      distCounter += 1;
      dist.set(v, Infinity);
    }
    node.set(v, Q.insert(dist.get(v)!, v.toString()));
  }
  console.log("Dijkstra dist size:", dist.size, `(${distCounter}/${vertCounter})`);

  let processed = 0;
  let truncated = 0;
  let neighbors = 0;
  let undifiner = 0;
  while (!Q.isEmpty()) {
    processed += 1;
    const ino = Q.extractMinimum()!;
    const u = keys.get(ino.value!)!;

    for (const v of graph.neighbors(u)) {
      neighbors += 1;
      const alt: number = dist.get(u)! + graph.weight(u, v);

      if (alt < dist.get(v)!) {
        truncated += 1;
        dist.set(v, alt);
        prev.set(v, u);
        let n = node.get(v);
        if (n === undefined) undifiner += 1;
        Q.decreaseKey(node.get(v)!, alt);
      }
    }
  }

  console.log("Processed:", processed, neighbors, truncated, undifiner);
  return [dist, prev];
}
