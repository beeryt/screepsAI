import { Mine } from "./Mine";
import { RoomGraph } from "./RoomGraph";
import { dijkstra } from "./algorithms/dijkstra";
import { FibonacciHeap, INode } from "@tyriar/fibonacci-heap";
import { distanceTransform, displayCostMatrix, walkablePixelsForRoom } from  "./algorithms/distanceTransform";
import { update, finalize, Aggregate, Variance } from "./statistics";

export class Colony {
  public room: any;
  public controller: any;
  public pos: any;
  private mines: Mine[];
  private costs: number[];

  private dt: CostMatrix = PathFinder.CostMatrix;
  private st: CostMatrix = PathFinder.CostMatrix;

  public constructor(room: Room) {
    this.room = room;
    this.controller = room.controller;
    this.pos = this.controller.pos;
    this.mines = [];
    this.room.find(FIND_SOURCES).forEach((source: any): void => { this.mines.push(new Mine(this, source)); }, this);
    this.room.find(FIND_MINERALS).forEach((mineral: any): void => { this.mines.push(new Mine(this, mineral)); }, this);

    this.costs = [];
  }

  public init(): void {
    console.log("Colony::init()");
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

      interface IRoomMemory extends RoomMemory {
        range: number;
        labels: number;
        varianceFactor: number;
      }
      const mem: IRoomMemory = Game.rooms.sim.memory as IRoomMemory;
      mem.range = mem.range ? mem.range : 3;
      mem.labels = mem.labels ? mem.labels: 3;
      mem.varianceFactor = mem.varianceFactor ? mem.varianceFactor : 0.674489750196082;
      console.log("mem:", JSON.stringify(mem));

      let ag = new Aggregate();
      let heap = new FibonacciHeap<number, {x: number; y: number; v: number}>();
      let nodes: INode<number, {x: number; y: number; v: number}>[] = [];
      for (const x of _.range(50)) {
        for (const y of _.range(50)) {
          // filter out places where base won't fit
          if (dt.get(x,y) < mem.range) {
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
      let bestPos: RoomPosition|undefined;
      while (!heap.isEmpty()) {
        const n = heap.extractMinimum();
        if (n === null) continue;
        const v = n.value;
        if (v === undefined) continue;
        if (bestPos === undefined) bestPos = new RoomPosition(v.x,v.y,'sim');

        // filter out anything larger than average
        if (v.v > stats.mean - mem.varianceFactor*(Math.sqrt(stats.variance))) {
          st.set(v.x,v.y,NaN);
          dt.set(v.x,v.y,NaN);
          continue;
        }

        // label the lowest 10 dijkstra results
        if (i < mem.labels) {
          vis.text(i.toString(), v.x, v.y, {color: "#ffffff40"});
          ++i;
        }
      }

      this.st = st;
      this.dt = dt;
      console.log("BestPos:", bestPos);
      this.pos = bestPos;
    }
    this.mines.forEach((mine): void => {
      mine.init();
    });
  }

  public refresh(): void {
    this.mines.forEach((mine): void => {
      mine.refresh();
    });
  }

  public update(): void {
    console.log("Colony::update()");
    this.room.visual.clear();
    this.mines.forEach((mine): void => {
      mine.update();
    });
  }
  public run(): void {
    // console.log("Colony::run()");
    displayCostMatrix(this.st, "#000fff40");
    displayCostMatrix(this.dt, "#fff00040");
    this.mines.forEach((mine): void => {
      mine.run();
    });
  }

  public visuals(): void {

  }
}
