import {FibonacciHeap, INode} from "@tyriar/fibonacci-heap";

export type Vertex = number;

export type Edge = [Vertex, Vertex];

export interface IGraph<V,E>
{
  vertices: Iterable<V>;
  edges: Iterable<E>;
  weight(u:V, v:V): number
  neighbors(v:V): Iterable<V>;
}

export function dijkstra<V extends Vertex>(graph: IGraph<V,[V,V]>, source: V): [number[], number[]]
{
  let node: INode<number,V>[] = [];
  let dist: number[] = [];
  let prev: number[] = [];
  let Q: FibonacciHeap<number,V> = new FibonacciHeap<number,V>();

  dist[source] = 0;
  for (let v of graph.vertices)
  {
    if (v !== source)
    {
      dist[v] = Infinity;
    }
    node[v] = Q.insert(dist[v],v);
  }

  while (!Q.isEmpty())
  {
    let u:V = (Q.extractMinimum() as {key:number, value:V}).value;

    for (let v of graph.neighbors(u))
    {
      let alt: number = dist[u] + graph.weight(u,v);
      if (alt < dist[v])
      {
        dist[v] = alt;
        prev[v] = u;
        Q.decreaseKey(node[v], alt);
      }
    }
  }
  return [dist,prev];
}
