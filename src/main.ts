import { dijkstra, IGraph, Vertex, Edge } from "./algorithms/dijkstra"

class AdjacencyList<V extends Vertex> implements Iterable<[V,V]>
{
  data: number[][] = [];

  constructor()
  {
    this.data = [];
  }

  link(v:V, u:V, w:number = 1, directed:boolean = false)
  {
    if (this.data[v as number] === undefined)
    {
      this.data[v as number] = [];
    }
    this.data[v as number][u as number] = w;

    if (!directed)
    {
      if (this.data[u as number] === undefined)
      {
        this.data[u as number] = [];
      }
      this.data[v as number][u as number] = w;
    }
  }

  *[Symbol.iterator](): Iterator<[V,V]>
  {
    let i = -1;
    for (let odata of this.data)
    {
      let j = -1;
      ++i;
      if (odata === undefined) continue;
      for (let idata of this.data[i])
      {
        ++j;
        if (idata === undefined) continue;
        yield [i as V, j as V];
      }
    }
  }
}

class Graph<V extends Vertex> implements IGraph<V,[V,V]>
{
  private _edges = new AdjacencyList<V>();
  vertices: V[] = [];
  edges: Iterable<[V,V]> = this._edges;

  constructor(n:number = 3)
  {
    for (let i = 0; i < n; ++i)
    {
      for (let j = 0; j < n; ++j)
      {
        let v = i*n+j;
        this.vertices.push(v as V);
        this.linkNeighbors(v, n);
      }
    }
  }

  linkNeighbors(v:number, n:number): void
  {
    let x1 = Math.floor(v/n);
    let y1 = v%n;

    for (let i = 0; i < 9; ++i)
    {
      let x2 = Math.floor(i/3) - 1;
      let y2 = i%3 - 1;
      let x = x1+x2;
      let y = y1+y2;
      let u = n*x+y;
      if (u===v||x<0||x>=n||y<0||y>=n) continue;
      this._edges.link(u as V,v as V);
    }
  }

  neighbors(v:V): V[]
  {
    if (this._edges.data[v as number] === undefined) return [];
    let neighbors: V[] = [];
    let i = -1;
    for (let w of this._edges.data[v as number])
    {
      ++i;
      if (w === undefined) continue;
      neighbors.push(i as V);
    }
    return neighbors;
  }

  weight(u:V,v:V): number
  {
    return Math.abs(v - u) + 1;
  }
}


let g:IGraph<Vertex, Edge> = new Graph<Vertex>();

for (let v of g.vertices)
{
  console.log("Neighbors", v+':', g.neighbors(v));
}

console.log("Dijkstra:", dijkstra(g,0));
