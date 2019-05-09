var Util = require("Util");

function isWalkable(pos)
{
  pos.look().forEach(object => {
    if (object.type == 'structure' && object.structure.type == 'road')
    {
      return true;
    }
    if (object.type in OBSTACLE_OBJECT_TYPES)
    {
      return false;
    }
  });

  let terrain = new Room.Terrain(pos.roomName);
  return terrain.get(pos.x, pos.y) != TERRAIN_MASK_WALL;
}

class Mine {
  constructor(colony, source)
  {
    this.colony = colony;
    this.source = source;

    this.pos = this.source.pos;
    this.room = this.source.room;

    this.costs = [];

    this.populateStructures();
  }

  populateStructures()
  {
    let room = Game.rooms[this.pos.roomName];
    if (room)
    {
      this.source           = _.first(this.pos.lookFor(LOOK_SOURCES));
      this.constructionSite = _.first(this.pos.findInRange(FIND_MY_CONSTRUCTION_SITES,  2));
      this.container        = this.pos.findClosestByRange(room.containers, 1);
      this.link             = this.pos.findClosestByRange(this.colony.links, 2);
    }
  }

  // Find mineable positions around source and place container
  init()
  {
    this.mineables = [];
    this.costs = Util.dijkstra(null, Util.posToI(this.pos))[0];
    this.maxCost = _.max(this.costs);
  }

  refresh()
  {
    // recently gained visibility to this room
    if (!this.room && Game.rooms[this.pos.roomName])
    {
      this.populateStructures();
    }
  }

  update()
  {
  }

  run()
  {
  }
}

module.exports = Mine;
