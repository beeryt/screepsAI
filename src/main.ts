import { Sovereign } from "./Sovereign";
import { RoomGraph } from "./RoomGraph";
import { dijkstra } from "./algorithms/dijkstra";
import { FibonacciHeap, INode } from "@tyriar/fibonacci-heap";
import { distanceTransform, displayCostMatrix, walkablePixelsForRoom } from  "./algorithms/distanceTransform";
import { update, finalize, Aggregate, Variance } from "./algorithms/distanceTransform";

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


    let ag = new Aggregate();
    let heap = new FibonacciHeap<number, {x: number; y: number}>();
    let nodes: INode<number, {x: number; y: number}>[] = [];
    for (const x of _.range(50)) {
      for (const y of _.range(50)) {
        // filter out places where base won't fit
        if (dt.get(x,y) < 3) {
          dt.set(x,y,NaN);
          st.set(x,y,NaN);
        } else {
          const s = st.get(x,y);
          ag = update(ag, s);
          nodes.push(heap.insert(s, {x:x, y:y}));
        }
      }
    }
    const stats = finalize(ag) as Variance;

    // label the first 10 results
    for (const i of _.range(10)) {
      const n = heap.extractMinimum();
      if (n === null) break;
      const v = n.value;
      if (v === undefined) break;
      vis.text(i.toString(), v.x, v.y);
    }

    // Filter out bottom 50% of dijkstra results
    while (!heap.isEmpty()) {
      const n = heap.extractMinimum();
      if (n === null) continue;
      const v = n.value;
      if (v === undefined) continue;
      // filter out anything larger than average
      if (st.get(v.x,v.y) > stats.mean - (Math.sqrt(stats.variance)/2)) {
        st.set(v.x,v.y,NaN);
        dt.set(v.x,v.y,NaN);
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
