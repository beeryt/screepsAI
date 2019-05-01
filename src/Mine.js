class EnergyMine {
  constructor(source, colony)
  {
    this.colony = colony;
    this.pos = source.pos;
    this.room = source.room;
    this.source = source;
    this.container = undefined;
    this.link = undefined;
    this.construction = undefined;

    this.miners = [];

    this.populateStructures();

    this.energyPerTick = this.source.energyCapacity / ENERGY_REGEN_TIME;
    this.workPartsNeeded = Math.ceil(this.energyPerTick / HARVEST_POWER) + 1;
  }

  populateStructures()
  {
    if (Game.rooms[this.pos.roomName])
    {
      this.room = Game.rooms[this.pos.roomName];
      this.source = _.first(this.pos.lookFor(LOOK_SOURCES));
      this.constructionSite = _.first(this.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2));
      this.container = this.pos.findClosestByRange(this.room.containers, 1);
      this.link = this.pos.findClosestByRange(this.colony.availableLinks, 2);
    }
  }

  findContainerPos()
  {
    let origin = undefined;

    if (this.colony.storage)
    {
      origin = this.colony.storage.pos;
    } else if (this.colony.storagePos)
    {
      origin = this.colony.storagePos;
    } else
    {
      console.error("Mine has nowhere to direct output");
      return null;
    }

    let path = PathFinder.search(origin, {pos: this.pos, range: 1});
    let pos = _.find(path.path, pos => pos.getRangeTo(this) == 1);
    if (pos) return pos;
  }

  handle(miner)
  {
    if (miner.room != this.room)
    {
      return miner.goToRoom(this.pos.roomName);
    }

    if (this.container)
    {
      if (this.container.hits < this.container.hitsMax && miner.carry.energy >= Math.min(miner.carryCapacity, REPAIR_POWER * miner.getActiveBodyparts(WORK)))
      {
        return miner.repair(this.container);
      } else
      {
        if (_.sum(miner.carry) < miner.carryCapacity)
        {
          return miner.harvest(this.source);
        } else
        {
          return miner.transfer(this.container);
        }
      }
    }

    if (this.constructionSite)
    {
      if (miner.carry.energy >= Math.min(miner.carryCapacity, BUILD_POWER * miner.getActiveBodyparts(WORK)))
      {
        return miner.build(this.constructionSite);
      } else
      {
        return miner.harvest(this.source);
      }
    }

    return;
  }

  update()
  {
    // console.log("Mine::update()");
    let numWorkParts = 0;
    this.miners.forEach(function(miner) {
      numWorkParts += miner.getActiveBodyparts(WORK);
    });

    // console.log(numWorkParts);

    if (numWorkParts < this.workPartsNeeded)
    {
      let name = 'miner ' + Game.time;
      let ret = Game.spawns.Spawn1.spawnCreep([CARRY, WORK, MOVE], name);
      if (ret == OK)
      {
        this.miners.push(Game.creeps[name]);
      }
    }

    this.room.visual.circle(this.pos);
    this.room.visual.line(this.pos, this.colony.pos);
  }

  refresh()
  {
  }

  run()
  {
    for (let miner of this.miners)
    {
      this.handle(miner);
    }
  }

}

module.exports = EnergyMine;
