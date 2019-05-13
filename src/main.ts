import { dijkstra, IGraph, Vertex, Edge } from "./algorithms/dijkstra"

class Graph<V extends Vertex, E> implements IGraph<V,E>
{
  vertices: V[] = [];
  edges: E[] = [];
  constructor()
  {
    for (let v = 0; v < 5; ++v)
    {
      this.vertices.push(v as V);
    }
  }
  neighbors(v:V): V[]
  {
    let vertices:V[] = Array.from(this.vertices);
    vertices.splice(v,1);
    return vertices;
  }
  weight(u:V,v:V): number
  {
    return Math.abs(v - u) + 1;
  }
}


let g = new Graph<Vertex, Edge>();
g.vertices.length = 4;

for (let v of g.vertices)
{
  console.log(g.neighbors(v));
}

console.log(dijkstra(g,1));
