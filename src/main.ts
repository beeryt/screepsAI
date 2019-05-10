import { dijkstra, Graph, Vertex, Edge } from "./algorithms/dijkstra";

class AdjacencyList extends Array<Edge>
{
  container: Array<Edge>;
  constructor()
  {
    super();
    this.container = [];
  }

  push(...e:Array<Edge>): void
  {

  }
}

class _Graph implements Graph
{
  vertices:Vertex[];
  edges:AdjacencyList;
  constructor()
  {
    this.vertices = [];
    this.edges = [];
  }

  neighbors(v:Vertex): Vertex[]
  {
    return [];
  }

  adjacent(v:Vertex, u:Vertex): boolean
  {
    this.edges.push({weight:1});
    return false;
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
