// -=-=-=-=-=-=-=-=-=-=-
// Mitchell Tasic - DBC WEEK 6 -
// 08/05/14
// project X JS 
// state: v66a
// -=-=-=-=-=-=-=-=-=-=-

// -= The Brain =-

function Controller(args) {
  this.display = args.renderer
  this.grid = args.gridBuilder
  this.globalEventSequence = []
}

Controller.prototype = {

  setListeners: function() {
    $('body').on('click', '#grid .cell', this.initAnimation.bind(this))
    $("input#sequence-x").on("click", this.initGlobalSequence.bind(this))
    $("input#destroy-x").on("click", this.sequenceDestroy.bind(this)) 
    $("input#random-x").on("click", this.randomXgenerate.bind(this))
  },

  initiate: function() {
    this.display.renderGrid()
    this.grid.build()
  },

  initAnimation: function(e) {
    var styleType = $("#render-style option:selected").val()
    this.sequenceArray = []
    var cellPoint = { row: Number(e.target.dataset.row), col: Number(e.target.dataset.col) }
    var xSelectedColor = Number($('#x-color option:selected').val())
    var ySelectedColor = Number($('#y-color option:selected').val())
    var renderSize = Number($('#render-size option:selected').val())
    this.grid.maxRenderSize = renderSize 
    if (styleType === "letterX") {
      this.renderDiagonals(cellPoint,xSelectedColor,ySelectedColor)
    }
    else if (styleType === "cross") {
      this.renderCross(cellPoint,xSelectedColor,ySelectedColor)
    }   
  },

  renderCross: function(cellPoint,xSelectedColor,ySelectedColor) {
    var sequenceData = this.generateSequenceData({ xColor: xSelectedColor, yColor: ySelectedColor, cPoint: cellPoint })
    var sArrayClone = jQuery.extend(true, [], sequenceData)
    this.globalEventSequence.push(sArrayClone)
    this.initExpansion(sequenceData, "expand")  
  },

  renderDiagonals: function(cellPoint,xSelectedColor,ySelectedColor) {
    var sequenceData = this.generateXsequenceData({ xColor: xSelectedColor, yColor: ySelectedColor, cPoint: cellPoint })
    var sArrayClone = jQuery.extend(true, [], sequenceData)
    this.globalEventSequence.push(sArrayClone)
    this.initExpansion(sequenceData, "expand")   
  },

  gatherCellPropogationData: function(initialCellPoint) {
    var cellRow = this.grid.cellRow(initialCellPoint)
    var cellCol = this.grid.cellCol(initialCellPoint)
    var xS = this.grid.cellPropogation({ testArray: cellRow, cellData: initialCellPoint })
    var yS = this.grid.cellPropogation({ testArray: cellCol, cellData: initialCellPoint })
    return { xPropData: xS, yPropData: yS }
  },

  generateXsequenceData: function(sData) {
    var propData = this.gatherCellPropogationData(sData.cPoint)
    var xDiagonal = this.grid.cellDiagonals(propData.xPropData, sData.cPoint)
    var yDiagonal = this.grid.cellDiagonals(propData.yPropData, sData.cPoint)
    var xData = new Sequence({ sequenceArray: xDiagonal, sequenceColor: sData.xColor})
    var yData = new Sequence({ sequenceArray: yDiagonal, sequenceColor: sData.yColor})
    return [xData,yData]
  },

  generateSequenceData: function(sData) {
    var propData = this.gatherCellPropogationData(sData.cPoint)
    var xData = new Sequence({ sequenceArray: propData.xPropData, sequenceColor: sData.xColor})
    var yData = new Sequence({ sequenceArray: propData.yPropData, sequenceColor: sData.yColor})
    return [xData,yData]
  },

  initExpansion: function(sArgs, state) {
    for (var i = 0; i < sArgs.length; i++) {
      this.renderCellAnimation(sArgs[i], state)   
    }

    setTimeout(function(){
      this.initRetraction(sArgs,"retract")
    }.bind(this,sArgs), 800)
  },

  initRetraction: function(sArgs, state) {
    for (var i = 0; i < sArgs.length; i++) {
      this.renderCellAnimation(sArgs[i], "retract")   
    }
  },

  initGlobalSequence: function() {
    this.renderSequence(this.globalEventSequence, 0)
  },

  renderCellAnimation: function(cellsArray,state) {
    for (var i = 0; i < cellsArray.sequenceArray.length; i++) {
      if (state === "expand") {
        var rowRenderData = { cellArray: cellsArray.sequenceArray[i], rIndex: 0, sColor: cellsArray.sequenceColor }
        this.alterCell(rowRenderData)
      }
      else if (state === "retract") {   
        var reversedArray = jQuery.extend([], cellsArray.sequenceArray[i].slice().reverse())
        var rowRenderData = { cellArray: reversedArray, rIndex: 0, sColor: 0 }
        this.alterCell(rowRenderData)      
      }
    }   
  },

  renderSequence: function(sequence, rIndex) { 
    function initRender() { 
      if (rIndex < sequence.length) {
        this.initExpansion(sequence[rIndex], "expand")
        rIndex++
        setTimeout(this.renderSequence(sequence, rIndex), 250)
      }
    }
    setTimeout(initRender.bind(this), 2000)
  }, 


  alterCell: function(args) {
    function applyEffect() {
      if (args.rIndex < args.cellArray.length) {
        this.display.setColor(args.cellArray[args.rIndex], args.sColor) 
        args.rIndex++
        setTimeout(this.alterCell(args), 100)
      }
    }
    setTimeout(applyEffect.bind(this), 100)
  },

  randomXgenerate: function() {
    var globalXSequence = []
    var randomSequenceCount = Math.floor(Math.random() * 15) + 5
    for (var i = 0; i < randomSequenceCount; i++) {
      var renderSize = Math.floor(Math.random() * 4) + 4
      this.grid.maxRenderSize = renderSize
      var randomCell = this.grid.randomCell()
      var randomXcolor = Math.floor(Math.random() * 6) + 1
      var randomYcolor = Math.floor(Math.random() * 6) + 1
      var randomStyleType = this.randomStyle()
      if (randomStyleType === "letterX") {
        var randomSdata = this.generateXsequenceData({ xColor: randomXcolor, yColor: randomYcolor, cPoint: randomCell }) 
      }
      else if (randomStyleType === "cross") {
        var randomSdata = this.generateSequenceData({ xColor: randomXcolor, yColor: randomYcolor, cPoint: randomCell }) 
      }      
      var sArrayClone = jQuery.extend(true, [], randomSdata)
      globalXSequence.push(sArrayClone)
    }
    this.renderSequence(globalXSequence, 0)   
  },

  gridDestroy: function() {  
    this.display.clearGrid()
  },

  sequenceDestroy: function() {
    this.globalEventSequence = []
    this.display.clearGrid()
  },

  randomStyle: function() {
    var randomStyleValue = Math.floor(Math.random() * 2)
    if (randomStyleValue === 0) {
      return "cross"
    }
    else if (randomStyleValue === 1) {
      return "letterX"
    }
  }
}



$(document).ready(function() {
  var renderArgs = {grid: "#grid", container: "#container", cell: ".cell", maxRow: 19, maxCol: 39}
  var gameLogicArgs = {maxRow: 19, maxCol: 39}
  var render = new Display(renderArgs)
  var grid = new GridLogic(gameLogicArgs)
  var controllerArgs = {renderer: render, gridBuilder: grid}
  var controller = new Controller(controllerArgs)
  controller.setListeners()
  controller.initiate()
  
})
