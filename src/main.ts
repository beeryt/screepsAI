import { dijkstra, Graph} from "./algorithms/dijkstra";

class AdjacencyList implements Iterable<number>
{
  data: number[][] = [];

  constructor()
  {
    // for (let i = 0; i < 3; ++i)
    // {
    //   this.data[i] = [];
    //   for (let j = 0; j < 3; ++j)
    //   {
    //     if (i === j) continue;
    //     this.data[i].push(j);
    //   }
    // }
  }

  link(i:number,j:number)
  {
    if (i < 0 || i >= this.data.length) return;
    if (j < 0 || j >= this.data.length) return;
    if (!this.data[i].includes(j))
    {
      this.data[i].push(j);
    }
  }

  print()
  {
    for (let i = 0; i < this.data.length; ++i)
    {K extends number>
      let str = i + ': [';
      let J = this.data[i].length - 1;
      for (let j = 0; j < J; ++j)
      {
        str += this.data[i][j] + ',';
      }
      str += this.data[i][J] + ']';
      console.log(str);
    }
  }

  *[Symbol.iterator](): Iterator<number>
  {
    for (let i = 0; i < this.data.length; ++i)
    {
      for (let j = 0; j < this.data[i].length; ++j)
      {
        yield this.data[i][j];
      }
    }
  }
}

let Al = new AdjacencyList();
Al.print();
Al.link(0,1);
Al.link(0,2);
Al.print();

class _AdjacencyList<K extends number>// implements Iterable<K|undefined>
{
  data: K[][];
  constructor()
  {
    this.data = [];
    for (let i = 0; i < 5; ++i)
    {
      this.data[i] = [];
      for (let j = 0; j = 2; ++j)
      {
        this.data[i].push(j as K);
      }
    }
  }

  *next()
  {
    for (let i = 0; i < this.data.length; ++i)
    {
      for (let j = 0; j < this.data[i].length; ++j)
      {
        yield { done:false, value:this.data[i][j] };
      }
    }
    yield {done:true, value:undefined};
  }

  [Symbol.iterator](): IterableIterator<{ done: boolean, value: K|undefined }>
  {
    return this.next();
  }
}

// let al:AdjacencyList<number> = new AdjacencyList<number>();
// for (let bl of al)
// {
//   console.log(bl);
// }

class _Graph implements Graph<number,[number,number]>
{
  vertices: number[] = [];
  edges: [number,number][] = [];
  private adjacency: number[][] = [];
  constructor(n:number)
  {
    for (let i = 0; i < n; ++i)
    {
      this.vertices.push(Infinity);
      if (i - 1 < 0) continue;
      this.edges.push([i-1,i]);
      this.edges.push([i,i-1]);
      if (this.adjacency[i] === undefined) this.adjacency[i] = [];
      if (this.adjacency[i-1] === undefined) this.adjacency[i-1] = [];
      this.adjacency[i].push(i-1);
      this.adjacency[i-1].push(i);
    }
  }
  neighbors(v:number): number[]
  {
    return this.adjacency[v];
  }
  weight(v:number, u:number): number
  {
    return this.adjacency[v][u];
  }
}

// let g:_Graph = new _Graph(9);
//
// for (let v of g.vertices) console.log(v);
// for (let e of g.edges) console.log(e);
