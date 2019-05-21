Object.defineProperty(Room.prototype, "positions", {
  get: function*(): Iterable<RoomPosition> {
    for (const x of _.range(50))
      for (const y of _.range(50))
        yield this.getPositionAt(x,y);
  },
  configurable: true
});
