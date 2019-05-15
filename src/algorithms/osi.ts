export function osi(roomName: string): CostMatrix|undefined
{
  let dist: CostMatrix = new PathFinder.CostMatrix;
  let terrain = Game.rooms[roomName].getTerrain();

  for (let x = 0; x < 50; ++x)
  {
    for (let y = 0; y < 50; ++y)
    {
      if (x < 3 || y < 3 || x > 46 || y > 46)
      {
        dist.set(x, y, 1);
      }
      if (terrain.get(x, y) === TERRAIN_MASK_WALL)
      {
        dist.set(x, y, 1);
      }
    }
  }

  let distance = 0;
  let found = true;
  let max = 1;
  while (distance < 25)
  {
    distance++;
    found = false;
    for (let x of _.range(1,49))
    {
      for (let y of _.range(1,49))
      {
        if (dist.get(x, y) === distance)
        {
          for (let x2 of [-1, 0, 1])
          {
            for (let y2 of [-1, 0, 1])
            {
              if (dist.get(x+x2,y+y2) === 0)
              {
                dist.set(x+x2,y+y2,distance+1);
                max = distance + 1;
                found = true;
              }
            }
          }
        }
      }
    }
  }
  if (max < 5)
  {
    console.log("Did not find a spawnposition for rooom:", roomName);
    return undefined;
  }
  for (let x of _.range(50)) for (let y of _.range(50))
  {
    let color = `rgba(0,0,${Math.floor(255*dist.get(x,y)/10)}, 0.5)`;
    Game.rooms[roomName].visual.rect(x-0.5,y-0.5,1,1,{fill:color});
  }
  return dist;
}

function walkableTiles(roomName: string): CostMatrix
{
  const costMatrix = new PathFinder.CostMatrix();
  const terrain = Game.map.getRoomTerrain(roomName);
  for (let x = 0; x < 50; ++x)
  {
    for (let y = 0; y < 50; ++y)
    {
      if (terrain.get(x, y) !== TERRAIN_MASK_WALL)
      {
        costMatrix.set(x, y, 1);
      }
    }
  }
  return costMatrix;
}
