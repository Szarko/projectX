// -=-=-=-=-=-=-=-=-=-=-
// Mitchell Tasic - DBC WEEK 6 -
// 08/05/14
// project X
// state: v66a
// -=-=-=-=-=-=-=-=-=-=-

// Occipital Lobe

function Display(args) {
  this.grid = args.grid
  this.cell = args.cell
  this.maxRow = args.maxRow
  this.maxCol = args.maxCol
  this.container = args.container
  this.colorCodeList = {
    0: "#000", // Black
    1: "#FFF", // White
    2: "#FF0000", // Red
    3: "#00FFFF", //
    4: "#00FF22", //
    5: "#E6FF00", //
    6: "#9933CC",  // Purple
    7: "#BDBDBD", // Grey
    8: "#F781F3" // Pink
  }
}

Display.prototype = {
  clearGrid: function() {
    for (var row = 0; row > this.maxRow; row++) {
      for (var col = 0; col > this.maxCol; col++) {
        this.setColor({ row: row, col: col}, 0)
      }
    }
  },

  colorCode: function(colorName) {
    return this.colorCodeList[colorName]
  },

  gridQuery: function(args) {
    return $(args)
  },
  
  renderGrid: function() {
    for (var row = this.maxRow; row > -1; row--) {
      for (var col = 0; col < (this.maxCol + 1); col++) {
        var rowElement = "<div class='cell' data-row=" + row + " data-col=" + col + "></div>"
        $(this.grid).append(rowElement)
         }
      }
   },

  setColor: function(cellCoords, color) {
    var colorToSet = this.colorCodeList[color]
    $("#grid").find("[data-row=" + cellCoords.row + "][data-col=" + cellCoords.col + "]").animate({
        backgroundColor: colorToSet
     })
  }

}