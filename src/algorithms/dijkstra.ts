import { FibonacciHeap, INode } from "@tyriar/fibonacci-heap";
import { OMap, IKey } from "../OMap";

/**
 * Interface for a weighted graph.
 * @typeparam V   An object representing a vertex in the graph
 */
export interface IGraph<V>
{
  /** An iterable list of vertices for the graph. */
  vertices: Iterable<V>;
  /** An iterable list of edges for the graph. */
  edges: Iterable<[V,V]>;

  /**
   * Returns the weight of the edge between two vertices
   * @param u   The starting vertex
   * @param v   The ending vertex
   * @returns   number weight of edge or `NaN` if no edge exists
   */
  weight(u: V, v: V): number;

  /**
   * Returns the neighboring vertices of `v`.
   * @param v   The vertex to search
   * @returns   An iterable list of vertices which neighbor `v`
   */
  neighbors(v: V): Iterable<V>;
}

export function dijkstra<V extends IKey>(graph: IGraph<V>, source: V): [OMap<V, number>, OMap<V, V>] {
  const node = new OMap<V, INode<number,V>>();
  const dist = new OMap<V, number>();
  const prev = new OMap<V, V>();
  const Q = new FibonacciHeap<number, V>();

  dist.set(source, 0);
  for (const v of graph.vertices) {
    if (!_.isEqual(_.toPlainObject(v),_.toPlainObject(source))) {
      dist.set(v, Infinity);
    }
    node.set(v, Q.insert(dist.get(v)!, v));
  }

  while (!Q.isEmpty()) {
    const u = Q.extractMinimum()!.value!;

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
