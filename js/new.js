for (var i = 0; i < 10; i++) {
  var currentRow = 'row' + i
  $('main').append('<div class="row ' + currentRow + '"></div>')

  for (var j = 0; j < 10; j++) {
    var currentCol = 'col' + j
    var cell = document.createElement('div')
    $(cell).addClass(currentCol)
    $(cell).addClass('cell')

    $('.' + currentRow).append(cell)
  }
}

// $('.cell').text('x')
