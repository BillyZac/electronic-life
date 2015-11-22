var plan =
['############################',
 '#      #    #      o      ##',
 '#                          #',
 '#          #####           #',
 '##         #   #    ##     #',
 '###           ##     #     #',
 '#           ###      #     #',
 '#   ####                   #',
 '#   ##       o             #',
 '# o  #         o       ### #',
 '#    #                     #',
 '############################']

function Vector(x, y) {
 this.x = x
 this.y = y
}
Vector.prototype.plus = function(other) {
 return new Vector(this.x + other.x, this.y + other.y)
}

// (x, y) is found at x + (y * width)
/* Testing this idea:
var grid = ['top left',     'top middle',     'top right',
            'bottom left',  'bottom middle',  'bottom right']
console.log(grid[2 + (1 * 3)])
// bottom right
function who(x, y) {
  return grid[x + (y * 3)]
}
console.log('Expect bottom right:', who(2, 1))
console.log(who(0, 0), 'is at (0, 0)')
console.log(who(2, 1), 'is at (2, 1)')
console.log(who(1, 0), 'is at (1, 0)')
*/


function Grid(width, height) {
 this.space = new Array(width * height)
 this.width = width
 this.height = height
}
Grid.prototype.isInside = function(vector) {
 return vector.x >= 0 && vector.x < this.width &&
        vector.y >= 0 && vector.y < this.height
}
Grid.prototype.get = function(vector) {
  // (x, y) is found at x + (y * width)
  return this.space[vector.x + this.width * vector.y]
}
Grid.prototype.set = function(vector, value) {
 this.space[vector.x + this.width * vector.y] = value
}


var grid = new Grid(5, 5)
console.log(grid.get(new Vector(1, 1)))
// undefined
grid.set(new Vector(1, 1), 'X')
console.log(grid.get(new Vector(1, 1)))
// X
