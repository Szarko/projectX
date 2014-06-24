// -=-=-=-=-=-=-=-=-=-=-
// Mitchell Tasic - DBC WEEK 6 -
// 08/05/14
// project X JS
// state: v66a
// -=-=-=-=-=-=-=-=-=-=-


// Left Hemisphere


function GridLogic(args) {
  this.minRow = 0
  this.minCol = 0
  this.maxRow = args.maxRow
  this.maxCol = args.maxCol
  this.gridState = []
  this.maxRenderSize
}

GridLogic.prototype = {
  build: function() { 
    for (var r =0; r < (this.maxRow + 1); r++) {
      this.gridState.push([])
      for (var c = 0; c < (this.maxCol + 1); c++) { 
        this.gridState[r].push(new Cell(r, c))
      }
    }
  },

  randomCell: function() {
    var randomR = Math.floor(Math.random() * this.maxRow)
    var randomC = Math.floor(Math.random() * this.maxCol)
    return this.gridState[randomR][randomC]
  },

  cellPropogation:  function(args) {
      var sortedArray = []
      var nArrays = 0
      var cellIndex = this.cellObjectIndex(args)
      if (cellIndex > 0 ) {
        sortedArray.push(args.testArray.slice(0,cellIndex))
        nArrays++
      } 
      if (cellIndex < ( args.testArray.length - 1 )) {
        sortedArray.push(args.testArray.slice((cellIndex + 1), args.testArray.length))
        nArrays++
      }
      
      for (var i = 0; i < sortedArray.length; i++) {
        var rowProximity = Math.abs(sortedArray[i][0].row - args.testArray[cellIndex].row)
        var colProximity = Math.abs(sortedArray[i][0].col - args.testArray[cellIndex].col)
        if ((rowProximity !== 0 && rowProximity !== 1) || (colProximity !== 0 && colProximity !== 1)) {
          sortedArray[i] = sortedArray[i].reverse()
        }
        sortedArray[i].splice(this.maxRenderSize,sortedArray[i].length)
      }

      return sortedArray
  },

  cellObjectIndex: function(args) {
    for (var i = 0; i < args.testArray.length; i++) {
      if (( args.testArray[i].row == args.cellData.row ) && ( args.testArray[i].col == args.cellData.col )) {
        return i
      }
    }
  },

  cellRow: function(args) {
    return this.gridState[args.row]
  },

  cellCol: function(args) {
    var tempCellCol = []
    for(var i = 0; i < this.gridState.length; i++) {
      tempCellCol.push(this.gridState[i][args.col])
    }
    return tempCellCol
  },


  cellDiagonals: function(lineArray, cellPoint) {
    var diagonalArray = []
    for (var i = 0; i < lineArray.length; i ++) {
      diagonalArray.push([])
      for (var k = 0; k < lineArray[i].length; k++) {
        if (( lineArray[i][k].row === cellPoint.row ) && ( lineArray[i][k].col < cellPoint.col )) {
          var newRow = lineArray[i][k].row + ( k + 1 )
          var newCol = lineArray[i][k].col
          if (this.validCell(newRow,newCol)) {
            var newCell = new Cell(newRow, newCol)
            diagonalArray[i].push(newCell)
          }
        }
        else if (( lineArray[i][k].row > cellPoint.row ) && ( lineArray[i][k].col === cellPoint.col )) {
          var newRow = lineArray[i][k].row
          var newCol = lineArray[i][k].col + ( k + 1 )
          if (this.validCell(newRow,newCol)) {
            var newCell = new Cell(newRow, newCol)
            diagonalArray[i].push(newCell)
          }   
        }
        else if (( lineArray[i][k].row === cellPoint.row ) && ( lineArray[i][k].col > cellPoint.col )) {
          var newRow = lineArray[i][k].row - ( k + 1 )
          var newCol = lineArray[i][k].col
          if (this.validCell(newRow,newCol)) {
            var newCell = new Cell(newRow, newCol)
            diagonalArray[i].push(newCell)
          }   
        }
        else if (( lineArray[i][k].row < cellPoint.row ) && ( lineArray[i][k].col === cellPoint.col )) {
          var newRow = lineArray[i][k].row 
          var newCol = lineArray[i][k].col - ( k + 1)
          if (this.validCell(newRow,newCol)) {
            var newCell = new Cell(newRow, newCol)
            diagonalArray[i].push(newCell)
          }
        }
      }
    }
    return diagonalArray
  },

  validCell: function(row,col) {
    if ((row >= this.minRow ) && (row <= this.maxRow) && (col >= this.minCol) && (col <= this.maxCol)) {
      return true
    }
    else {
      return false
    }
  }

}

function Cell(row,col) {
  this.row = row
  this.col = col
}

function Sequence(sequenceData) {
  this.sequenceArray = sequenceData.sequenceArray
  this.sequenceColor = sequenceData.sequenceColor
}