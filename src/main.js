var _Sovereign = require('Sovereign');

module.exports.loop = function() {

  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Farewell", name);
    }
  }

  if (!Sovereign || Game.time >= Sovereign.expiry)
  {
    delete global.Sovereign;
    global.Sovereign = new _Sovereign();
    Sovereign.init();
  }

  Sovereign.refresh();
  Sovereign.update();
  Sovereign.run();
  console.log();
};

function reset() {
  console.log("Welcome to Sovereign!\nCode updated or global reset.");
  global.Sovereign = new _Sovereign();
  Sovereign.init();
}

reset();
