import { dijkstra, IGraph, Vertex, Edge } from "./algorithms/dijkstra";

class AdjacencyList<V extends Vertex> implements Iterable<[V, V]>
{
  public data: number[][] = [];

  public constructor()
  {
    this.data = [];
  }

  public link(v: V, u: V, w: number = 1, directed: boolean = false): void
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

  public *[Symbol.iterator](): Iterator<[V, V]>
  {
    let i = -1;
    for (const odata of this.data)
    {
      let j = -1;
      ++i;
      if (odata === undefined) continue;
      for (const idata of this.data[i])
      {
        ++j;
        if (idata === undefined) continue;
        yield [i as V, j as V];
      }
    }
  }
}

class Graph<V extends Vertex> implements IGraph<V, [V, V]>
{
  private readonly _edges = new AdjacencyList<V>();
  public vertices: V[] = [];
  public edges: Iterable<[V, V]> = this._edges;

  public constructor(n: number = 3)
  {
    for (let i = 0; i < n; ++i)
    {
      for (let j = 0; j < n; ++j)
      {
        const v = i * n + j;
        this.vertices.push(v as V);
        this.linkNeighbors(v, n);
      }
    }
  }

  protected linkNeighbors(v: number, n: number): void
  {
    const x1 = Math.floor(v / n);
    const y1 = v % n;

    for (let i = 0; i < 9; ++i)
    {
      const x2 = Math.floor(i / 3) - 1;
      const y2 = i % 3 - 1;
      const x = x1 + x2;
      const y = y1 + y2;
      const u = n * x + y;
      if (u === v || x < 0 || x >= n || y < 0 || y >= n) continue;
      this._edges.link(u as V, v as V);
    }
  }

  public neighbors(v: V): V[]
  {
    if (this._edges.data[v as number] === undefined) return [];
    const neighbors: V[] = [];
    let i = -1;
    for (const w of this._edges.data[v as number])
    {
      ++i;
      if (w === undefined) continue;
      neighbors.push(i as V);
    }

    return neighbors;
  }

  public weight(u: V, v: V): number
  {
    return Math.abs(v - u) + 1;
  }
}


const g: IGraph<Vertex, Edge> = new Graph<Vertex>();

for (const v of g.vertices)
{
  console.log("Neighbors", v + ":", g.neighbors(v));
}

console.log("Dijkstra:", dijkstra(g, 0));
