import { dijkstra, IGraph } from "./algorithms/dijkstra";
import { OMap, IKey } from "./OMap";
import {FibonacciHeap, INode } from "@tyriar/fibonacci-heap";
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
    console.log(this, this._edges, this.edges);
    this.room = Game.rooms[roomname];
    for (let p of this.room.positions) {
      this.vertices.push(p);
      for (let n of p.neighbors) {
        this._edges.link(p,n);
      }
    }
    let last = "";
    let counter = 0;
    for (let rp of this.vertices) {
      if (last !== rp.toString()) {
        counter += 1;
        last = rp.toString();
      }
    }
    console.log(this, "vertices size:", `(${counter}/${this.vertices.length})`);
    let rp = this.vertices[0];
    console.log(rp, typeof rp, rp.toString(), typeof rp.toString(), rp.valueOf(), typeof rp.valueOf());
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

class ByValue {
  public x: number;
  public constructor(n: number = 5) {
    this.x = n;
  }
  public valueOf(): string {
    return 'ByValue:'+this.x;
  }
}

let r1 = new RoomPosition(0, 0, "sim");
let r2 = new RoomPosition(2, 1, "sim");
let r3 = new RoomPosition(2,2, "sim");

let om = new OMap<RoomPosition,number|undefined>();
om.set(r1, 33);
om.set(r2, 44);
om.set(r3, 43);
console.log("s/b:", 33, 44, 43);
om.forEach((v,k): void => console.log(`${k}:${v}`));
om.set(r1, 22);
om.set(r2, om.get(r1));
om.set(r3, om.get(r3));
console.log("s/b:", 22, 22, 43);
om.forEach((v,k): void => console.log(`${k}:${v}`));

let q = new FibonacciHeap<number, number>();
let n1 = q.insert(3, 5);
let n2 = q.insert(3, 5);
q.decreaseKey(n1, 2);
let ino = q.extractMinimum()!;
console.log("DecreasedKey:", ino, ino.key, ino.value);
ino = q.extractMinimum()!;
console.log("Last:", ino, ino.key, ino.value);

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

  let sources = Game.rooms[room].find(FIND_SOURCES);
  let rg = new RoomGraph(room);
  for (let s of sources) {
    let r = dijkstra<RoomPosition>(rg, s.pos);
    console.log(_.min(r[0].values()));
    console.log();
  }
}
