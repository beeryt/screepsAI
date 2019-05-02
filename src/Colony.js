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

const dijkstra_findMin = (dist, Q) => {
  let min = Number.POSITIVE_INFINITY;
  let q = null;
  Q.forEach(u => {
    if (dist[u] < min)
    {
      min = dist[u];
      q = u;
    }
  });
  return q;
};

const dijkstra_getNeighbors = (u) => {
  let x = Math.floor(u/50);
  let y = Math.floor(u%50);
  let neighbors = [];
  for (let i = 0; i < 9; ++i) {
    let x = Math.floor(i/3);
    let y = Math.floor(i%3);
    let v = u + ((x-1)*50) + (y-1);
    if (v < 0 || v >= 50) continue;
    neighbors.push[v];
  }
  return neighbors;
};

const dijkstra = (graph, source) => {
  let Q = new Set();
  let dist = {};
  let prev = {};

  for (let v = 0; v < 2500; ++v)
  {
    dist[v] = Number.POSITIVE_INFINITY;
    prev[v] = undefined;
    Q.add(v);
  }
  dist[Math.floor(Math.random()) % 2500] = 0;

  while (Q.size)
  {
    let u = dijkstra_findMin(dist, Q);

    Q.delete(u);

    let neighbors = dijkstra_getNeighbors(u);
    for (let i = 0; i < neighbors.length; ++i)
    {
      let v = neighbors[i];
      if (!Q.has(v)) return;
      let alt = dist[u] + Math.floor(Math.random());
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
      }
    }

    return [dist, prev];
  }
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


  let ret = dijkstra(null,null);
  let dist = ret[0];
  let maxi = _.max(dist);
  dist.forEach(i => {
    let pos = room.getPositionAt(Math.floor(i/50), Math.floor(i%50));
    let color = "rgba(" + dist[i]/maxi + ",0,255,1)";
    room.visual.circle(pos, {fill: color});
  });
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
