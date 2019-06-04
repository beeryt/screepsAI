import { Sovereign } from "./Sovereign";
import { RoomGraph } from "./RoomGraph";
import { dijkstra } from "./algorithms/dijkstra";
import { distanceTransform, displayCostMatrix, walkablePixelsForRoom } from  "./algorithms/distanceTransform";

import "./prototypes/RoomPosition";
import "./prototypes/Structure";
import "./prototypes/Room";

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
  for (let room in Game.rooms) {
    console.log(`\nProcessing ${room}...`);

    let walk = walkablePixelsForRoom(room);
    let dt = distanceTransform(walk);
    displayCostMatrix(dt);

    let st = new PathFinder.CostMatrix;

    let sources = Game.rooms[room].find(FIND_SOURCES);
    let rg = new RoomGraph(room);
    for (let s of sources) {
      let r = dijkstra<RoomPosition>(rg, s.pos);
      let dist = r[0];

      for(let kv of dist.entries()) {
        let k = kv[0];
        let v = kv[1];
        let orig = st.get(k.x, k.y);
        st.set(k.x, k.y, orig + v);
      }
    }
    displayCostMatrix(st, "#000fff");

    let thing = new Map<number,{x: number; y: number}>();
    for (const x of _.range(50)) {
      for (const y of _.range(50)) {
        // filter out places where base won't fit
        if (dt.get(x,y) < 3) {
          dt.set(x,y,NaN);
          st.set(x,y,NaN);
        } else {
          thing.set(st.get(x,y), {x:x, y:y});
        }
      }
    }

    for (const i of _.range(10)) {
      const k = _.min(Array.from(thing.keys()));
      console.log("minimum key:", k);
      const pos = thing.get(k);
      thing.delete(k);
      if (pos === undefined) break;
      let vis = new RoomVisual();
      vis.text(i.toString(), pos.x, pos.y);
    }

  }
};

function reset(): void {
  console.log("Welcome to Sovereign!\nCode updated or global reset.");
  SovereignInstance = new Sovereign();
  SovereignInstance.init();
}

reset();
