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
    console.log(ret.incomplete);
    this.path = ret.path;
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

    this.room.visual.line(this.pos, this.colony.pos);
    this.room.visual.circle(this.pos, {radius: 0.3});
    this.room.visual.circle(pos, {radius: 0.3});

    // draw path
    console.log("thisPath:", this.path.length)
    let lastPoint = this.colony.pos;
    this.path.forEach(point => {
      this.room.visual.line(lastPoint, point, {lineStyle: 'dashed'});
      lastPoint = point;
    })
  }

  run()
  {
  }
}

module.exports = Mine;
