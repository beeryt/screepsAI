import { Sovereign } from "./Sovereign";

var SovereignInstance: Sovereign;

module.exports.loop = function(): void {

  console.log(Game.cpu.bucket, Game.cpu.tickLimit);
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Farewell", name);
    }
  }

  if (!SovereignInstance || Game.time >= SovereignInstance.expiry) {
    // delete SovereignInstance;
    SovereignInstance = new Sovereign();
    SovereignInstance.init();
  }

  SovereignInstance.refresh();
  SovereignInstance.update();
  SovereignInstance.run();
  // console.log();
};

function reset(): void {
  console.log("Welcome to Sovereign!\nCode updated or global reset.");
  SovereignInstance = new Sovereign();
  SovereignInstance.init();
}

reset();
