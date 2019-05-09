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

    this.combined_costs = new Array(2500);
    for (let i = 0; i < 2500; ++i)
    {
      this.combined_costs[i] = 0;
    }

    this.mines.forEach(mine => {
      let mineIndex = mine.pos.x*50+mine.pos.y;
      let ret = Util.dijkstra(null, mineIndex);
      for (let i = 0; i < 2500; ++i)
      {
        this.combined_costs[i] += ret[0][i] / 3000;
      }
    });

    let cindex = this.room.controller.pos.x*50+this.room.controller.pos.y;
    let ret = Util.dijkstra(null, cindex);
    for (let i = 0; i < 2500; ++i)
    {
      this.combined_costs[i] += ret[0][i] / 2000;
    }

    for (let i = 0; i < 2500; ++i)
    {
      this.combined_costs[i] /= (this.mines.length + 1);
    }

    this.pos = Util.iToPos(this.combined_costs.indexOf(_.min(this.combined_costs)));
    this.mines.forEach(mine => {
      mine.init();
    })

    console.log("max:", _.max(this.combined_costs), "min:", _.min(this.combined_costs));
  }

  refresh()
  {
    // console.log("Colony::refresh()");

    let maxCost = _.max(this.combined_costs);
    let min_cost = _.min(this.combined_costs);

    let ind = this.combined_costs.indexOf(min_cost);
    let Q = Util.flood(this.combined_costs, ind, min_cost);
    Q.forEach(n => {
      let x = Math.floor(n/50);
      let y = Math.floor(n%50);
      this.room.visual.rect(x-0.25, y-0.25, .5, .5, {fill: "#ffffff", opacity: 0.25});
      this.room.visual.rect(x-.5,y-.1,1,.2, {fill: "#ffffff", opacity: 0.25});
      this.room.visual.rect(x-.1,y-.5,.2,1, {fill: "#ffffff", opacity: 0.25});
    });
    this.room.visual.circle(Util.iToPos(ind), {radius: 0.5, fill: "#deadbeaf"})

    for (let i = 0; i < 2500; ++i)
    {
      let p = Util.iToPos(i);
      let cost = this.combined_costs[i];
      let colorIndex = Math.round(Util.map(cost, min_cost, 1.05*min_cost, 0, 255));
      let color = "rgba(" + colorIndex + "," + (255-colorIndex) + ",0,"+ (255-colorIndex)/255 + ")";
      this.room.visual.rect(p.x-0.5,p.y-0.5,1,1, {fill: color, opacity: 0.1});
    }

    this.mines.forEach((mine) => {
      mine.refresh();
    });
  }

  update()
  {
    this.room.visual.clear()
    // console.log("Colony::update()");
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

  run()
  {
    // console.log("Colony::run()");
    let costs = this.findWallDistance();

    let perfect = [];
    for (let x of _.range(7,43))
    {
      for (let y of _.range(7,40))
      {
        if (costs.get(x,y) >= 5 && costs.get(x,y+3) >= 4)
        {
          let pos = this.room.getPositionAt(x,y);
          if (costs.get(x+4, y-7) >= 3 && costs.get(x-4,y-7) >= 5)
          {
            perfect.push(pos);
          }
        }
      }
    }
    perfect.forEach(pos => this.room.visual.rect(pos.x-0.5,pos.y-0.5,1,1, {opacity: 0.05}));

    let filtered = this.filterDistanceToVitalPositions(perfect);
    filtered.forEach(pos=>this.room.visual.circle(pos));

    let notricks = [];
    let spawn = Game.spawns.Spawn1;
    let allowed = [];
    let count = 0;
    for (let p of perfect)
    {
      if ((p.x !== spawn.pos.x || (p.y !== spawn.pos.y && p.y !== spawn.pos.y - 1)) && (p.x !== spawn.pos.x - 2 || p.y !== spawn.pos.y + 1))
      {
        allowed.push(p);
      } else
      {
        count++;
      }
    }
    console.log("Filtered out", count, "tricky position from possible base positions");
    allowed.forEach(pos=>this.room.visual.rect(pos.x-0.3,pos.y-0.3,.6,.6, {opacity: 0.05}));

    let chosen = allowed[0];
    let distance = this.getTargetDistance(this.room.name, chosen);
    for (let p of allowed)
    {
      let d = this.getTargetDistance(this.room.name, p);
      if (d < distance)
      {
        chosen = p;
        distance = d;
      }
    }
    this.room.visual.circle(chosen, {radius: 0.5, opacity: 0.25, fill: 'green'})

    let costArray = new Array(2500);
    for (let i = 0; i < 2500; ++i)
    {
      let x = Math.floor(i/50);
      let y = Math.floor(i%50);
      costArray[i] = costs.get(x,y)
    }

    let minCost = _.min(costArray);
    let maxCost = _.max(costArray);

    let minCost1 = _.min(this.combined_costs);
    let maxCost1 = _.max(this.combined_costs);

    console.log(minCost,maxCost,minCost1,maxCost1)

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
