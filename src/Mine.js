function isWalkable(pos)
{
  pos.look().forEach(object => {
    if (object.type in OBSTACLE_OBJECT_TYPES)
    {
      return false;
    }
  });
  return true;
}

class Mine {
  constructor(colony, source)
  {
    this.colony = colony;
    this.source = source;

    this.pos = this.source.pos;
    this.room = this.source.room;

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

  init()
  {
    let ret = PathFinder.search(this.colony.pos, {pos: this.pos, range: 1});
    this.path = ret.path;

    this.locale = {};
    for (let i = 0; i < 9; ++i)
    {
      let x = Math.floor(i/3) + this.pos.x - 1;
      let y = Math.floor(i%3) + this.pos.y - 1;
      let p = this.room.getPositionAt(x,y);
      if (!isWalkable(p)) continue;
      this.room.visual.circle(p);
      let ret = PathFinder.search(this.colony.pos, {pos: p})
      console.log(ret.incomplete)
      if (ret.incomplete) { continue; }
      this.locale[p] = ret.cost;
    }
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
    let path = PathFinder.search(this.colony.pos, {pos: this.pos, range: 1});
    if (path.incomplete) { console.log("Path was incomplete"); }
    let pos = _.find(path.path, pos => pos.getRangeTo(this) == 1);

    this.room.visual.circle(this.pos, {radius: 0.3});
    this.room.visual.circle(pos, {radius: 0.3});

    // draw path
    let lastPoint = this.colony.pos;
    this.path.forEach(point => {
      this.room.visual.line(lastPoint, point, {lineStyle: 'dashed'});
      lastPoint = point;
    })

    // draw costs
    for (let k in this.locale)
    {
      if (this.locale.hasOwnProperty(k))
      {
        this.room.visual.text(this.locale[k], k);
      }
    }
  }

  run()
  {
  }
}

module.exports = Mine;
