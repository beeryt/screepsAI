import { OMap, IKey } from "./OMap";

export class AdjacencyList<V extends IKey> implements Iterable<[V, V]> {
  public data = new OMap<V, OMap<V, number>>();

  public [Symbol.toStringTag] = "AdjacencyList";

  public link(v: V, u: V, w: number = 1, directed: boolean = false): void {
    if (!this.data.has(v)) this.data.set(v, new OMap<V, number>());
    this.data.get(v)!.set(u,w);

    if (!directed) {
      if (!this.data.has(u)) this.data.set(u, new OMap<V, number>());
      this.data.get(u)!.set(v,w);
    }
  }

  public *[Symbol.iterator](): Iterator<[V, V]> {
    for (const u of this.data.keys()) {
      for (const v of this.data.get(u)!.keys()) {
        const urp = new RoomPosition(0,0,'sim');
        const vrp = urp;
        yield [urp as unknown as V, vrp as unknown as V];
      }
    }
  }
}
