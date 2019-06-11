import { Mine } from "./Mine";

export class Colony {
  private room: any;
  private controller: any;
  private pos: any;
  private mines: Mine[];
  private costs: number[];

  public constructor(room: Room) {
    this.room = room;
    this.controller = room.controller;
    this.pos = this.controller.pos;
    this.mines = [];
    this.room.find(FIND_SOURCES).forEach((source: any): void => { this.mines.push(new Mine(this, source)); }, this);
    this.room.find(FIND_MINERALS).forEach((mineral: any): void => { this.mines.push(new Mine(this, mineral)); }, this);

    this.costs = [];
  }

  public init(): void {
    console.log("Colony::init()");
    this.mines.forEach((mine): void => {
      mine.init();
    });
  }

  public refresh(): void {
    this.mines.forEach((mine): void => {
      mine.refresh();
    });
  }

  public update(): void {
    console.log("Colony::update()");
    this.room.visual.clear();
    this.mines.forEach((mine): void => {
      mine.update();
    });
  }
  public run(): void {
    // console.log("Colony::run()");
    this.mines.forEach((mine): void => {
      mine.run();
    });
  }

  public visuals(): void {

  }
}
