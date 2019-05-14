Object.defineProperty(RoomPosition.prototype, 'room', {
  get: function(): Room
  {
    return Game.rooms[this.roomName];
  },
  configurable: true,
});

Object.defineProperty(RoomPosition.prototype, "isVisible", {
  get: function(): boolean
  {
    return Game.rooms[this.roomName] !== undefined;
  },
  configurable: true
});

Object.defineProperty(RoomPosition.prototype, 'neighbors', {
  get: function(): RoomPosition[]
  {
    const adjPos: RoomPosition[] = [];
    for (const dx of [-1, 0, 1])
    {
      for (const dy of [-1, 0, 1])
      {
        if (dx == 0 && dy == 0) continue;
        const x = this.x + dx;
        const y = this.y + dy;
        if (x < 0 || x > 49 || y < 0 || y > 49)
        {
          adjPos.push(new RoomPosition(x, y, this.roomName));
        }
      }
    }
    return adjPos;
  },
  configurable: true,
});

// RoomPosition.prototype.isWalkable = (ignoreCreeps: boolean = false): boolean =>
RoomPosition.prototype.isWalkable = function(ignoreCreeps: boolean = false): boolean
{
  if (Game.map.getRoomTerrain(this.roomName).get(this.x, this.y) === TERRAIN_MASK_WALL) return false;
  if (this.isVisible)
  {
    if (!ignoreCreeps && this.lookFor(LOOK_CREEPS).length > 0)  return false;
    if (_.filter(this.lookFor(LOOK_STRUCTURES), (s: Structure): boolean => !s.isWalkable).length > 0) return false;
  }
  return true;
};
