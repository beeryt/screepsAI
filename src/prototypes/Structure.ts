Object.defineProperty(Structure.prototype, 'isWalkable', {
  get(): boolean
  {
    if (this.structureType === STRUCTURE_RAMPART)
    {
      const s = this as StructureRampart;
      return s.my || s.isPublic;
    }
    return this.structureType === STRUCTURE_ROAD ||
    this.structureType === STRUCTURE_CONTAINER;
  },
  configurable: true
});
