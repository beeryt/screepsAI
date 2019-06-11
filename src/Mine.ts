import { dijkstra } from "./algorithms/dijkstra";
import { Colony } from "./Colony";

interface ILookStructure {type: string; structure: Structure};
interface ILookTerrain {type: string; terrain: string};

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
  public pos: RoomPosition|undefined;
  public room: Room|undefined;
  public costs: number[];
  public maxCost: number = Infinity;
  public constructionSite: ConstructionSite|undefined;
  public container: StructureContainer|undefined;
  public link: StructureLink|undefined;

  public constructor(colony: Colony, source: RoomObject) {
    this.colony = colony;
    this.source = source;

    this.pos = this.source.pos;
    this.room = this.source.room;

    this.costs = [];

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
    this.maxCost = _.max(this.costs);
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
    if (this.pos && this.room) {
      for (let x = 0; x < 3; ++x) {
        for (let y = 0; y < 3; ++y) {
          const pos = this.room.getPositionAt(this.pos.x + x - 1, this.pos.y + y - 1);
          if (!pos) continue;
          if (isWalkable(pos)) {
            vis.circle(pos);
          }
        }
      }
    }
  }
}
