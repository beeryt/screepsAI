import { Graph } from "./structures/Graph";

export class RoomGraph extends Graph<RoomPosition> {
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
