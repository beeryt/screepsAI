import test from 'ava';
import { Graph } from "../src/algorithms/Graph";

class V {
  private _id: number;
  public get id(): number { return this._id; }
  public constructor(id: number) { this._id = id; }
}

test("constructor", (t): void => {
  const G = new Graph<V>();
  t.deepEqual(G, new Graph<V>());
});
