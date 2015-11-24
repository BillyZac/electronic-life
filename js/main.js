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


// $('main').text('############################')

function Vector(x, y) {
  this.x = x
  this.y = y
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y)
}

// Representing space

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
  return this.space[vector.x + this.width * vector.y]
}
Grid.prototype.set = function(vector, value) {
  this.space[vector.x + this.width * vector.y] = value
}
/* Grid test */
console.log('=== Grid test ===')
var grid = new Grid(5, 5)
console.log(grid.get(new Vector(1, 1)))
grid.set(new Vector(1, 1), 'x')
console.log(grid.get(new Vector(1, 1)))
console.log('=================')

var exampleAction = {
  type: 'move',
  direction: 'describe_the_direction_somehow'
}

var exampleCritter = {
  act: function(view) {
    return someAction
  }
}

var exampleView = {
  /* Allows critter to inspect its surroundings */
  direction: 'n',
  look: function(direction) {
    return 'a_char_in_that_direction'
  },
  find: function(char) {
    return 'direction char (such as open space) can be found'
  },
  findAll: function(char) {
    return 'array_of_directions_char_can_be_found'
  }
}

/* Map from direction names to coordinate offsets */
var directions = {
  'n':  new Vector( 0, -1),
  'ne': new Vector( 1, -1),
  'e':  new Vector( 1,  0),
  'se': new Vector( 1,  1),
  's':  new Vector( 0,  1),
  'sw': new Vector(-1,  1),
  'w':  new Vector(-1,  0),
  'nw': new Vector(-1, -1)
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

var directionNames = 'n ne e se s sw w nw'.split(' ')

function BouncingCritter() {
  this.direction = randomElement(directionNames)
}

BouncingCritter.prototype.act = function(view) {
  if (view.look(this.direction) != ' ')
    this.direction = view.find(' ') || 's'
  return {type: 'move', direction: this.direction}
}

console.log('=== Critter test ===')
var bouncy = new BouncingCritter()
console.log(bouncy)
console.log(bouncy.act(exampleView))
console.log('====================')

/* The World Object */
function elementFromChar(legend, ch) {
  if (ch == ' ')
    return null
  /* Look up the character's constructor and use it to instantiate a new element.
     This is what we're returning. */
  var element = new legend[ch]()
  /* Add this property to make it easy to look up the original character.
     Will use this when converting the world to a string */
  element.originChar = ch
  return element
}

/* This throws an error, because legend[ch]() is not a function */
// console.log(elementFromChar({'#': 'wall'}, '#'))

function World(map, legend) {
  var grid = new Grid(map[0].length, map.length)
  /* Create a local variable, grid,
     through which the inner function, map.forEach(), gets access to the grid */
  this.grid = grid
  this.legend = legend

  map.forEach(function(line, y) {
    for (var x = 0; x < line.length; x++)
      grid.set(new Vector(x, y),
               elementFromChar(legend, line[x]))
  })
}

function charFromElement(element) {
  if (element == null)
    return ' '
  else
      return element.originChar
}

World.prototype.toString = function() {
  var output = ''
  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get(new Vector(x, y))
      output += charFromElement(element)
    }
    output += '\n'
  }
  return output
}

// The wall constructor
function Wall() {}

var world = new World(plan,
                      {'#': Wall,
                       'o': BouncingCritter})
console.log('=== World test ===')
console.log(world.toString())
console.log('==================')

/* this and Its Scope */
var test = {
  prop: 10,
  addPropTo: function(array) {
    return array.map(function(elt){return this.prop + elt}.bind(this))
  }
}
console.log('=== this bind test ===')
console.log(test.addPropTo([5, 6, 7]))
console.log('======================')

Grid.prototype.forEach = function(f, context) {
  for (y = 0; y < this.height; y++) {
    for (x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width]
      if (value != null)
        f.call(context, value, new Vector(x, y))
    }
  }
}

// 1. Go over the grid
// 2. Look for objects (critters) with an .act method
// 3. Ignore critters that have already acted
// 4. Call .act on the critter
// 5. Put the critter in the
World.prototype.turn = function() {
  var acted = []
  this.grid.forEach(function(critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter)
      this.letAct(critter, vector)
    }
  }, this)
}

World.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector))
  // If action exists, and if the action is 'move', go ahead. Otherwise, do nothing.
  // We're ignoring nonsense input, such as unrecognized actions
  // and poorly implemented critters.
  // Note: the View knows about the world and the critter's position
  if (action && action.type == 'move') {
    // Figure out what the critter's destination is
    var dest = this.checkDestination(action, vector)
    // If the destination is valid and if it's empty
    if (dest && this.grid.get(dest) == null) {
      // Set the current position to empty
      this.grid.set(vector, null)
      // Put the critter in the new spot
      this.grid.set(dest, critter)
    }
  }
}

World.prototype.checkDestination = function(action, vector) {
  // If the direction in the action param is in our list of directions...
  if (directions.hasOwnProperty(action.direction)) {
    // Use the directions array, defined earlier, to find the coordinate offset
    // for the given direction.
    // Add this offset to the critter's current position to find the destination.
    var dest = vector.plus(directions[action.direction])
    // If the destination is inside the grid, return the destination
    if (this.grid.isInside(dest))
      return dest
    // Nothing is returned if the destination is not valid.
  }
}

// A view knows about the environment
// and the direction to look
function View(world, vector) {
  this.world = world
  this.vector = vector
}
View.prototype.look = function(dir) {
  // Given a direction, find the target square in that direction
  var target = this.vector.plus(directions[dir])
  // If the target is in the world...
  if (this.world.grid.isInside(target))
    // Return the character assoc with the element there
    return charFromElement(this.world.grid.get(target))
  else
    // Return a wall
    return '#'
}
View.prototype.findAll = function(ch) {
  var found = []
  for (var dir in directions)
    // If the character sought is in the direction you're looking
    if (this.look(dir) == ch)
      // Put it in the results array
      found.push(dir)
  return found
}
View.prototype.find = function(ch) {
  var found = this.findAll(ch)
  if (found.length == 0)
    return null
  return randomElement(found)
}

console.log('=== View.look() test ===')
var testView = new View(world, new Vector(4, 4))
console.log(testView)
console.log('========================')

for (var i = 0; i < 5; i++) {
  world.turn()
  console.log(world.toString())
}
