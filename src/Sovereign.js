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
    this.colonies.forEach(function(colony) {
      colony.init();
    });
  }

  refresh()
  {
    this.colonies.forEach(function(colony) {
      colony.refresh();
    });
  }

  build()
  {
    this.populateColonies();
    this.colonies.forEach(function(colony) {
      colony.refresh();
    });
  }

  run()
  {
    this.colonies.forEach(function(colony) {
      colony.run();
    });
  }
}

module.exports = Sovereign;
