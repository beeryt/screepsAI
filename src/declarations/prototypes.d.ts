interface Structure
{
  isWalkable: boolean;
}

interface RoomPosition
{
  isWalkable(ignoreCreeps?: boolean): boolean;
  neighbors: RoomPosition[];
  isVisible: boolean;
}

interface Room
{
  positions: Iterable<RoomPosition>;
}
