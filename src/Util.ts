import "screeps";
import { FibonacciHeap } from '@tyriar/fibonacci-heap';

function iToPos(index: number): RoomPosition
{
  let x = Math.floor(index/50);
  let y = Math.floor(index%50);
  let room = Game.spawns.Spawn1.room;
  return room.getPositionAt(x,y);
}

class NodeElement
{
  node: number;
  priority: number;
  constructor(node: number, priority: number)
  {
    this.node = node;
    this.priority = priority;
  }

  valueOf()
  {
    return this.priority;
  }
}

function dijkstra_length(u:number, v:number): number
{
  let pos: RoomPosition = iToPos(v);
  let terrain = Game.spawns.Spawn1.room.getTerrain().get(pos.x, pos.y);
  switch (terrain)
  {
    case TERRAIN_MASK_WALL: return 75;
    case TERRAIN_MASK_SWAMP: return 5;
    default: return 1;
  }
}

function dijkstra_getNeighbors(u:number): number[]
{
  let neighbors: number[] = [];
  for (let i = 0; i < 9; ++i)
  {
    let x = Math.floor(i/3) + Math.floor(u/50) - 1;
    let y = Math.floor(i%3) + Math.floor(u%50) - 1;
    if (x<0||x>=50||y<0||y>=50) continue;
    let v: number = x*50+y;
    if (u == v) continue;
    neighbors.push(v);
  }
  return neighbors;
}

function dijkstra(start: number): number[]
{
  let dist: number[] = new Array(2500);
  let prev = {}; // TODO js
  let Q: FibonacciHeap<number,number> = new FibonacciHeap<number, number>();

  dist[start] = 0;

  for (let v = 0; v < 2500; ++v)
  {
    if (v != start)
    {
      dist[v] = Infinity;
    }
    prev[v] = undefined;
    Q.insert(dist[v], v);
  }

  while (!Q.isEmpty())
  {
    let u: number = Q.extractMinimum().value;

    dijkstra_getNeighbors(u).forEach(v => {
      let alt: number = dist[u] + dijkstra_length(u,v);
      if (alt < dist[v])
      {
        Q.decreaseKey({key:dist[v],value:v}, alt);
        dist[v] = alt;
        prev[v] = u;
      }
    });
  }
  return dist;
}
