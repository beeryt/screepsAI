export interface IKey {
  readonly id: number|string;
}

export class ObjectMap<K extends IKey, V> {
  private map = new Map<number|string, V>();
  private keyMap = new Map<number|string, K>();

  public constructor() {
  }

  public clear(): void { this.map.clear(); }

  public delete(key: K): boolean { return this.map.delete(key.id); }

  public forEach(callbackfn: (value: V, key: K, map: ObjectMap<K, V>) => void, thisArg?: any): void {
    this.map.forEach((v, k): void => {
      let _k = this.keyMap.get(k);
      if (_k === undefined) throw new Error("Key was not in ObjectMap");
      callbackfn(v,_k,this);
    }, thisArg);
  }

  public get(key: K): V | undefined { return this.map.get(key.id); }

  public has(key: K): boolean { return this.map.has(key.id); }

  public set(key: K, value: V): this {
    this.keyMap.set(key.id, key);
    this.map.set(key.id, value);
    return this;
  }

  public get size(): number { return this.map.size; }

  /** Returns an iterable of entries in the map. */
  public *[Symbol.iterator](): IterableIterator<[K, V]> {
    for (let key of this.map.keys()) {
      let k = this.keyMap.get(key);
      if (k === undefined) throw new Error("No key");
      let v = this.map.get(key);
      if (v === undefined) throw new Error("No value");
      yield [k,v];
    }
  }

  /** Returns an iterable of key, value pairs for every entry in the map */
  public *entries(): IterableIterator<[K, V]> {
    for (let kv of this) {
      yield kv;
    }
  }

  /** Returns an iterable of keyMap in the map */
  public keys(): IterableIterator<K> {
    return this.keyMap.values();
  }

  /** Returns an iterable of values in the map */
  public values(): IterableIterator<V> {
    return this.map.values();
  }
}
