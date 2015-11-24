// Get a reference to the canvas for drawing
var canvas = document.querySelector('#canvas').getContext("2d")
var canvasWidth = 600
var canvasHeight = 600

// document.querySelector('#canvas').height = canvasHeight + 'px'
// document.querySelector('#canvas').width = canvasWidth + 'px'

function clearAll() {
  canvas.fillStyle = 'white'
  canvas.beginPath()
  canvas.fillRect(0, 0, canvasWidth, canvasHeight)
}

// Square constructor
function Square(x, y, size, color) {
  this.x = x
  this.y = y
  this.size = size
  this.color = color
}

Square.prototype.draw = function() {
  canvas.fillStyle = this.color;
  canvas.beginPath();
  canvas.fillRect(this.x, this.y, this.size, this.size);
}
