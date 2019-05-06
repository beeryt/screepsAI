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
    neighbors.push(v)
  }
  return neighbors;
};

const dijkstra_length = (dist, prev, u, v) => {
  let length = 0;
  return Game.rooms['sim'].getTerrain().get(Math.floor(u/50),u%50);
}

class PriorityQueue {
  constructor() {
    this.collection = [];
  }

  enqueue(element) {
    if (this.size() === 0)
    {
      this.collection.push(element);
    } else
    {
      let added = false;
      for (let i = 1; i <= this.collection.length; ++i)
      {
        if (element[1] < this.collection[i-1][1])
        {
          this.collection.splice(i-1, 0, element);
          added = true;
          break;
        }
      }
      if (!added)
      {
        this.collection.push(element);
      }
    }
  }

  dequeue() {
    let value = this.collection.shift();
    return value;
  }

  has(element) {
    return this.collection.has(element);
  }

  size() {
    return this.collection.length;
  }
};

const dijkstra = (graph, source) => {
  let Q = new PriorityQueue();
  let dist = {};
  let prev = {};

  for (let v = 0; v < 2500; ++v)
  {
    dist[v] = Number.POSITIVE_INFINITY;
    prev[v] = undefined;
    Q.enqueue(v);
  }
  dist[source] = 0;

  console.log("dists source,", dist[source], dist[0])
  console.log("Neighbors:", dijkstra_getNeighbors(source));
  let str = "";
  dijkstra_getNeighbors(source).forEach(n => {
    str += dist[n] + ",";
  });
  console.log(str);
  console.log("Q.size():", Q.size());

  let altCount = 0;
  let qCount = 0;
  while (Q.size() > 0)
  {
    qCount++;
    let u = Q.dequeue();

    let neighbors = dijkstra_getNeighbors(u);
    console.log("NeighborLength:", neighbors.length)
    for (let i = 0; i < neighbors.length; ++i)
    {
      let v = neighbors[i];
      if (!Q.has(v)) continue;
      let alt = dist[u] + dijkstra_length(dist,prev,u,v);
      console.log("Hello", dist[u], alt, dist[v])
      if (alt < dist[v]) {
        console.log("altenating")
        altCount++;
        dist[v] = alt;
        prev[v] = u;
      }
    }
  }
  console.log("AltCount:", altCount)
  console.log("qCount:", qCount);
  return [dist, prev];
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
  room.visual.rect(minX-.5, minY-.5, width, height, {fill: '#00000000', stroke: '#0af000'});


  let ret = dijkstra(null,1250);
  room.visual.circle(Math.floor(Math.floor(1250/50),1250%50))
  let dist = ret[0];
  for (let i = 0; i < 2500; ++i)
  {
    // console.log(dist[i])
    let pos = room.getPositionAt(Math.floor(i/50), Math.floor(i%50));
    let color = "rgba(" + dist[i] + ",0,255,1)";
    // room.visual.circle(pos, {fill: "#"+((1<<24)*dist[i]|0).toString(16)});
    room.visual.circle(pos, {fill: color})
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
