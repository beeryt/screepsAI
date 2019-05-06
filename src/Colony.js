/*jshint bitwise: false*/
var PriorityQueue = require('FastPriorityQueue');
var Mine = require("Mine");

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
  return Game.rooms.sim.getTerrain().get(pos.x, pos.y);
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

const dijkstra = (graph, source) => {
  source = 0;
  let dist = {};
  let prev = {};
  let Q = new PriorityQueue();

  dist[source] = 0;

  let infinityCount = 0;
  for (let v = 0; v < 2500; ++v)
  {
    if (v != source)
    {
      infinityCount++;
      dist[v] = Math.POSITIVE_INFINITY;
    }
    prev[v] = undefined;

    Q.add(new Element(v, dist[v]));
  }
  console.log("infinityCount:", infinityCount);
  return [{},{}]

  let qCount = 0;
  let altCount = 0;
  while (!Q.isEmpty())
  {
    qCount++;
    let u = Q.poll().node;

    dijkstra_getNeighbors(u).forEach(v => {
      console.log("Not Here", u, v, dijkstra_getNeighbors(u), "dist[u]:", dist[u]);
      let alt = dist[u] + dijkstra_length(u, v);
      if (alt < dist[v])
      {
        altCount++;
        dist[v] = alt;
        prev[v] = u;
        Q.add(new Element(v, alt));
      }
    });
  }
  console.log("qCount:", qCount);
  console.log("altCount:", altCount);
  return [dist,prev];
};

function getMineMap(room)
{}

function doThing(room)
{
  let minX, minY, maxX, maxY;
  minX = minY = 50;
  maxX = maxY = 0;

  room.find(FIND_SOURCES).forEach(source => {
    let x = source.pos.x;
    let y = source.pos.y;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  });

  let width = maxX - minX+1;
  let height = maxY - minY+1;

  // sources bounding box
  room.visual.rect(minX-0.5, minY-0.5, width, height, {fill: '#00000000', stroke: '#0af000'});


  let start = 1275;
  let ret = dijkstra(null,start);
  console.log("dijkstra complete");
  room.visual.circle(iToPos(start), {radius: 0.5, fill: "#FF00FF"});
  let dist = ret[0];
  for (let i = 0; i < 2500; ++i)
  {
    let pos = iToPos(i);
    let color = "rgba(" + dist[i] + ",0,255,1)";
    // room.visual.circle(pos, {fill: "#"+((1<<24)*dist[i]|0).toString(16)});
    room.visual.circle(pos, {fill: color});
  }
}

class Colony
{
  constructor(room)
  {
    this.room = room;
    this.controller = room.controller;
    this.pos = this.controller.pos;
    this.mines = [];
  }

  init()
  {
    console.log("Colony::init()");

    let sumX = 0;
    let sumY = 0;
    let mass = 0;
    this.room.find(FIND_SOURCES).forEach(source => {
      sumX += source.pos.x * source.energyCapacity;
      sumY += source.pos.y * source.energyCapacity;
      mass += source.energyCapacity;
      this.mines.push(new Mine(this, source));
    });

    sumX += this.controller.pos.x * mass;
    sumY += this.controller.pos.y * mass;
    mass += mass;

    this.pos = this.room.getPositionAt(sumX/mass, sumY/mass);
    this.room.visual.circle(this.pos);

    this.room.memory.mineMap = {};
    this.mines.forEach(mine => {
      this.room.memory.mineMap[mine] = getMineMap(mine);
      mine.init();
    });
  }

  refresh()
  {
    console.log("Colony::refresh()");
    doThing(this.room);

    this.mines.forEach((mine) => {
      mine.refresh();
    });
  }

  update()
  {
    console.log("Colony::update()");

    this.mines.forEach((mine) => {
      mine.update();
    });
  }

  run()
  {
    console.log("Colony::run()");

    this.mines.forEach((mine) => {
      mine.run();
    });
  }

  visuals()
  {

  }
}

module.exports = Colony;
