import { dijkstra, IGraph } from "./algorithms/dijkstra";
import { OMap, IKey } from "./OMap";
import "./prototypes/RoomPosition";
import "./prototypes/Structure";
import "./prototypes/Room";
import {distanceTransform, walkablePixelsForRoom, displayCostMatrix} from "./algorithms/distanceTransform";

class AdjacencyList<V extends IKey> implements Iterable<[V, V]> {
  public data = new OMap<V, OMap<V, number>>();

  public [Symbol.toStringTag] = "AdjacencyList";

  public link(v: V, u: V, w: number = 1, directed: boolean = false): void {
    if (!this.data.has(v)) this.data.set(v, new OMap<V, number>());
    this.data.get(v)!.set(u,w);

    if (!directed) {
      if (!this.data.has(u)) this.data.set(u, new OMap<V, number>());
      this.data.get(u)!.set(v,w);
    }
  }

  public *[Symbol.iterator](): Iterator<[V, V]> {
    for (const u of this.data.keys()) {
      for (const v of this.data.get(u)!.keys()) {
        const urp = new RoomPosition(0,0,'sim');
        const vrp = urp;
        yield [urp as unknown as V, vrp as unknown as V];
      }
    }
  }
}

class Graph<V extends IKey> implements IGraph<V> {
  protected readonly _edges = new AdjacencyList<V>();
  public vertices: V[] = [];
  public edges: Iterable<[V, V]> = this._edges;

  public [Symbol.toStringTag] = "Graph";

  public neighbors(v: V): V[] {
    if (!this._edges.data.has(v)) return [];
    const neighbors: V[] = [];
    for (const us of this._edges.data.get(v)!.keys()) {
      let u = new RoomPosition(0,0,'sim');
      neighbors.push(u as unknown as V);
    }

    return neighbors;
  }

  public weight(u: V, v: V): number {
    return 1;
  }
}

class RoomGraph extends Graph<RoomPosition> {
  protected room: Room;

  public [Symbol.toStringTag] = "RoomGraph";

  public constructor(roomname: string) {
    super();
    this.room = Game.rooms[roomname];
    for (let p of this.room.positions) {
      this.vertices.push(p);
      for (let n of p.neighbors) {
        this._edges.link(p,n);
      }
    }
  }

  public neighbors(v: RoomPosition): RoomPosition[] {
    return v.neighbors;
  }

  public weight(u: RoomPosition, v: RoomPosition): number {
    let terrain = this.room.getTerrain().get(v.x,v.y);
    if (terrain === TERRAIN_MASK_WALL) return 75;
    if (terrain === TERRAIN_MASK_SWAMP) return 5;
    return 1;
  }
}

for (let room in Game.rooms) {
  console.log(`\nProcessing ${room}...`);

  let walk = walkablePixelsForRoom(room);
  let dt = distanceTransform(walk);
  displayCostMatrix(dt);

  let st = new PathFinder.CostMatrix;

  let sources = Game.rooms[room].find(FIND_SOURCES);
  let rg = new RoomGraph(room);
  for (let s of sources) {
    let r = dijkstra<RoomPosition>(rg, s.pos);
    let dist = r[0];

    for(let kv of dist.entries()) {
      let k = kv[0];
      let v = kv[1];
      let orig = st.get(k.x, k.y);
      st.set(k.x, k.y, orig + v);
    }

    displayCostMatrix(st, "#000fff");

    break;
  }
}
