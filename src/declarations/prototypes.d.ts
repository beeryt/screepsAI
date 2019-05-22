interface Structure
{
  isWalkable: boolean;
}

interface RoomPosition
{
  readonly id: string|number;
  isWalkable(ignoreCreeps?: boolean): boolean;
  neighbors: RoomPosition[];
  isVisible: boolean;
}

interface Room
{
  positions: Iterable<RoomPosition>;
}
