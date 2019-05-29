
/**
 * Key interface which provides an [[IKey.id]] property which allows
 * for `sameValueZero` comparison as a primitive.
 */
export interface IKey {
  /** Each [[id]] should be unique and comparable using `sameValueZero`. */
  readonly id: number|string;
}

/**
 * A [[OMap]] object iterates its elements in insertion order — a `for...of`
 * loop returns an array of `[key, value]` pairs for each iteration.
 *
 * ### Key equality
 * Key equality is based on the [[IKey.id]] property using the `sameValueZero` algorithm.
 *
 * ### Objects and maps compared
 * [[OMap]] is similar to `Map` in that both are maps of `[key, value]` pairs.
 * However the OMap requires each key implement [[IKey]] with [[IKey.id]] being
 * used for key equality described above.
 *
 * @Summary Class representing a Map with Objects as keys
 *
 * @typeparam K   Key object for the [[OMap]].
 * @typeparam V   Value object for the [[OMap]].
 */
export class OMap<K extends IKey, V> {
  private map = new Map<number|string, V>();
  private keyMap = new Map<number|string, K>();

  public constructor() {
  }

  /**
   * The [[size]] accessor property returns the number of elements in a [[OMap]] object.
   *
   * The value of `size` is an integer representing how many entries the [[OMap]] object has.
   * A set accessor function for size is `undefined`; you can not change this property.
   */
  public get size(): number { return this.map.size; }

  /** The `OMap[@@toStringTag]` property has an initial value of "OMap". */
  public get [Symbol.toStringTag](): string { return "OMap"; }

  /**
   * Removes all elements from an [[OMap]] object.
   */
  public clear(): void { this.map.clear(); }

  /**
   * Removes the specified element from an [[OMap]] object.
   * @param key The key of the element to be deleted.
   * @return    `true` if an element in the [[OMap]] object existed and has been removed, or `false` if the element does not exist.
   */
  public delete(key: K): boolean { return this.map.delete(key.id); }

  /**
   * Returns a new _iterator_ object that contains the `[key, value]` pairs for each element in the [[OMap]] object in insertion order.
   *
   * @returns   A new [[OMap]] _iterator_ object.
   */
  public *entries(): IterableIterator<[K, V]> {
    for (let key of this.map.keys()) {
      let k = this.keyMap.get(key);
      if (k === undefined) throw new Error("No key");
      let v = this.map.get(key);
      if (v === undefined) throw new Error("No value");
      yield [k,v];
    }
  }

  /**
   * Executes a provided function once per each key/value pair in the [[OMap]] object, in insertion order.
   * @param callback  Function to execute for each element.
   * @param thisArg   Value to use as this when executing callback.
   */
  public forEach(callback: (value: V, key: K, map: OMap<K, V>) => void, thisArg?: any): void {
    this.map.forEach((v, k): void => {
      let _k = this.keyMap.get(k);
      if (_k === undefined) throw new Error("Key was not in OMap");
      callback(v,_k,this);
    }, thisArg);
  }

  /**
   * Returns a specified element from an [[OMap]] object.
   * @param key The key of the element to return from the [[OMap]] object.
   * @return    The element associated with the specified key, or undefined if the key can't be found in the [[OMap]] object.
   */
  public get(key: K): V | undefined { return this.map.get(key.id); }

  /**
   * Returns a boolean indicating whether an element with the specified key exists or not.
   * @param key The key of the element to test for presence in the [[OMap]] object.
   * @returns   `true` if an element with the specified key exists in the [[OMap]] object; otherwise `false`.
   */
  public has(key: K): boolean { return this.map.has(key.id); }

  /**
   * Adds or updates an element with a specified key and a value to an [[OMap]] object.
   * @param key   The key of the element to add to the [[OMap]] object.
   * @param value The value of the element to add to the [[OMap]] object.
   * @return      The [[OMap]] object.
   */
  public set(key: K, value: V): this {
    this.keyMap.set(key.id, key);
    this.map.set(key.id, value);
    return this;
  }

  /**
   * Returns a new _iterator_ object that contains the keys for each element in the [[OMap]] object in insertion order.
   * @returns   A new [[OMap]] _iterator_ object.
   */
  public keys(): IterableIterator<K> {
    return this.keyMap.values();
  }

  /**
   * Returns a new _iterator_ object that contains the values for each element in the [[OMap]] object in insertion order.
   * @returns   A new [[OMap]] _iterator_ object.
   */
  public values(): IterableIterator<V> {
    return this.map.values();
  }

  /**
   * The initial value of the `@@iterator` property is the same function object as the initial value of the [[entries]] method.
   * @returns   The map _iterator_ function, which is the entries() function by default.
   */
  public *[Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }
}
