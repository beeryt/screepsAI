import { FibonacciHeap, INode } from "@tyriar/fibonacci-heap";

export interface IGraph<V>
{
  vertices: Iterable<V>;
  edges: Iterable<[V,V]>;
  weight(u: V, v: V): number;
  neighbors(v: V): Iterable<V>;
}

export function dijkstra<V>(graph: IGraph<V>, source: V): [Map<string,number>, Map<string,V>]
{
  const node = new Map<string, INode<number,V>>();
  const dist = new Map<string,number>();
  const prev = new Map<string,V>();
  const Q = new FibonacciHeap<number, V>();

  dist.set(source.toString(), 0);
  for (const v of graph.vertices)
  {
    if (!_.isEqual(v,source))
    {
      dist.set(v.toString(), Infinity);
    }
    node.set(v.toString(), Q.insert(dist.get(v.toString())!, v));
  }

  while (!Q.isEmpty())
  {
    const u: V = (Q.extractMinimum() as { key: number; value: V}).value;

    for (const v of graph.neighbors(u))
    {
      const alt: number = dist.get(u.toString())! + graph.weight(u, v);

      if (alt < dist.get(v.toString())!)
      {
        dist.set(v.toString(), alt);
        prev.set(v.toString(), u);
        Q.decreaseKey(node.get(v.toString())!, alt);
      }
    }
  }

  return [dist, prev];
}
