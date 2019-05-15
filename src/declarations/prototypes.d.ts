interface Structure
{
  isWalkable: boolean;
}

interface RoomPosition
{
  isWalkable(ignoreCreeps?: boolean): boolean;
  isVisible: boolean;
}
