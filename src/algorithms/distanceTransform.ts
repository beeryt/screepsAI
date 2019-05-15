function neighbors(dist: CostMatrix, x: number, y: number, dirs: DirectionConstant[]): number[]
{
  let n: number[] = [];
  for (let d of dirs)
  {
    if (d === TOP_LEFT && x > 0 && y > 0) n.push(dist.get(x-1,y-1));
    if (d === TOP && y > 0) n.push(dist.get(x,y-1));
    if (d === TOP_RIGHT && x <= 50 && y > 0) n.push(dist.get(x+1,y-1));
    if (d === RIGHT && x <= 50) n.push(dist.get(x+1,y));
    if (d === BOTTOM_RIGHT && x <= 50 && y <= 50) n.push(dist.get(x+1,y+1));
    if (d === BOTTOM && y <= 50) n.push(dist.get(x,y+1));
    if (d === BOTTOM_LEFT && x > 0 && y <= 50) n.push(dist.get(x-1,y+1));
    if (d === LEFT && x > 0) n.push(dist.get(x-1,y));
  }
  return n;
}

export function distanceTransform(foreground: CostMatrix): CostMatrix
{
  const dist = foreground;

  // forward pass
  for (let x of _.range(50))
  {
    for (let y of _.range(50))
    {
      if (foreground.get(x,y) === 0) continue;
      let value = _.min(neighbors(dist,x,y, [BOTTOM_LEFT, LEFT, TOP_LEFT, TOP]));
      dist.set(x,y, value + 1);
    }
  }

  // backward pass
  for (let x of _.range(50).reverse())
  {
    for (let y of _.range(50).reverse())
    {
      let value = _.min(neighbors(dist,x,y, [TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM]));
      dist.set(x,y, Math.min(dist.get(x,y), value + 1));
    }
  }

  return dist;
}

// Compute a cost matrix for walkable pixels in a room
export function walkablePixelsForRoom(roomName: string): CostMatrix
{
  const costMatrix = new PathFinder.CostMatrix();
  const terrain = Game.map.getRoomTerrain(roomName);
  for (let y = 0; y < 50; ++y)
  {
    for (let x = 0; x < 50; ++x)
    {
      if (terrain.get(x, y) != TERRAIN_MASK_WALL)
      {
        costMatrix.set(x, y, 1);
      }
    }
  }
  return costMatrix;
}

function wallOrAdjacentToExit(x: number, y: number, roomName: string): boolean
{

  const terrain = Game.map.getRoomTerrain(roomName);

  if (1 < x && x < 48 && 1 < y && y < 48)
  {
    return terrain.get(x, y) == TERRAIN_MASK_WALL;
  }
  if (0 == x || 0 == y || 49 == x || 49 == y)
  {
    return true;
  }
  if (terrain.get(x, y) == TERRAIN_MASK_WALL)
  {
    return true;
  }
  // If we've reached here then position is a walkable neighbor to an exit tile
  let A, B, C;
  if (x == 1)
  {
    A = terrain.get(0, y - 1);
    B = terrain.get(0, y);
    C = terrain.get(0, y + 1);
  }
  else if (x == 48)
  {
    A = terrain.get(49, y - 1);
    B = terrain.get(49, y);
    C = terrain.get(49, y + 1);
  }
  if (y == 1)
  {
    A = terrain.get(x - 1, 0);
    B = terrain.get(x, 0);
    C = terrain.get(x + 1, 0);
  }
  else if (y == 48)
  {
    A = terrain.get(x - 1, 49);
    B = terrain.get(x, 49);
    C = terrain.get(x + 1, 49);
  }
  return !(A == TERRAIN_MASK_WALL && B == TERRAIN_MASK_WALL && C == TERRAIN_MASK_WALL);
}

// Compute positions where you can build movement-blocking structures in a room
function blockablePixelsForRoom(roomName: string): CostMatrix
{
  const costMatrix = new PathFinder.CostMatrix();
  for (let y = 0; y < 50; ++y)
  {
    for (let x = 0; x < 50; ++x)
    {
      if (!wallOrAdjacentToExit(x, y, roomName))
      {
        costMatrix.set(x, y, 1);
      }
    }
  }
  return costMatrix;
}

// Visualize a given costMatrix globally
export function displayCostMatrix(costMatrix: CostMatrix, color = '#fff000'): void
{
  const vis = new RoomVisual();

  let max = 1;
  for (let y = 0; y < 50; ++y)
  {
    for (let x = 0; x < 50; ++x)
    {
      max = Math.max(max, costMatrix.get(x, y));
    }
  }

  for (let y = 0; y < 50; ++y)
  {
    for (let x = 0; x < 50; ++x)
    {
      const value = costMatrix.get(x, y);
      if (value > 0)
      {
        vis.circle(x, y, {radius: costMatrix.get(x, y) / max / 2, fill: color});
      }
    }
  }
}

export function testDistanceTransform(roomName = 'sim')
{
  const dt = distanceTransform(walkablePixelsForRoom(roomName));
  displayCostMatrix(dt);
}
