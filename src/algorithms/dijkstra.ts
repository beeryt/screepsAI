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
  const node = new ObjectMap<V, INode<number,V>>();
  const dist = new ObjectMap<V, number>();
  const prev = new ObjectMap<V, V>();
  const Q = new FibonacciHeap<number, V>();

  dist.set(source, 0);
  for (const v of graph.vertices) {
    if (!_.isEqual(v,source)) {
      dist.set(v, Infinity);
    }
    node.set(v, Q.insert(dist.get(v)!, v));
  }

  while (!Q.isEmpty()) {
    const u: V = (Q.extractMinimum() as { key: number; value: V}).value;

    for (const v of graph.neighbors(u)) {
      const alt: number = dist.get(u)! + graph.weight(u, v);

      if (alt < dist.get(v)!) {
        dist.set(v, alt);
        prev.set(v, u);
        Q.decreaseKey(node.get(v)!, alt);
      }
    }
  }

  return [dist, prev];
}
