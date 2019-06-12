import { Colony } from "./Colony";
import { RoomGraph } from "./RoomGraph";
import { dijkstra } from "./algorithms/dijkstra";

function isWalkable(pos: RoomPosition): boolean {
  for (let object of pos.look()) {
    if (object.type in OBSTACLE_OBJECT_TYPES) {
      return false;
    }
  }

  let terrain = new Room.Terrain(pos.roomName);
  return terrain.get(pos.x, pos.y) != TERRAIN_MASK_WALL;
}

export class Mine {
  public colony: Colony;
  public source: RoomObject;
  public pos: RoomPosition;
  public room: Room|undefined;
  public costs: CostMatrix = new PathFinder.CostMatrix;
  public constructionSite: ConstructionSite|undefined;
  public container: StructureContainer|undefined;
  public link: StructureLink|undefined;
  private path: RoomPosition[] = [];
  private walkable: RoomPosition[] = [];

  public constructor(colony: Colony, source: RoomObject) {
    this.colony = colony;
    this.source = source;

    this.pos = this.source.pos;
    this.room = this.source.room;

    this.populateStructures();
  }

  public populateStructures(): void {
    if (this.pos) {
      let room: Room|undefined = Game.rooms[this.pos.roomName];
      if (room) {
        this.source           = _.first(this.pos.lookFor(LOOK_SOURCES));
        this.constructionSite = _.first(this.pos.findInRange(FIND_MY_CONSTRUCTION_SITES,  2));
        // this.container        = this.pos.findClosestByRange(room.containers, 1);
        // this.link             = this.pos.findClosestByRange(this.colony.links, 2);
      }
    }
  }

  // Find mineable positions around source and place container
  public init(): void {
    // this.path = PathFinder.search(this.pos, this.colony.pos).path;
    if (this.room) {
      const rg = new RoomGraph(this.room.name);
      let ret = dijkstra<RoomPosition>(rg, this.pos);
      let paths = ret[1];
      let dist = ret[0];

      // set CostMatrix
      dist.forEach((v,k): void => {
        this.costs.set(k.x,k.y, v);
      });

      // Populate Path from dijkstra
      this.path = [];
      let p = paths.get(this.colony.pos);
      while (p !== this.pos) {
        if (p === undefined) break;
        this.path.push(p);
        p = paths.get(p);
      }

      // calculate walkable positions
      for (const x of _.range(3)) {
        for (const y of _.range(3)) {
          const pos = this.room.getPositionAt(this.pos.x + x -1 , this.pos.y + y - 1);
          if (pos) {
            if (isWalkable(pos)) this.walkable.push(pos);
          }
        }
      }
    }
  }

  public refresh(): void {
    // recently gained visibility to this room
    if (!this.room && this.source.room) {
      this.populateStructures();
    }
  }

  public update(): void {
  }

  public run(): void {
    const vis = new RoomVisual();
    let last = this.colony.pos;
    for (const p of this.path) {
      vis.line(last, p);
      last = p;
    }
    vis.circle(this.path[this.path.length - 2], {radius:0.4, fill:"#00000000", stroke:"blue"});
    for (const pos of this.walkable) {
      vis.circle(pos);
    }
  }
}
