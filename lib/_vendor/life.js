var Life = function(size) {
  this.size = size;
  this.activeCells = [];
  this.zone = function(x,y) {
    return [
      {x: x - 1, y: y - 1},
      {x: x - 1, y: y + 1},
      {x: x + 1, y: y - 1},
      {x: x + 1, y: y + 1},
      {x: x, y: y + 1},
      {x: x, y: y - 1},
      {x: x + 1, y: y},
      {x: x - 1, y: y}
    ];
  }
}

Life.prototype = {
  isActive: function(x,y) {
    if (x < 0 || y < 0) {
      return false;
    } else if (x >= this.size || y >= this.size) {
      return false;
    } else {
      return true;
    }
  },

  activeZone: function(x,y,board) {
    var zone = this.zone(x,y)
      , self = this;

    zone = zone.filter(function(cell){
      return self.isActive(cell.x, cell.y);
    })

    return zone.map(function(cell){
      cell.isAlive = board[cell.x][cell.y].isAlive;
      if (!cell.isAlive) {
        board[cell.x][cell.y].aliveNeighbors += 1;
      }
      return cell;
    })
  },

  staysAlive: function(cell) {
    var cellArea = cell.zone.filter(function(neighbor){
      return neighbor.isAlive;
    });

    if (cellArea.length < 4 && cellArea.length > 1) {
      return true;
    } else {
      return false;
    }
  },

  step: function(board) {
    var activeCells = this.activeCells;
    var self = this;
    board.forEach(function(row, x){
      row.forEach(function(cell, y){
        if (cell.isAlive) {
          var activeCell = { x: x, y: y, isAlive: true };
          // zone returns all the in-bound cell locations.
          activeCell.zone = self.activeZone(x,y,board);
          activeCells.push(activeCell);
        }
      })
    })

    activeCells.forEach(function(cell){
      board[cell.x][cell.y].isAlive = self.staysAlive(cell);
    })

    this.activeCells = [];

    board.forEach(function(row,x){
      row.forEach(function(cell,y){
        if (cell.aliveNeighbors === 3) {
          board[x][y].isAlive = true;
        }

        board[x][y].aliveNeighbors = 0;
      })
    })

    return board;
  }
}

var generateSeed = function (size) {
  var board = [];

  for (var i = 0; i < size; i++) {
    var set = [];
    for (var a = 0; a < size; a++) {
      set.push({x: i, y: a, isAlive: false, aliveNeighbors: 0});
    }

    board.push(set);
  }

  return board;
}

var CellRow = React.createClass({displayName: "CellRow",
  render: function() {
    var self = this;
    var cells = this.props.row.map(function(cell){
      return (React.createElement(Cell, React.__spread({key: cell.y, addClump: self.props.addClump.bind(null, cell)},  cell)) )
    })
    return (
      React.createElement("div", {className: "cell-row"}, cells)
    )
  }
})

var Cell = React.createClass({displayName: "Cell",
  render: function() {
    var style = { backgroundColor: this.props.isAlive ? "black" : "white" };
    return (
      React.createElement("div", {onClick: this.props.addClump, className: "cell", style: style})
    )
  }
});

GameOfLife = React.createClass({displayName: "GameOfLife",
  getInitialState: function() {
    return { board: generateSeed(this.props.size) };
  },

  componentDidMount: function () {
    this.life = new Life(this.props.size);
    var interval = parseInt(this.props.size / 4);

    if (this.props.begin) {
      for (var i = 1; i < 4; i ++) {
        this.addClump({
          x: i * interval,
          y: i * interval
        })
      }
    }

    this.interval = setInterval(this.updateBoard, 100);
  },

  componentWillUnmount: function () {
    clearInterval(this.interval);
  },

  addClump: function(cell) {
    var board = this.state.board;
    var zone = this.life.activeZone(cell.x, cell.y, board);

    zone.forEach(function(c,i){
      board[c.x][c.y].isAlive = true;
    })

    this.setState({ board: board })
  },

  updateBoard: function() {
    var board = this.state.board;
    var newBoard = this.life.step(board);
    this.setState({ board: newBoard });
  },

  render: function() {
    var self = this;
    var rows = this.state.board.map(function(row, index){
      return (React.createElement(CellRow, {key: index, addClump: self.addClump, row: row}))
    })

    return (
      React.createElement("div", {className: "game-of-life"}, rows)
    )
  }
})
