var Mine = require("Mine");

class Colony
{
  constructor(room)
  {
    this.room = room;
    this.controller = room.controller;
    this.pos = this.controller.pos;
    this.mines = [];
  }

  init()
  {
    console.log("Colony::init()");

    console.log("Debug: adding first source");
    this.mines.push(new Mine(this, _.first(this.room.find(FIND_SOURCES))));

    this.mines.forEach(function(mine) {
      mine.init();
    });
  }

  refresh()
  {
    console.log("Colony::refresh()");

    this.mines.forEach((mine) => {
      mine.refresh();
    });
  }

  update()
  {
    console.log("Colony::update()");

    this.mines.forEach((mine) => {
      mine.update();
    });
  }

  run()
  {
    console.log("Colony::run()");

    this.mines.forEach((mine) => {
      mine.run();
    });

    // find center of mass
    let sumX = 0;
    let sumY = 0;
    let mass = 0;
    this.room.find(FIND_SOURCES).forEach((source) => {
      sumX += source.pos.x * source.energyCapacity;
      sumY += source.pos.y * source.energyCapacity;
      mass += source.energyCapacity;
    });

    sumX += this.room.controller.pos.x * mass;
    sumY += this.room.controller.pos.y * mass;
    mass += mass;
    let pos = this.room.getPositionAt(sumX/mass,sumY/mass);
    this.room.visual.circle(pos, {radius: .33});

    let terrain = new Room.Terrain(this.pos.roomName);
    function findWallMass(pos, width, height  )
    {
      let sumX = 0;
      let sumY = 0;
      let mass = 0;
      for (let i = 0; i < width*height; ++i)
      {
        let x = Math.floor(i/width) + pos.x;
        let y = (i%height) + pos.y;
        sumX += x * terrain.get(x,y);
        sumY += y * terrain.get(x,y);
        mass += terrain.get(x,y);
      }
      return Game.rooms[pos.roomName].getPositionAt(sumX/mass, sumY/mass);
    }

    function findVector(origin, avoid, width, height)
    {
      room = Game.rooms[origin.roomName];
      let x = (origin.x + width) / 2;
      let y = (origin.y + height) / 2;
      room.visual.line(avoid, room.getPositionAt(x,y))
    }

    // draw 5x5 region
    this.room.visual.rect(pos.x-0.5, pos.y-0.5, 5, 5, {stroke: "#ffffff", fill: "#00000000"});
    let flee = findWallMass(pos, 5, 5);
    this.room.visual.circle(flee, {radius: .33, fill: "#ffaa00"})

    this.room.find(FIND_SOURCES).forEach((source) => {
      this.room.visual.line(pos, source.pos);
    });
  }

  visuals()
  {

  }
}

module.exports = Colony;
