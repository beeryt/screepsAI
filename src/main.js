var _Sovereign = require('Sovereign');

module.exports.loop = function() {

  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Farewell", name);
    }
  }

  if (Sovereign && Game.time < Sovereign.expiry)
  {
    Sovereign.refresh();
  } else
  {
    delete global.Sovereign;
    global.Sovereign = new _Sovereign();
    Sovereign.build();
  }
  
  Sovereign.init();
  Sovereign.run();
};

function reset() {
  console.log("Welcome to Sovereign!\nCode updated or global reset.");
  global.Sovereign = new _Sovereign();
  Sovereign.build();
}

reset();
