/*jshint bitwise: false*/
var Mine = require("Mine");
var Util = require("Util");

class Colony
{
  constructor(room)
  {
    this.room = room;
    this.controller = room.controller;
    this.pos = this.controller.pos;
    this.mines = [];
    this.room.find(FIND_SOURCES).forEach(source => this.mines.push(new Mine(this, source)));
    this.room.find(FIND_MINERALS).forEach(mineral => this.mines.push(new Mine(this, mineral)));
  }

  init()
  {
    console.log("Colony::init()");

    this.mines.forEach(mine=>mine.init());
    this.costMatrix = this.findWallDistance();
  }

  refresh()
  {
    // console.log("Colony::refresh()");
    this.mines.forEach((mine) => {
      mine.refresh();
    });
  }

  update()
  {
    console.log("Colony::update()");
    this.room.visual.clear();
    this.mines.forEach(mine => {
      mine.update();
    });
  }

  findWallDistance()
  {
    let costs = new PathFinder.CostMatrix;

    for (let i = 0; i < 2500; ++i)
    {
      let x = Math.floor(i/50);
      let y = Math.floor(i%50);
      if ((x in [0,1,2,47,48,49] && y in [0,1,2,47,48,49]) || this.room.getTerrain().get(x,y) === TERRAIN_MASK_WALL)
      {
        costs.set(x,y,1);
      }
    }

    let distance = 0;
    let found = true;
    let max = 1;
    while (distance < 25)
    {
      distance++;
      found = false;
      for (let i = 0; i < 2500; ++i)
      {
        let x = Math.floor(i/50);
        let y = Math.floor(i%50);
        if (costs.get(x,y) === distance)
        {
          for (let x1 of [-1, 0, 1])
          {
            for (let y1 of [-1, 0, 1])
            {
              let x2 = x+x1;
              let y2 = y+y1;
              if (costs.get(x2,y2) === 0)
              {
                max = distance + 1;
                costs.set(x2,y2, max);
                found = true;
              }
            }
          }
        }
      }
    }
    return costs;
  }

  findSpawnLocation(firstRoom = false)
  {
    let perfect = [];
    let okey = [];
    let possible = [];

    let maxCost = 0;
    for (let i = 0; i < 2500; ++i)
    {
      let x = Math.floor(i/50);
      let y = Math.floor(i%50);
      maxCost = Math.max(maxCost, this.costMatrix.get(x,y));
    }

    for (let x of _.range(7,43))
    {
      for (let y of _.range(7,40))
      {
        if (this.costMatrix.get(x,y) >= 5 && this.costMatrix.get(x,y+3) >= 4)
        {
          let pos = this.room.getPositionAt(x,y);
          if (this.costMatrix.get(x+4,y-7) >= 3 && this.costMatrix.get(y-4,y-7) >= 5)
          {
            perfect.push(pos);
          }
          else if (this.costMatrix.get(x-2,y) >= 7)
          {
            okey.push(pos);
          }
        }
      }
    }
    if (firstRoom)
    {
      perfect = this.removeTrickyPosistions(perfect);
      okey = this.removeTrickyPosistions(okey);
      possible = this.removeTrickyPosistions(possible);
    }
  }

  removeTrickyPosistions(positions)
  {
    if (this.room === undefined) { return positions; }
    let spawn = this.room.getSpawn();
    if (spawn === undefined) { return positions; }
    let allowed = [];
    for (let p of positions)
    {
      if ((p.x !== spawn.pos.x || (p.y !== spawn.pos.y && p.y !== spawn.pos.y - 1)) && (p.x !== spawn.pos.x - 2 || p.y !== spawn.pos.y + 1))
      {
        allowed.push(p);
      }
    }
    return allowed;
  }

  run()
  {
    // console.log("Colony::run()");
    this.mines.forEach((mine) => {
      mine.run();
    });
  }

  filterDistanceToVitalPositions(positions)
  {
    let filtered = [];
    let vitalTargets = this.mines;

    for (let p of positions)
    {
      let validPosition = true;
      for (let v of vitalTargets)
      {
        if (p.getRangeTo(v) < 6)
        {
          validPosition = false;
        }
      }
      let cPos = this.room.controller;
      if (p.getRangeTo(cPos) < 8)
      {
        validPosition = false;
      }
      if (validPosition)
      {
        filtered.push(p);
      }
    }
    return filtered;
  }


  getTargetDistance(roomName, basePos)
  {
    let room = Game.rooms[roomName];
    let theDistance = 0;

    for (let source of this.mines)
    {
      theDistance += basePos.getRangeTo(source.pos);
    }

    let cPos = room.controller.pos;
    theDistance += basePos.getRangeTo(cPos);
    return theDistance;

  }


  visuals()
  {

  }
}


module.exports = Colony;
