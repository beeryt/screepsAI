import { Sovereign } from "./Sovereign";
import { RoomGraph } from "./RoomGraph";
import { dijkstra } from "./algorithms/dijkstra";
import { FibonacciHeap, INode } from "@tyriar/fibonacci-heap";
import { distanceTransform, displayCostMatrix, walkablePixelsForRoom } from  "./algorithms/distanceTransform";
import { update, finalize, Aggregate, Variance } from "./statistics";

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
    const vis = new RoomVisual();
    console.log(`\nProcessing ${room}...`);

    let walk = walkablePixelsForRoom(room);
    let dt = distanceTransform(walk);

    let st = new PathFinder.CostMatrix;

    let sources: RoomObject[] = Game.rooms[room].find(FIND_SOURCES);
    const controller = Game.rooms[room].controller;
    if (controller !== undefined) sources.push(controller);
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

    interface MyRoomMemory extends RoomMemory {
      factor: number;
    }
    const factor: number = (Game.rooms.sim.memory as MyRoomMemory).factor || 10;
    console.log("Factor:", factor);

    let ag = new Aggregate();
    let heap = new FibonacciHeap<number, {x: number; y: number; v: number}>();
    let nodes: INode<number, {x: number; y: number; v: number}>[] = [];
    for (const x of _.range(50)) {
      for (const y of _.range(50)) {
        // filter out places where base won't fit
        if (dt.get(x,y) < 3) {
          dt.set(x,y,NaN);
          st.set(x,y,NaN);
        } else {
          const s = st.get(x,y);// / (dt.get(x,y) / factor);
          ag = update(ag, s);
          nodes.push(heap.insert(s, {x:x, y:y, v:s}));
        }
      }
    }
    const stats = finalize(ag) as Variance;

    // Filter out bottom 50% of dijkstra results
    let i = 0;
    while (!heap.isEmpty()) {
      const n = heap.extractMinimum();
      if (n === null) continue;
      const v = n.value;
      if (v === undefined) continue;

      // filter out anything larger than average
      if (v.v > stats.mean - 1.25*(Math.sqrt(stats.variance))) {
        st.set(v.x,v.y,NaN);
        dt.set(v.x,v.y,NaN);
        continue;
      }

      // label the lowest 10 dijkstra results
      if (i < 10) {
        vis.text(i.toString(), v.x, v.y);
        ++i;
      }
    }

    displayCostMatrix(st, "#000fff40");
    displayCostMatrix(dt, "#fff00040");
  }
};

function reset(): void {
  console.log("Welcome to Sovereign!\nCode updated or global reset.");
  SovereignInstance = new Sovereign();
  SovereignInstance.init();
}

reset();
