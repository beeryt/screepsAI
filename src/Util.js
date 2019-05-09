
var PriorityQueue = require('FastPriorityQueue');

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
exports.floyd_warshall = floyd_warshall;

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
exports.dijkstra_getNeighbors = dijkstra_getNeighbors;

const nodeParent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

function iToPos(index) {
  let x = Math.floor(index/50);
  let y = Math.floor(index%50);
  let room = Game.spawns.Spawn1.room;
  return room.getPositionAt(x,y);
}
exports.iToPos = iToPos;

function posToI(pos) { return pos.x*50+pos.y; }
exports.posToI = posToI;

function xyToI(x,y) { return x*50+y; }
exports.xyToI = xyToI;

function dijkstra_length(u, v) {
  let pos = iToPos(v);
  let terrain = Game.spawns.Spawn1.room.getTerrain().get(pos.x, pos.y);
  switch (terrain)
  {
    case TERRAIN_MASK_WALL: return 75;
    case TERRAIN_MASK_SWAMP: return 5;
    // TODO add road logic
    default: return 1;
  }
}
exports.dijkstra_length = dijkstra_length;

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
  let dist = new Array(2500);
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
exports.dijkstra = dijkstra;

function fuzzyCompare(a,b)
{
  return Math.abs(a-b) < Number.EPSILON;
}
exports.fuzzyCompare = fuzzyCompare;

function flood(graph, node, target_val)
{
  if (graph[node] != target_val) return;
  let Q = [];
  let out = [];
  Q.push(node);
  out.push(node);
  while (Q.length > 0)
  {
    let n = Q.shift();
    let neighbors = dijkstra_getNeighbors(n);
    for (let i = 0; i < neighbors.length; ++i)
    {
      if (!fuzzyCompare(graph[neighbors[i]], target_val)) continue;
      if (out.includes(neighbors[i])) continue;
      Q.push(neighbors[i]);
      out.push(neighbors[i]);
    }
  }
  return out;
}
exports.flood = flood;

function map(x, in_min, in_max, out_min, out_max)
{
  // if (x > in_max) x = in_max;
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
exports.map = map;
