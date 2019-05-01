var Mine = require("Mine");

class Colony
{
  constructor(room)
  {
    this.room = room;
    this.controller = room.controller;
    this.pos = this.controller.pos;
    this.mines = [];
  }

  init()
  {
    console.log("Colony::init()");

    console.log("Debug: adding first source");
    this.mines.push(new Mine(this, _.first(this.room.find(FIND_SOURCES))));

    this.mines.forEach(function(mine) {
      mine.init();
    });
  }

  refresh()
  {
    console.log("Colony::refresh()");

    this.mines.forEach((mine) => {
      mine.refresh();
    });
  }

  update()
  {
    console.log("Colony::update()");

    this.mines.forEach((mine) => {
      mine.update();
    });
  }

  search()
  {
    class SimpleGraph {
      constructor()
      {
        this.edges = {};
      }

      neighbors(id) {
        return this.edges[id];
      }
    }

    class Queue
    {
      constructor()
      {
        this.items = [];
      }
      enqueue(element)
      {
        this.items.push(element);
      }
      dequeue()
      {
        if (this.isEmpty())
        {
          return "Underflow";
        }
        return this.items.shift();
      }
      front()
      {
        if (this.isEmpty())
        {
          return "No elements in Queue";
        }
        return this.items[0];
      }
      isEmpty()
      {
        return this.items.length == 0;
      }
      printQueue()
      {
        let str = "";
        for (let i = 0; i < this.items.length; ++i)
        {
          str += this.items[i] + " ";
        }
        return str;
      }
    }

    function breadth_first_search_1(graph, start)
    {
      let frontier = new Queue()
      frontier.enqueue(start)
      let visited = {}
      visited[start] = true

      while (!frontier.isEmpty())
      {
        let current = frontier.dequeue();
//        console.log("visiting", current);
        graph.neighbors(current).forEach(next => {
          if (!(next in visited))
          {
            frontier.enqueue(next)
            visited[next] = true;
          }
        });
      }
    }

    let example_graph = new SimpleGraph()
    example_graph.edges = {
      'A': ['B'],
      'B': ['A', 'C', 'D'],
      'C': ['A'],
      'D': ['E', 'A'],
      'E': ['B']
    }

    breadth_first_search_1(example_graph, 'A');
  }

  run()
  {
    console.log("Colony::run()");

    this.mines.forEach((mine) => {
      mine.run();
    });

    // find center of mass
    let sumX = 0;
    let sumY = 0;
    let mass = 0;
    this.room.find(FIND_SOURCES).forEach((source) => {
      sumX += source.pos.x * source.energyCapacity;
      sumY += source.pos.y * source.energyCapacity;
      mass += source.energyCapacity;
    });

    let pos = this.room.getPositionAt(sumX / mass, sumY / mass);
    console.log(pos);
    this.room.visual.circle(pos, {radius: .33});

    this.room.find(FIND_SOURCES).forEach((source) => {
      this.search();
    });

    function apple(roomName)
    {
      console.log("roomCallback(",roomName,")");
    }

    function banana(roomName, costMatrix)
    {
      console.log("costCallback(",roomName,")");
      for (let i = 0; i < 50*50; ++i)
      {
        let x = Math.floor(i / 50);
        let y = i % 50;
        this.room.visual.text(costMatrix.get(x,y), this.room.getPositionAt(x,y));
      }
    }

    PathFinder.search(this.pos, {pos: pos}, {roomCallback: apple});
    this.room.findPath(this.pos, pos, {costCallback: banana});
  }

  visuals()
  {

  }
}

module.exports = Colony;
