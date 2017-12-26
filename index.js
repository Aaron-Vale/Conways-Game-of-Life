$(document).ready(function() {
  setEventListeners()
  buildGameBoard()
})


function setEventListeners() {
  $('.square').click(function() {
    const x = this.dataset.x
    const y = this.dataset.y
    const boardIndex = this.dataset.boardIndex
    const square = gameBoard[boardIndex]
    if ($(this).hasClass('dead')) {
      $(this).removeClass('dead').addClass('alive')
      square.alive = true
    } else {
      $(this).removeClass('alive').addClass('dead')
      square.alive = false
    }
  })

  $('.run-btn').click(runGeneration)
}

class Square {
  constructor(x,y) {
    this.alive = false
    this.x = x
    this.y = y
    this.next = null
  }
}


let gameBoard = []
const xMax = 12
const yMax = 12

function buildGameBoard() {
  for (let y = yMax-1; y >= 0; y--) {
    for (let x = 0; x <= xMax-1; x++) {
      gameBoard.push(new Square(x,y))
    }
  }
  const squares = document.getElementsByClassName('square')
  for (let i = 0; i < squares.length; i++) {
    squares[i].dataset.x = gameBoard[i].x
    squares[i].dataset.y = gameBoard[i].y
    squares[i].dataset.boardIndex = i
    $(squares[i]).addClass('dead')
  }
  console.log(gameBoard)
  console.log(squares)
}

// Returns a square at a given (x, y)
function getSquare(x, y) {
  // if x or y out of bounds, return NULL
  if (x >= xMax || y >= xMax || x < 0 || y < 0) {
    return null
  }
  const filter = gameBoard.filter(function(element) {
    return element.x === x && element.y === y
  })

  return filter[0]
}

/* Takes a square as parameter, and returns whether it is alive
 * returns true if alive, false if dead
 */
function isAlive(s) {
  if (s === null) {
    return false
  }
  return s.alive
}

/* Takes a square and returns number of neighbors
 * returns int
 */
function findNeighbors(square) {
  const x = square.x
  const y = square.y
  let count = 0
  let temp
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      temp = getSquare(i, j)
      if (isAlive(temp))
        count++
    }
  }

  temp = getSquare(x, y)
  if (isAlive(temp)) { // remove original square if its alive
    count--
  }

  return count
}

function nextState() {
  const squares = document.getElementsByClassName('square')
  for (let i = 0; i < squares.length; i++) {
    if (gameBoard[i].next) {
      gameBoard[i].alive = true
      $(squares[i]).removeClass('dead').addClass('alive')
    } else {
      gameBoard[i].alive = false
      $(squares[i]).removeClass('alive').addClass('dead')
    }
  }
}

function runGeneration() {
  const squares = document.getElementsByClassName('square')
  for (let i = 0; i < gameBoard.length; i++) {
    let element = squares[i]
    let alive = gameBoard[i].alive
    let neighbors = findNeighbors(gameBoard[i])
    if (!alive) {
      if (neighbors === 3) {
        gameBoard[i].next = true
      }
      else {
        gameBoard[i].next = false
      }
    }
    else if (neighbors !== 2 && neighbors !== 3) {
      gameBoard[i].next = false
    } else {
      gameBoard[i].next = true
    }
  }
  nextState()
}
