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
    this.mines.push(new Mine(this, _.first(this.room.find(FIND_SOURCES)));

    this.mines.forEach(function(mine) {
      mine.init();
    });
  }

  refresh()
  {
    console.log("Colony::refresh()");
  }

  update()
  {
    console.log("Colony::update()");
  }

  run()
  {
    console.log("Colony::run()");
  }

  visuals()
  {

  }
}

module.exports = Colony;
