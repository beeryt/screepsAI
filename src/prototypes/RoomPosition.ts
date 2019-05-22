Object.defineProperty(RoomPosition.prototype, 'room', {
  get: function(): Room {
    return Game.rooms[this.roomName];
  },
  configurable: true,
});

Object.defineProperty(RoomPosition.prototype, "id", {
  get: function(): string { return `<${this.roomName}: ${this.x},${this.y}`; },
  configurable: true,
});

Object.defineProperty(RoomPosition.prototype, "isVisible", {
  get: function(): boolean {
    return Game.rooms[this.roomName] !== undefined;
  },
  configurable: true
});

const product = (...args: number[][]): number[][] =>
  args.reduce(
    (a: number[][], b: number[]): number[][] =>
      _.flatten(a.map((x: number[]): number[][] => b.map((y: number): number[] => x.concat([y])))),
    [[]]
  );

const moore = product([-1,0,1],[-1,0,1]);

Object.defineProperty(RoomPosition.prototype, 'neighbors', {
  get: function(): RoomPosition[] {
    const adjPos: RoomPosition[] = [];
    for (let candidate of moore) {
      let x = this.x + candidate[0];
      let y = this.y + candidate[1];
      if (this.x == x && this.y == y) continue;
      if (x < 0 || x >= 50 || y < 0 || y >= 50) continue;
      adjPos.push(new RoomPosition(x, y, this.roomName));
    }
    return adjPos;
  },
  configurable: true,
});

RoomPosition.prototype.isWalkable = function(ignoreCreeps: boolean = false): boolean {
  if (Game.map.getRoomTerrain(this.roomName).get(this.x, this.y) === TERRAIN_MASK_WALL) return false;
  if (this.isVisible) {
    if (!ignoreCreeps && this.lookFor(LOOK_CREEPS).length > 0)  return false;
    if (_.filter(this.lookFor(LOOK_STRUCTURES), (s: Structure): boolean => !s.isWalkable).length > 0) return false;
  }
  return true;
};
