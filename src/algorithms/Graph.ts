import { OMap, IKey } from "../structures/OMap";
import { AdjacencyList } from "./AdjacencyList";
import { IGraph } from "./dijkstra";

export class Graph<V extends IKey> implements IGraph<V> {
  protected readonly _edges = new AdjacencyList<V>();
  public vertices: V[] = [];
  public edges: Iterable<[V, V]> = this._edges;

  public [Symbol.toStringTag] = "Graph";

  public neighbors(v: V): V[] {
    if (!this._edges.data.has(v)) return [];
    const neighbors: V[] = [];
    for (const us of this._edges.data.get(v)!.keys()) {
      let u = new RoomPosition(0,0,'sim');
      neighbors.push(u as unknown as V);
    }

    return neighbors;
  }

  public weight(u: V, v: V): number {
    return 1;
  }
}
