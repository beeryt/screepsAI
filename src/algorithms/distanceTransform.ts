function neighbors(dist: CostMatrix, x: number, y: number, dirs: DirectionConstant[]): number[] {
  let n: number[] = [];
  for (let d of dirs) {
    switch (d) {
      case TOP_LEFT: n.push(dist.get(x-1,y-1)); break;
      case TOP: n.push(dist.get(x,y-1)); break;
      case TOP_RIGHT: n.push(dist.get(x+1,y-1)); break;
      case RIGHT: n.push(dist.get(x+1,y)); break;
      case BOTTOM_RIGHT: n.push(dist.get(x+1,y+1)); break;
      case BOTTOM: n.push(dist.get(x,y+1)); break;
      case BOTTOM_LEFT: n.push(dist.get(x-1,y+1)); break;
      case LEFT: n.push(dist.get(x-1,y)); break;
    }
  }
  return n;
}

export function distanceTransform(foreground: CostMatrix): CostMatrix {
  const dist = foreground;

  // forward pass
  for (let x of _.range(50)) {
    for (let y of _.range(50)) {
      if (foreground.get(x,y) === 0) continue;
      let value = _.min(neighbors(dist,x,y, [BOTTOM_LEFT, LEFT, TOP_LEFT, TOP]));
      dist.set(x,y, value + 1);
    }
  }

  // backward pass
  for (let x of _.range(50).reverse()) {
    for (let y of _.range(50).reverse()) {
      let value = _.min(neighbors(dist,x,y, [TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM]));
      dist.set(x,y, Math.min(dist.get(x,y), value + 1));
    }
  }

  return dist;
}

// Compute a cost matrix for walkable pixels in a room
export function walkablePixelsForRoom(roomName: string): CostMatrix {
  const costMatrix = new PathFinder.CostMatrix();
  const terrain = Game.map.getRoomTerrain(roomName);
  for (let y = 0; y < 50; ++y) {
    for (let x = 0; x < 50; ++x) {
      if (terrain.get(x, y) != TERRAIN_MASK_WALL) {
        costMatrix.set(x, y, 1);
      }
    }
  }
  return costMatrix;
}

export class Aggregate { public count: number=0; public mean: number=0; public M2: number=0; }
export class Variance { public mean: number=0; public variance: number=0; public sampleVariance: number=0; }

export function update(existingAggregate: Aggregate, newValue: number): Aggregate {
  existingAggregate.count += 1;
  let delta = newValue - existingAggregate.mean;
  existingAggregate.mean += delta / existingAggregate.count;
  let delta2 = newValue - existingAggregate.mean;
  existingAggregate.M2 += delta * delta2;

  return existingAggregate;
}

export function finalize(existingAggregate: Aggregate): Variance|undefined {
  let mean = existingAggregate.mean;
  let variance = existingAggregate.M2 / existingAggregate.count;
  let sampleVariance = existingAggregate.M2 / (existingAggregate.count - 1);

  if (existingAggregate.count < 2) {
    return undefined;
  } else {
    return {mean:mean, variance:variance, sampleVariance:sampleVariance};
  }


}

// Visualize a given costMatrix globally
export function displayCostMatrix(costMatrix: CostMatrix, color = '#fff000'): void {
  const vis = new RoomVisual();

  let ag = new Aggregate();

  const samples: number[] = [];
  let max = -Infinity;
  let min = Infinity;
  for (let y = 0; y < 50; ++y) {
    for (let x = 0; x < 50; ++x) {
      const v = costMatrix.get(x, y);
      samples.push(v);
      ag = update(ag, v);
      max = Math.max(max, v);
      min = Math.min(min, v);
    }
  }

  let vari = finalize(ag);
  if (vari === undefined) throw new Error("srsly?!");

  console.log("Costmatrix:", costMatrix, "Max:", max, "Min:", min);
  console.log("\tμ:", vari.mean, "σ²:", vari.variance, "σ²:", vari.sampleVariance);

  for (let y = 0; y < 50; ++y) {
    for (let x = 0; x < 50; ++x) {
      const value = costMatrix.get(x, y);
      if (value > 0) {
        vis.circle(x, y, {radius: costMatrix.get(x, y) / max / 2, fill: color});
      }
    }
  }
}

export function testDistanceTransform(roomName = 'sim'): void {
  const dt = distanceTransform(walkablePixelsForRoom(roomName));
  displayCostMatrix(dt);
}
