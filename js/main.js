'use strict'
//model
var gBoard
var gIsDev = true // if true - placed hard coded mines, if false- place mines randomly 

//var gIsFirstCell

var gLevel =
{
    SIZE: 8,
    MINES: 5
}

var gGame


function onInit() {
    gGame = {
        isOn: true,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        isFirstCell: true
    }
    console.log('game started')
    console.log('lives ', gGame.lives)

    //gIsFirstCell = true

    gBoard = buildBoard()
    //placedMinesRandomly()
    renderBoard(gBoard)
    renderLives()
    renderSmiley('😃')
}
function onCellClicked(elCell, i, j) {

    if (!gGame.isOn) {
        console.log('the game is off')
        return
    }

    var currCell = gBoard[i][j]
    console.log('click', i, j)

    if (currCell.isRevealed || currCell.isMarked) return


    if (gGame.isFirstCell) {
        console.log('first click')
        if (gIsDev) {
            placedMinesStatic()
        } else {
            placedMinesRandomly(i, j)
        }
        setMinesNegsCount(gBoard)
        gGame.isFirstCell = false
    }

    if (currCell.isMine) {
        console.log('mine clicked')
        handleMineClick(i, j)
    } else {
        currCell.isRevealed = true
        gGame.revealedCount++
        console.log('revealedCount:', gGame.revealedCount)
        if (currCell.minesAroundCount === 0) {
            expand(i, j)
        }
    }
    renderBoard(gBoard)
    checkVictory()
}

//DOM
function renderBoard(board) {

    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[i].length; j++) {

            var cell = board[i][j]
            //console.log('cell', cell)
            var cellContent = ''
            // if (cell.isMine) {
            //     cellContent = '💣'
            // }


            if (cell.isMarked) cellContent = '🏴‍☠️' //  

            else if (cell.isRevealed) {
                if (cell.isMine) {
                    cellContent = '💣'
                } else if (cell.minesAroundCount > 0) {
                    cellContent = cell.minesAroundCount
                }
            }

            strHTML += `
                <td onclick="onCellClicked(this,${i}, ${j})"
                    oncontextmenu="onCellMarked(event, ${i}, ${j})">
                ${cellContent}
                </td>
            `
        }

        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function buildBoard() {
    var board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []

        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    // board[1][1].isMine = true //add mines to the model, for now in specific cell- need to change to rendom
    //board[2][3].isMine = true

    return board
}



//call the set function before the render in oninit() so the board will update with the minesCountAround
function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {

        for (var j = 0; j < board[i].length; j++) {

            var currCell = board[i][j]
            //console.log('currCell', currCell)

            if (currCell.isMine) continue

            var minesCount = countMinesAround(i, j, board)
            // console.log('minesCount', minesCount)

            currCell.minesAroundCount = minesCount //update the model, 
        }
    }
}
// function setMinesNegsCount(board) {

//     for (var i = 0; i < board.length; i++) {
//         for (var j = 0; j < board[i].length; j++) {


//             if (board[i][j].isMine) continue

//             var minesCount = 0


//             for (var row = i - 1; row <= i + 1; row++) {
//                 if (row < 0 || row >= board.length) continue

//                 for (var col = j - 1; col <= j + 1; col++) {
//                     if (col < 0 || col >= board[row].length) continue
//                     if (row === i && col === j) continue

//                     if (board[row][col].isMine) {
//                         minesCount++
//                     }
//                 }
//             }

//             board[i][j].minesAroundCount = minesCount
//         }
//     }
// }

function countMinesAround(rowIdx, colIdx, board) { //negs loop, counts the current cell mines around. 
    var neighborsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= board[i].length) continue

            if (i === rowIdx && j === colIdx) continue

            if (board[i][j].isMine) {
                neighborsCount++
            }
        }
    }

    return neighborsCount
}

function onCellMarked(event, i, j) {
    //console.log('event', event)
    //console.log(event.type)
    event.preventDefault()

    var cell = gBoard[i][j]
    if (!gGame.isOn) return

    if (gBoard[i][j].isRevealed) return

    // cell.isMarked = true//-not a toggle, chenged only once
    cell.isMarked = !cell.isMarked

    renderBoard(gBoard)



}
//model 
function placedMinesRandomly(firstI, firstJ) {

    var placedMines = 0


    while (placedMines < gLevel.MINES) {

        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)

        // console.log('the random i, j', i, j)

        if (i === firstI && j === firstJ) continue
        if (gBoard[i][j].isMine === true) continue

        gBoard[i][j].isMine = true
        placedMines++

        //console.log('total placed mines:', placedMines)



    }

}
function placedMinesStatic() {
    console.log('placing static mines')

    gBoard[1][1].isMine = true
    gBoard[2][3].isMine = true
    gBoard[4][4].isMine = true
    gBoard[6][0].isMine = true

}
function revealAllMines() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {

            if (gBoard[i][j].isMine) {
                gBoard[i][j].isRevealed = true
            }
        }
    }
}
function handleMineClick(i, j) {

    gGame.lives--
    console.log('lives left:', gGame.lives)

    renderSmiley('😮')

    renderLives()

    if (gGame.lives > 0) {
        setTimeout(function () {
            renderSmiley('😃')
        }, 500)
    }

    gBoard[i][j].isRevealed = true // show the mine when cell with mine clicked
    renderBoard(gBoard)

    setTimeout(function () { // after 500 milisecond we close the cell again
        if (gGame.lives > 0) {
            gBoard[i][j].isRevealed = false
            renderBoard(gBoard)
        }
    }, 500)

    if (gGame.lives === 0) {
        console.log('game over')
        revealAllMines()
        gGame.isOn = false
        renderSmiley('🤯')
        alert('Game Over')
    }
}

function renderLives() {
    document.querySelector('.lives').innerText = gGame.lives
}
function renderSmiley(smiley) {
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = smiley
}
function onSmileyClick() {
    console.log('smiley clicked (reset game)')
    onInit()
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function checkVictory() {

    var totalCells = gLevel.SIZE * gLevel.SIZE
    var safeCells = totalCells - gLevel.MINES

    console.log('safeCells:', safeCells)

    if (gGame.revealedCount === safeCells) {

        gGame.isOn = false
        alert('Victory!')
    }
}

function expand(rowIdx, colIdx) {

    console.log('ENTER expand:', rowIdx, colIdx)

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= gBoard[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            var neighbor = gBoard[i][j]

            console.log('Checking neighbor:', i, j)

            if (neighbor.isRevealed || neighbor.isMine || neighbor.isMarked) {
                console.log('Skipping neighbor:', i, j)
                continue
            }

            neighbor.isRevealed = true
            gGame.revealedCount++
            console.log('Revealed:', i, j)

            if (neighbor.minesAroundCount === 0) {
                console.log('Recursing into:', i, j)
                expand(i, j)
            }
        }
    }

    console.log('EXIT expand:', rowIdx, colIdx)
}

