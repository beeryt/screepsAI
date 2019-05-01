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

  update()
  {
    console.log("Sovereign::update()");
    this.colonies.forEach(function(colony) {
      colony.update();
    });
  }

  refresh()
  {
    this.colonies.forEach(function(colony) {
      colony.refresh();
    });
  }

  init()
  {
    this.populateColonies();
    this.colonies.forEach(function(colony) {
      colony.init();
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
