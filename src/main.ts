import { dijkstra, IGraph, Vertex, Edge } from "./algorithms/dijkstra";
import "./prototypes/RoomPosition";
import "./prototypes/Structure";
import {osi} from "./algorithms/osi";
import {testDistanceTransform} from "./algorithms/distanceTransform";

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
  protected readonly _edges = new AdjacencyList<V>();
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

class RoomGraph extends Graph<number>
{
  protected room: Room;

  public constructor(roomname: string)
  {
    super(50);
    this.room = Game.rooms[roomname];
  }

  public weight(u: number, v: number): number
  {
    let terrain = this.room.getTerrain().get(Math.floor(v/50), v%50);
    if (terrain === TERRAIN_MASK_WALL) return 75;
    if (terrain === TERRAIN_MASK_SWAMP) return 5;
    return 1;
  }
}

function process(roomName: string): void
{
  let g = new RoomGraph(roomName);
  let r = dijkstra(g, 25*50+25);
  let max = _.max(r[0]);
  r[0].forEach((w,i) =>
  {
    let x = Math.floor(i/50);
    let y = i%50;
    let pos = new RoomPosition(x,y,roomName);
    let color = `rgba(${Math.max(0,255-Math.floor(255*w/25))},0,0,.5)`;
    // Game.rooms[roomName].visual.rect(x-0.5,y-0.5,1,1, {fill:color});
  });
}

testDistanceTransform();

for (let room in Game.rooms)
{
  process(room);
  osi(room);
}
