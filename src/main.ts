import { dijkstra, Graph, Vertex, Edge } from "./algorithms/dijkstra";

class _Graph implements Graph
{
  vertices:Vertex[];
  edges:Edge[];
  constructor()
  {
    this.vertices = [];
    this.edges = [];
  }

  neighbors(v:Vertex): Vertex[]
  {
    return [];
  }
}

let g:Graph =  new _Graph();
for (let i = 0; i < 81; ++i)
{
  let v:Vertex = {id:i, edges:[], neighbors:[], value:null};
  if (i > 0) v.neighbors.push({id:i-1, edges:[], neighbors:[], value:null});
  g.vertices.push(v);
}
dijkstra(g, {id:0, edges:[], neighbors:[], value:null});
