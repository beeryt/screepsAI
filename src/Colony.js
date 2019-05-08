/*jshint bitwise: false*/
var PriorityQueue = require('FastPriorityQueue');
var Mine = require("Mine");

const colors = ["#5aa343", "#e0be2c", "#d86224", "#a11620", "#6d151b"];

const floyd_warshall = graph =>
{
  let V = 50*50;

  // let dist be a |V| x |V| array of minimum distances initialized to ∞ (undefined)
  let dist = [];
  for (let i = 0; i < V; ++i)
  {
    dist.push(new Array(V));
    for (let j = 0; j < V; ++j)
    {
      dist[i][j] = Number.POSITIVE_INFINITY;
    }
  }

  /*
   * for each edge (u,v)
   *   dist[u][v] ← w(u,v) // the weight of the edge (u,v)
   * for each vertex v
   *   dist[v][v] ← 0
   */
  for (let v = 0; v < V; ++v)
  {
    let vx = Math.floor(v/50);
    let vy = Math.floor(v%50);
    for (let i = 0; i < 9; ++i)
    {
      let ux = Math.floor(i/3) + vx - 1;
      let uy = Math.floor(i%3) + vy - 1;
      if (ux<0 || ux>=50 || uy<0 || uy>=50) continue;
      let u = ux * 3 + uy;
      if (u == v)
      {
        dist[u][v] = 0;
      } else {
        dist[u][v] = 1;//weight(ux,uy);
      }
    }
  }

  /*
   * for k from 1 to |V|
   *   for i from 1 to |V|
   *     for j from 1 to |V|
   *       if dist[i][j] > dist[i][k] + dist[k][j]
   *         dist[i][j] ← dist[i][k] + dist[k][j]
   *       end if
   */
  for (let k = 0; k < V; ++k)
  {
    for (let i = 0; i < V; ++i)
    {
      for (let j = 0; j < V; ++j)
      {
        let cost = dist[i][k] + dist[k][j];
        if (dist[i][j] > cost)
        {
          dist[i][j] = cost;
        }
      }
    }
  }

  return dist;
};

const dijkstra_getNeighbors = (u) => {
  let neighbors = [];
  for (let i = 0; i < 9; ++i) {
    let x = Math.floor(i/3) + Math.floor(u/50) - 1;
    let y = Math.floor(i%3) + Math.floor(u%50) - 1;
    if (x<0||x>=50||y<0||y>=50) continue;
    let v = x*50 + y;
    if (u == v) continue;
    neighbors.push(v);
  }
  return neighbors;
};

const nodeParent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

function iToPos(index) {
  let x = Math.floor(index/50);
  let y = Math.floor(index%50);
  return Game.rooms.sim.getPositionAt(x,y);
}

function dijkstra_length(u, v) {
  let pos = iToPos(v);
  let terrain = Game.rooms.sim.getTerrain().get(pos.x, pos.y);
  switch (terrain)
  {
    case TERRAIN_MASK_WALL: return 150;
    case TERRAIN_MASK_SWAMP: return 10;
    // TODO add road logic
    default: return 1;
  }
}

class Element
{
  constructor(node, priority)
  {
    this.node = node;
    this.priority = priority;
  }

  valueOf()
  {
    return this.priority;
  }
}

function comparator(a,b) {
  return a[1] < b[1];
}

const dijkstra = (graph, source) => {
  let dist = {};
  let prev = {};
  let Q = new PriorityQueue();

  dist[source] = 0;

  for (let v = 0; v < 2500; ++v)
  {
    if (v != source)
    {
      dist[v] = Number.POSITIVE_INFINITY;
    }
    prev[v] = undefined;

    Q.add(new Element(v, dist[v]));
  }

  while (!Q.isEmpty())
  {
    let u = Q.poll().node;

    dijkstra_getNeighbors(u).forEach(v => {
      let alt = dist[u] + dijkstra_length(u, v);
      if (alt < dist[v])
      {
        Q.remove(new Element(v, dist[v]));
        Q.add(new Element(v, alt));
        dist[v] = alt;
        prev[v] = u;
      }
    });
  }
  return [dist,prev];
};

function map(x, in_min, in_max, out_min, out_max)
{
  // if (x > in_max) x = in_max;
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

class Colony
{
  constructor(room)
  {
    this.room = room;
    this.controller = room.controller;
    this.pos = this.controller.pos;
    this.mines = [];
    this.room.find(FIND_SOURCES).forEach(source => this.mines.push(new Mine(this, source)));
  }

  init()
  {
    console.log("Colony::init()");

    this.combined_costs = {};
    for (let i = 0; i < 2500; ++i)
    {
      this.combined_costs[i] = 0;
    }

    this.mines.forEach(mine => {
      mine.init();
      let mineIndex = mine.pos.x*50+mine.pos.y;
      let ret = dijkstra(null, mineIndex);
      for (let i = 0; i < 2500; ++i)
      {
        this.combined_costs[i] += ret[0][i] / mine.source.energyCapacity;
      }
    });

    let cindex = this.room.controller.pos.x*50+this.room.controller.pos.y;
    let ret = dijkstra(null, cindex);
    for (let i = 0; i < 2500; ++i)
    {
      this.combined_costs[i] += ret[0][i] / (3000*this.mines.length);
    }

    for (let i = 0; i < 2500; ++i)
    {
      this.combined_costs[i] /= this.mines.length;
    }

    console.log("max:", _.max(this.combined_costs), "min:", _.min(this.combined_costs));
  }

  refresh()
  {
    // console.log("Colony::refresh()");

    let maxCost = _.max(this.combined_costs);
    let min_cost = _.min(this.combined_costs);
    for (let i = 0; i < 2500; ++i)
    {
      let p = iToPos(i);
      let cost = this.combined_costs[i];
      let colorIndex = Math.round(map(cost, min_cost, 1.05*min_cost, 0, 255));
      let color = "rgba(" + colorIndex + "," + (255-colorIndex) + ",0,1)";
      this.room.visual.rect(p.x-0.5,p.y-0.5,1,1, {fill: color, opacity: 0.1});
    }

    this.mines.forEach((mine) => {
      mine.refresh();
    });
  }

  update()
  {
    // console.log("Colony::update()");
  }

  run()
  {
    // console.log("Colony::run()");

    this.mines.forEach((mine) => {
      mine.run();
    });
  }

  visuals()
  {

  }
}

module.exports = Colony;
