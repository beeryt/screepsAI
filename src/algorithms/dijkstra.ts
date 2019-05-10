import {FibonacciHeap, INode} from "@tyriar/fibonacci-heap";

export interface Vertex
{
  id: number;
  edges: Edge[];
  value: any;
  neighbors: Vertex[];
}

export interface Edge
{
  vertices: [Vertex, Vertex];
  weight: number;
  directional?: boolean;
}

export interface Graph
{
  vertices: Vertex[];
  edges: Edge[];
  neighbors(v: Vertex): Vertex[];
}

export function dijkstra(graph: Graph, node: Vertex): any
{
  let dist: number[] = new Array(2500).fill(Infinity);
  let prev: number[] = new Array(2500).fill(undefined);
  let Q: FibonacciHeap<number,Vertex> = new FibonacciHeap<number,Vertex>();

  dist[node.id] = 0;
  graph.vertices.forEach(v => Q.insert(dist[v.id], v));

  while (!Q.isEmpty())
  {
    let u:Vertex = (Q.extractMinimum() as {key:number, value:Vertex}).value;

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
