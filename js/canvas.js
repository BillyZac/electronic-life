// Get a reference to the canvas for drawing
var canvas = document.querySelector('#canvas').getContext("2d")
var canvasWidth = 600
var canvasHeight = 600
var background = '#FFF'
var critterColor1 = '#222'
var critterColor2 = '#333'

document.querySelector('body').backgroundColor = background

// document.querySelector('#canvas').height = canvasHeight + 'px'
// document.querySelector('#canvas').width = canvasWidth + 'px'

function clearAll() {
  canvas.fillStyle = background
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
  for (var i = 0; i < this.size; i++) {
    canvas.fillRect(this.x, this.y, i, i);
  }
}


Square.prototype.drawRough = function() {
  function roughCircle(x, y, radius, color) {
    canvas.strokeStyle = color
    for (var i = 1; i <= 64; i++) {
      var h = radius + Math.floor(Math.random() * radius/1.3)
      var theta = i * Math.PI/32
      var a = h * Math.cos(theta)
      var b = h * Math.sin(theta)
      canvas.beginPath();
      canvas.moveTo(x, y);
      canvas.lineTo(x + a, y + b);
      canvas.stroke();
    }
  }
  roughCircle(this.x, this.y, 15, critterColor1)
  roughCircle(this.x, this.y, 5, critterColor2)
}
