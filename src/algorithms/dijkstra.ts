import {FibonacciHeap, INode} from "@tyriar/fibonacci-heap";

export interface Iterable<K>
{
  [Symbol.iterator]() :Iterator<K>;
}

export interface Graph<V,E>
{
  vertices: Iterable<V>;
  edges: Iterable<E>;
  neighbors(v: V): V[];
  weight(u: V, v: V): number;
}

export interface Vertex
{
  id: number;
}

export interface Edge
{
  weight: number;
}

export function dijkstra<V extends Vertex, E extends Edge|never>(graph: Graph<V,E>, node: V): any
{
  let dist: Array<number> = [];
  let prev: Array<number|undefined> = [];
  let Q: FibonacciHeap<number,V> = new FibonacciHeap<number,V>();

  dist[node.id] = 0;
  for (let v of graph.vertices)
  {
    dist.push(Infinity);
    prev.push(undefined);
    Q.insert(dist[v.id],v);
  }

  while (!Q.isEmpty())
  {
    let u:V = (Q.extractMinimum() as {key:number, value:V}).value;

    graph.neighbors(u).forEach(v =>
    {
      let alt: number = dist[u.id] + 1;
      if (alt < dist[v.id])
      {
        Q.decreaseKey({key:dist[v.id], value:v}, alt);
        dist[v.id] = alt;
        prev[v.id] = alt;
      }
    });
  }
  return [dist,prev];
}
