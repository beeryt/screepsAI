import { dijkstra, IGraph, Vertex, Edge } from "./algorithms/dijkstra"

class AdjacencyList<V extends Vertex> implements Iterable<[V,V]>
{
  data: number[][] = [];

  constructor()
  {
    this.data = [];
  }

  link(v:V, u:V, directed:boolean = false, w:number = 1)
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
    let datai: number[] = []
    let dataj: number[][] = []

    let i = -1;
    for (let data of this.data)
    {
      ++i;
      if (this.data[i] === undefined) continue;
      let j = -1;
      for (let datai of this.data[i])
      {
        ++j;
        if (this.data[i][j] === undefined) continue;
        yield [i as V, j as V];
      }
    }
  }
}

let a:AdjacencyList<number> = new AdjacencyList()
a.link(0,1,false, 66);
console.log("AdjacencyList:");
for (let b of a) console.log(b, a.data[b[0]][b[1]]);
console.log();

class Graph<V extends Vertex> implements IGraph<V,[V,V]>
{
  vertices: V[] = [];
  _edges = new AdjacencyList<V>();
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
  console.log(g.neighbors(v));
}

console.log(dijkstra(g,0));
