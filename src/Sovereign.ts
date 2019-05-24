import { Colony } from "./Colony";

export class Sovereign {
  private colonies: Colony[];
  public readonly expiry: number;

  public constructor() {
    this.colonies = [];
    this.expiry = Game.time + 100;
  }

  public populateColonies(): void {
    console.log("Sovereign::populateColonies()");
    this.colonies.push(new Colony(Game.spawns.Spawn1.room));
  }

  public init(): void {
    console.log("Sovereign::init()");
    this.populateColonies();
    this.colonies.forEach(function(colony): void {
      colony.init();
    });
  }

  public refresh(): void {
    // console.log("Sovereign::refresh()");
    this.colonies.forEach(function(colony): void {
      colony.refresh();
    });
  }

  public update(): void {
    // console.log("Sovereign::update()");
    this.colonies.forEach(function(colony): void {
      colony.update();
    });
  }

  public run(): void {
    // console.log("Sovereign::run()");
    this.colonies.forEach(function(colony): void {
      colony.run();
    });
  }
}

module.exports = Sovereign;
