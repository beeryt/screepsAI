/*jshint bitwise: false*/
var Mine = require("Mine");
var Util = require("Util");

var DT = require("OvermindDistances");

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

    this.costs = [];
  }

  init()
  {
    console.log("Colony::init()");

    // this.dt = DT.distanceTransform(Game.spawns.Spawn1.room.name);
    // this.mines.forEach(mine=>mine.init());
    // this.plan();
    // this.costs = this.findWallDistance();
    // this.maxCost = _.max(this.costs);
    // this.candidates = this.findSpawnLocation();
  }

  refresh()
  {
    // console.log("Colony::refresh()");
    this.mines.forEach((mine) => {
      mine.refresh();
    });
  }

  plan()
  {
    console.log("Colony::plan()");
    let dt = DT.distanceTransform(this.room.name);
    let cts = new Array(2500);
    // this.displayCostArray(cts);

    for (let x = 0; x < 50; ++x) for (let y = 0; y < 50; ++y)
    {
      cts[x*50+y] = dt.get(x,y);
    }
    let mts = [];
    this.mines.forEach(mine=>mts.push(Util.dijkstra(null,mine.pos)[0]));
    this.displayCostArray(mts[0])
  }

  update()
  {
    console.log("Colony::update()");
    this.room.visual.clear();
    this.plan();
    // DT.displayCostMatrix(this.dt,"blue", this.room.visual);
    return;

    this.candidates[0].forEach(c=>this.room.visual.circle(c, {fill: "green"}))
    this.candidates[1].forEach(c=>this.room.visual.circle(c, {fill: "orange"}))
    this.candidates[2].forEach(c=>this.room.visual.circle(c, {fill: "red"}))

    this.room.visual.circle(this.mines[0].pos, {radius:1, opacity:0.1})
    let array = this.costs;

    let maxCost = _.max(array);
    let minCost = _.min(array);
    let avgCost = _.sum(array)/array.length;

    console.log("Max:", maxCost, "Min:", minCost, "Mean:", avgCost)

    for (let i = 0; i < 2500; ++i)
    {
      let p = Util.iToPos(i);
      let cost = array[i];

      let intensity = Util.map(cost, 0, maxCost, 0, 1);
      if (intensity < 0) intensity = 0;
      if (intensity > 1) intensity = 1;
      let color = Math.floor(255*intensity);
      let text = Math.floor(9*intensity)

      let r = 255 - color;
      let g = color;
      let b = 0;
      let a = 0.5*intensity;
      let colorStr = "rgba("+ r +","+ g +","+ b +","+ a +")"
      this.room.visual.rect(p.x-0.5,p.y-0.5,1,1, {fill: colorStr});
      if (i % 4 == 0)
      {
        // this.room.visual.text(cost,p);
      }
    }

    this.mines.forEach(mine => {
      mine.update();
    });
  }

  findWallDistance()
  {
    let costs = new Array(2500);

    for (let i = 0; i < 2500; ++i)
    {
      costs[i] = 0;
      let x = Math.floor(i/50);
      let y = Math.floor(i%50);
      if ((x in [0,1,2,47,48,49] && y in [0,1,2,47,48,49]) || this.room.getTerrain().get(x,y) === TERRAIN_MASK_WALL)
      {
        costs[i] = 1;
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
        if (costs[i] === distance)
        {
          for (let x1 of [-1, 0, 1])
          {
            for (let y1 of [-1, 0, 1])
            {
              let x2 = x+x1;
              let y2 = y+y1;
              let i2 = Util.xyToI(x2,y2);
              if (costs[i2] === 0)
              {
                max = distance + 1;
                costs[i2] = max;
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
      maxCost = Math.max(maxCost, this.costs[i]);
    }

    for (let x of _.range(7,43))
    {
      for (let y of _.range(7,40))
      {
        let i = x*50+y;
        if (this.costs[i] >= 5 && this.costs[i+3] >= 4)
        {
          let pos = this.room.getPositionAt(x,y);
          if (this.costs[i+(4*50-7)] >= 3 && this.costs[i+(-4*50-7)] >= 5)
          {
            perfect.push(pos);
          }
          else if (this.costs[i-2*50] >= 7)
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

    return [perfect,okey,possible]
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
