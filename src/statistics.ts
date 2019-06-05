
export class Aggregate { public max: number = -Infinity; public min: number=Infinity; public count: number=0; public mean: number=0; public M2: number=0; }
export class Variance { public max: number = -Infinity; public min: number=Infinity; public mean: number=0; public variance: number=0; public sampleVariance: number=0; }

export function map(x: number, il: number, ih: number, ol: number, oh: number): number {
  return (x - il) * (oh - ol) / (ih - il) + ol;
}

export function update(existingAggregate: Aggregate, newValue: number): Aggregate {
  existingAggregate.count += 1;
  let delta = newValue - existingAggregate.mean;
  existingAggregate.mean += delta / existingAggregate.count;
  let delta2 = newValue - existingAggregate.mean;
  existingAggregate.M2 += delta * delta2;
  existingAggregate.min = Math.min(existingAggregate.min, newValue);
  existingAggregate.max = Math.max(existingAggregate.max, newValue);

  return existingAggregate;
}

export function finalize(existingAggregate: Aggregate): Variance|undefined {
  let max = existingAggregate.max;
  let min = existingAggregate.min;
  let mean = existingAggregate.mean;
  let variance = existingAggregate.M2 / existingAggregate.count;
  let sampleVariance = existingAggregate.M2 / (existingAggregate.count - 1);

  if (existingAggregate.count < 2) {
    return undefined;
  } else {
    return {max:max, min:min, mean:mean, variance:variance, sampleVariance:sampleVariance};
  }


}
