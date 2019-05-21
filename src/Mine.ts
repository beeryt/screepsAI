import "@types/lodash";
import { dijkstra } from "./algorithms/dijkstra";

interface ILookStructure {type: string; structure: Structure};
interface ILookTerrain {type: string; terrain: string};

function isWalkable(pos: RoomPosition): boolean {
  for (let object of pos.look()) {
    if (object.type === LOOK_STRUCTURES)// && object!.structure!.structureType === STRUCTURE_ROAD)
    {
      let structure: Structure = object.structure as Structure;
      if (structure.structureType === STRUCTURE_ROAD) {
        return true;
      }
    }

    if (object.type in OBSTACLE_OBJECT_TYPES) {
      return false;
    }

    return true;
  }

  let terrain = new Room.Terrain(pos.roomName);
  return terrain.get(pos.x, pos.y) != TERRAIN_MASK_WALL;
}

export class Mine {
  public colony: RoomObject;
  public source: RoomObject;
  public pos: RoomPosition|undefined;
  public room: Room|undefined;
  public costs: number[];
  public maxCost: number = Infinity;
  public constructionSite: ConstructionSite|undefined;
  public container: StructureContainer|undefined;
  public link: StructureLink|undefined;

  public constructor(colony: RoomObject, source: RoomObject) {
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
    if (this.pos) {
      let i = 50*this.pos.x + this.pos.y;
      // this.costs = dijkstra(null, i)[0];
    }
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
  }
}
