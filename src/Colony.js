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

    let pos = this.room.getPositionAt(sumX / mass, sumY / mass);
    console.log(pos);
    this.room.visual.circle(pos, {radius: .33});

    this.room.find(FIND_SOURCES).forEach((source) => {
    });

    function apple(roomName)
    {
      console.log("roomCallback(",roomName,")");
    }

    function banana(roomName, costMatrix)
    {
      console.log("costCallback(",roomName,")");
      let room = Game.rooms[roomName];
      for (let i = 0; i < 50*50; ++i)
      {
        let x = Math.floor(i / 50);
        let y = i % 50;
        room.visual.text(costMatrix.get(x,y), room.getPositionAt(x,y));
      }
    }

    PathFinder.search(this.pos, {pos: pos}, {roomCallback: apple});
    this.room.findPath(this.pos, pos, {costCallback: banana});
  }

  visuals()
  {

  }
}

module.exports = Colony;
