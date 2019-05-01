var Colony = require("Colony");

class Sovereign
{
  constructor()
  {
    this.colonies = [];
    this.expiry = Game.time + 100;
  }

  populateColonies()
  {
    console.log("Sovereign::populateColonies()");
    this.colonies.push(new Colony(Game.spawns.Spawn1.room));
  }

  init()
  {
    console.log("Sovereign::init()");
    this.populateColonies();
    this.colonies.forEach(function(colony) {
      colony.init();
    });
    console.log();
  }

  refresh()
  {
    console.log("Sovereign::refresh()");
    this.colonies.forEach(function(colony) {
      colony.refresh();
    });
    console.log();
  }
  
  update()
  {
    console.log("Sovereign::update()");
    this.colonies.forEach(function(colony) {
      colony.update();
    });
    console.log();
  }

  run()
  {
    console.log("Sovereign::run()");
    this.colonies.forEach(function(colony) {
      colony.run();
    });
    console.log();
  }
}

module.exports = Sovereign;
