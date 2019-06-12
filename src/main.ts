import { Sovereign } from "./Sovereign";

import "./prototypes/RoomPosition";
import "./prototypes/Structure";
import "./prototypes/Room";

var SovereignInstance: Sovereign;

module.exports.loop = function(): void {

  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Farewell", name);
    }
  }

  if (!SovereignInstance || Game.time >= SovereignInstance.expiry) {
    // delete SovereignInstance;
    console.log("Stats:", Game.cpu.bucket, Game.cpu.tickLimit);
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
