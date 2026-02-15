'use strict'
//model
var gBoard


var gLevel =
{
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gGame.isOn = true
    gBoard = buildBoard()
    //placedMinesRandomly()
    console.log(' gBoard after minesPlaced', gBoard)

    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
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
                    oncontextmenu="onCellMarked(this, ${i}, ${j})">
                ${cellContent}
                </td>
            `
        }

        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// function buildBoard() {// hard coded
//     var size = 4
//     var board = []

//     for (var i = 0; i < size; i++) {
//         board[i] = []
//         for (var j = 0; j < size; j++) {
//             board[i][j] = {
//                 minesAroundCount: 0,
//                 isRevealed: false,
//                 isMine: false,
//                 isMarked: false
// }
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

    board[1][1].isMine = true //add mines to the model, for now in specific cell- need to change to rendom
    board[2][3].isMine = true

    return board
}


function onCellClicked(elCell, i, j) {


    //console.log('before change:', gBoard[i][j])

    if (!gGame.isOn) {
        //console.log('game is off')
        return
    }

    gBoard[i][j].isRevealed = true

    //console.log('after change:', gBoard[i][j])

    renderBoard(gBoard)
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

function onCellMarked(elCell, i, j) {
    var cell = gBoard[i][j]
    if (!gGame.isOn) return

    if (gBoard[i][j].isRevealed) return

    // cell.isMarked = true//-not a toggle, chenged only once
    cell.isMarked = !cell.isMarked

    renderBoard(gBoard)



}
//model 
function placedMinesRandomly() {

    var placedMines = 0

    console.log('before placing:', placedMines)

    while (placedMines < gLevel.MINES) {

        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)
        console.log(' i, j', i, j)

        if (gBoard[i][j].isMine === true) continue

        gBoard[i][j].isMine = true
        placedMines++
        //console.log('total placed mines:', placedMines)



    }

}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}