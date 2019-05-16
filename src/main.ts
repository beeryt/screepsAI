import { dijkstra, IGraph } from "./algorithms/dijkstra";
import "./prototypes/RoomPosition";
import "./prototypes/Structure";
import "./prototypes/Room";
import {distanceTransform, walkablePixelsForRoom, displayCostMatrix} from "./algorithms/distanceTransform";

class AdjacencyList<V> implements Iterable<[V, V]>
{
  public data: Map<V, Map<V, number>>;

  public [Symbol.toStringTag] = "AdjacencyList";

  public constructor()
  {
    this.data = new Map<V, Map<V, number>>();
  }

  public link(v: V, u: V, w: number = 1, directed: boolean = false): void
  {
    if (!this.data.has(v)) this.data.set(v, new Map<V, number>());
    this.data.get(v)!.set(u,w);

    if (!directed)
    {
      if (!this.data.has(u)) this.data.set(u, new Map<V, number>());
      this.data.get(u)!.set(v,w);
    }
  }

  public *[Symbol.iterator](): Iterator<[V, V]>
  {
    for (const u of this.data.keys())
    {
      for (const v of this.data.get(u)!.keys())
      {
        yield [u, v];
      }
    }
  }
}

class Graph<V> implements IGraph<V>
{
  protected readonly _edges = new AdjacencyList<V>();
  public vertices: V[] = [];
  public edges: Iterable<[V, V]> = this._edges;

  public [Symbol.toStringTag] = "Graph";

  public neighbors(v: V): V[]
  {
    if (!this._edges.data.has(v)) return [];
    const neighbors: V[] = [];
    for (const u of this._edges.data.get(v)!.keys())
    {
      neighbors.push(u);
    }

    return neighbors;
  }

  public weight(u: V, v: V): number
  {
    return 1;
  }
}

class RoomGraph extends Graph<RoomPosition>
{
  protected room: Room;

  public [Symbol.toStringTag] = "RoomGraph";

  public constructor(roomname: string)
  {
    super();
    console.log(this, this._edges, this.edges);
    this.room = Game.rooms[roomname];
    for (let p of this.room.positions)
    {
      this.vertices.push(p);
      for (let n of p.neighbors)
      {
        this._edges.link(p,n);
      }
    }
  }

  public weight(u: RoomPosition, v: RoomPosition): number
  {
    let terrain = this.room.getTerrain().get(v.x,v.y);
    if (terrain === TERRAIN_MASK_WALL) return 75;
    if (terrain === TERRAIN_MASK_SWAMP) return 5;
    return 1;
  }
}


for (let room in Game.rooms)
{
  console.log(`Processing ${room}...`);

  let walk = walkablePixelsForRoom(room);
  let dt = distanceTransform(walk);
  displayCostMatrix(dt);

  let a = new RoomPosition(0,0,room);
  let b = Game.rooms[room].getPositionAt(0,0);
  console.log(a,b,a==b,a===b, _.isEqual(a,b));
  console.log(a, a.valueOf());

  let sources = Game.rooms[room].find(FIND_SOURCES);
  let rg = new RoomGraph(room);
  for (let s of sources)
  {
    let r = dijkstra<RoomPosition>(rg, s.pos);
    console.log(_.min(r[0]), _.min(r[1]));
  }
}
