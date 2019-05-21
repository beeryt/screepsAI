import { dijkstra, IGraph } from "./algorithms/dijkstra";
import "./prototypes/RoomPosition";
import "./prototypes/Structure";
import "./prototypes/Room";
import {distanceTransform, walkablePixelsForRoom, displayCostMatrix} from "./algorithms/distanceTransform";

class AdjacencyList<V> implements Iterable<[V, V]> {
  public data = new Map<string, Map<string, number>>();

  public [Symbol.toStringTag] = "AdjacencyList";

  public link(v: V, u: V, w: number = 1, directed: boolean = false): void {
    if (!this.data.has(v.toString())) this.data.set(v.toString(), new Map<string, number>());
    this.data.get(v.toString())!.set(u.toString(),w);

    if (!directed) {
      if (!this.data.has(u.toString())) this.data.set(u.toString(), new Map<string, number>());
      this.data.get(u.toString())!.set(v.toString(),w);
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

class Graph<V> implements IGraph<V> {
  protected readonly _edges = new AdjacencyList<V>();
  public vertices: V[] = [];
  public edges: Iterable<[V, V]> = this._edges;

  public [Symbol.toStringTag] = "Graph";

  public neighbors(v: V): V[] {
    if (!this._edges.data.has(v.toString())) return [];
    const neighbors: V[] = [];
    for (const us of this._edges.data.get(v.toString())!.keys()) {
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
    console.log(this, this._edges, this.edges);
    this.room = Game.rooms[roomname];
    for (let p of this.room.positions) {
      this.vertices.push(p);
      for (let n of p.neighbors) {
        this._edges.link(p,n);
      }
    }
  }

  public weight(u: RoomPosition, v: RoomPosition): number {
    let terrain = this.room.getTerrain().get(v.x,v.y);
    if (terrain === TERRAIN_MASK_WALL) return 75;
    if (terrain === TERRAIN_MASK_SWAMP) return 5;
    return 1;
  }
}

class ByValue {
  public x: number;
  public constructor(n: number = 5) {
    this.x = n;
  }
  public valueOf(): string {
    return 'ByValue:'+this.x;
  }
}



function reverse(str: string): RoomPosition|undefined {
  let s = str.slice(1,-1).split(' ');
  let pos = s[3].split(',');
  let x = Number(pos[0]);
  let y = Number(pos[1]);
  let room = s[1];

  return new RoomPosition(x,y,room);
}

for (let room in Game.rooms) {
  console.log(`Processing ${room}...`);

  let walk = walkablePixelsForRoom(room);
  let dt = distanceTransform(walk);
  displayCostMatrix(dt);

  let a = new RoomPosition(0,0,room);
  let b = Game.rooms[room].getPositionAt(0,0);
  console.log(a,b,a==b,a===b, _.isEqual(a,b));
  console.log(a, a.valueOf(), a.toString());
  console.log(typeof a, typeof a.valueOf(), typeof a.toString());
  console.log("TEST", a, a.toString(), reverse(a.toString()), reverse(a.toString())!.toString());

  let c = new ByValue();
  let d: Map<string, string> = new Map<string, string>();
  d.set(c.valueOf(), "Hello");
  console.log(c, c.toString(), c.valueOf(), d.get(c.valueOf()));
  let e = new ByValue();
  d.set(e.valueOf(), "Hello World");
  console.log(d.get(c.valueOf()), d.get(e.valueOf()));

  let sources = Game.rooms[room].find(FIND_SOURCES);
  let rg = new RoomGraph(room);
  for (let s of sources) {
    let r = dijkstra<RoomPosition>(rg, s.pos);
    console.log(_.min(r[0]), _.min(r[1]));
  }
}
