export interface ICoord {
  x: number;
  y: number;
}

export interface ILayout {
  anchor: RoomPosition;
  [rcl: number]: {
    buildings: {type: BuildableStructureConstant; pos: ICoord[]}[];
  };
};

export const mineLayout: ILayout  = {
  anchor: new RoomPosition(30,30,'sim'),
  1: {
    buildings: [
      {
        type: STRUCTURE_SPAWN,
        pos: [{x:0,y:0}]
      }
    ]
  }
};

const sequence = ["#294767", "#1e5b88", "#1a748b", "#1f8e7e", "#29a869", "#6abf50", "#aad332", "#eae30d", "#fff166"];

export const dualCamp: ILayout = {
  anchor: new RoomPosition(5,23,'sim'),
  2: {
    buildings: [
      {
        type: STRUCTURE_EXTENSION,
        pos: [
          {x:0,y:1}, {x:0,y:2}, {x:0,y:5}, {x:0,y:6}, {x:1,y:0},
        ]
      }
    ]
  },
  3: {
    buildings: [
      {
        type: STRUCTURE_EXTENSION,
        pos: [
          {x:1,y:2}, {x:1,y:3}, {x:1,y:4}, {x:1,y:5}, {x:1,y:7},
        ]
      }
    ]
  },
  4: {
    buildings: [
      {
        type: STRUCTURE_EXTENSION,
        pos: [
          {x:2,y:0}, {x:2,y:1}, {x:2,y:6}, {x:2,y:7}, {x:3,y:1},
        ]
      }, {
        type: STRUCTURE_STORAGE,
        pos: [{x:5,y:4}]
      }
    ]
  },
  5: {
    buildings: [
      {
        type: STRUCTURE_EXTENSION,
        pos: [
          {x:3,y:6}, {x:4,y:1}, {x:4,y:6}, {x:5,y:0}, {x:5,y:1},
        ]
      }
    ]
  },
  6: {
    buildings: [
      {
        type: STRUCTURE_EXTENSION,
        pos: [
          {x:5,y:6}, {x:5,y:7}, {x:6,y:0}, {x:6,y:2}, {x:6,y:3},
        ]
      }
    ]
  },
  7: {
    buildings: [
      {
        type: STRUCTURE_EXTENSION,
        pos: [
          {x:6,y:4}, {x:6,y:5}, {x:6,y:7}, {x:7,y:1}, {x:7,y:2},
        ]
      }
    ]
  },
  8: {
    buildings: [
      {
        type: STRUCTURE_EXTENSION,
        pos: [
          {x:7,y:5}, {x:7,y:6}
        ]
      }
    ]
  }
};

export const base: ILayout = {
  anchor: new RoomPosition(25,25,'sim'),
  1: {
    buildings: [
      {
        type: STRUCTURE_SPAWN,
        pos: [{x:-1,y:-1}]
      },
      {
        type: STRUCTURE_CONTAINER,
        pos: [{x:0,y:0}]
      }
    ]
  },
  2: {
    buildings: [
      {
        type: STRUCTURE_EXTENSION,
        pos: [{x:-2,y:3},{x:-1,y:3},{x:0,y:3},{x:1,y:3},{x:2,y:3}]
      }
    ]
  },
  3: {
    buildings: [
      {
        type: STRUCTURE_EXTENSION,
        pos: [{x:-2,y:-3},{x:-1,y:-3},{x:0,y:-3},{x:1,y:-3},{x:2,y:-3}]
      },
      {
        type: STRUCTURE_TOWER,
        pos: [{x:1,y:1}]
      }
    ]
  },
  4: {
    buildings: [
      {
        type: STRUCTURE_EXTENSION,
        pos: [{y:-2,x:-3},{y:-1,x:-3},{y:0,x:-3},{y:1,x:-3},{y:2,x:-3}]
      },
      {
        type: STRUCTURE_STORAGE,
        pos: [{y:0,x:0}]
      }
    ]
  },
  5: {
    buildings: [
      {
        type: STRUCTURE_EXTENSION,
        pos: [{y:-2,x:3},{y:-1,x:3},{y:0,x:3},{y:1,x:3},{y:2,x:3}]
      }
    ]
  },
  7: {
    buildings: [
      {
        type: STRUCTURE_SPAWN,
        pos: [{x:1,y:-1}]
      }
    ]
  },
  8: {
    buildings: [
      {
        type: STRUCTURE_SPAWN,
        pos: [{x:0,y:1}]
      }
    ]
  }
};

const Display: {[key: string]: string}= {};
Display[STRUCTURE_SPAWN] = "S";
Display[STRUCTURE_EXTENSION] = "E";
Display[STRUCTURE_CONTAINER] = "C";
Display[STRUCTURE_STORAGE] = "R";
Display[STRUCTURE_LAB] = "L";
Display[STRUCTURE_LINK] = "I";
Display[STRUCTURE_TOWER] = "D";
Display[STRUCTURE_TERMINAL] = "T";


export function display(layout: ILayout, pos: RoomPosition|undefined = undefined): void {
  const vis = new RoomVisual();
  const anchor = pos ? pos : layout.anchor;
  console.log("Anchor:", anchor, pos, layout.anchor);

  for (const r of _.range(9)) {
    if (layout[r] === undefined) continue;
    let buildings = layout[r].buildings;
    for (const b of buildings) {
      for (const p of b.pos) {
        const x = p.x + anchor.x;
        const y = p.y + anchor.y;
        vis.text(Display[b.type], x, y, {color: sequence[r]});
      }
    }
  }
}
