const gameBoard = document.querySelector("#gameboard")
let currentFigure = ''
let currentPosition = 0
let firstClick = null
let secondClick = null
let possibleMoves = []
let playingColor = 'white'
let yourColor = null

let didTheWhiteKingMove = false;
let didTheWhiteRightRookMove = false;
let didTheWhiteLeftRookMove = false;

let didTheBlackKingMove = false;
let didTheBlackRightRookMove = false;
let didTheBlackLeftRookMove = false;

let doublePawnMove = false;
let coordinateOfDoublePawnMove = null

let globalNewFigure = null
let restartClick = false;



let pieces = [
    rook0, knight0, bishop0, queen0, king0, bishop0, knight0, rook0,
    pawn0, pawn0, pawn0, pawn0, pawn0, pawn0, pawn0, pawn0,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn1, pawn1, pawn1, pawn1, pawn1, pawn1, pawn1, pawn1,
    rook1, knight1, bishop1,queen1, king1, bishop1,knight1, rook1
]

function getPiece(coordinate){
    return document.querySelector(`#gameboard .square[square-id="${coordinate}"]`)
}

function getFigure(position) {
    const piece = pieces[position];
    if (piece === '') {
        return '';
    }
    else {
        const start = piece.indexOf("<div class='piece' id='") + "<div class='piece' id='".length;
        const end = piece.indexOf("'", start);
        const figureName = piece.slice(start, end);
        return figureName.split('-')[1];
    }
}

function getColor(position) {
    const piece = pieces[position];
    if (piece === '') {
        return '';
    }
    else {
        return piece.includes('white') ? 'white' : 'black';
    }
}

function checkSquare(coordinate){
    return pieces[coordinate] !== '';
}

function movePiece(startPos, endPos){

    if(getFigure(startPos) === 'pawn' && Math.abs(endPos - startPos) === 16){
        doublePawnMove = true
        coordinateOfDoublePawnMove = endPos
    }
    else{
        doublePawnMove = false
        coordinateOfDoublePawnMove = null
    }


    const color = getColor(startPos)
    if (getFigure(startPos) === 'pawn' && (Math.floor(endPos / 8) === 0 || Math.floor(endPos / 8) === 7) && globalNewFigure === null) {
        showPossibleTransformations(color, newFigure => {
            pieces[startPos] = ''
            getPiece(startPos).innerHTML = ''

            getPiece(endPos).innerHTML = newFigure

            if (color === 'white') {
                getPiece(endPos).style.fill = 'lavender';
            } else {
                getPiece(endPos).style.fill = 'black';
            }
            pieces[endPos] = newFigure;
            getPiece(endPos).innerHTML = newFigure;

            sendMoveMessage(startPos, endPos, newFigure)
        });
        globalNewFigure = null
    }
    else {
        globalNewFigure = null;

        if (getFigure(startPos) === 'king' && color === 'white') {
            didTheWhiteKingMove = true
        }
        if (getFigure(startPos) === 'king' && color === 'black') {
            didTheBlackKingMove = true
        }

        if (getFigure(startPos) === 'rook' && color === 'white' && startPos === 63) {
            didTheWhiteRightRookMove = true
        }
        if (getFigure(startPos) === 'rook' && color === 'white' && startPos === 56) {
            didTheWhiteLeftRookMove = true
        }

        if (getFigure(startPos) === 'rook' && color === 'black' && startPos === 7) {
            didTheBlackLeftRookMove = true
        }
        if (getFigure(startPos) === 'rook' && color === 'black' && startPos === 0) {
            didTheBlackRightRookMove = true
        }


        if (getFigure(startPos) === 'pawn' && getFigure(endPos) === '' && getColor(startPos) === 'white' && Math.abs(endPos - startPos) === 7) {
            pieces[startPos + 1] = '';
            getPiece(startPos + 1).innerHTML = ''
        } else if (getFigure(startPos) === 'pawn' && getFigure(endPos) === '' && getColor(startPos) === 'white' && Math.abs(endPos - startPos) === 9) {
            pieces[startPos - 1] = '';
            getPiece(startPos - 1).innerHTML = ''
        } else if (getFigure(startPos) === 'pawn' && getFigure(endPos) === '' && getColor(startPos) === 'black' && Math.abs(endPos - startPos) === 7) {
            pieces[startPos - 1] = '';
            getPiece(startPos - 1).innerHTML = ''
        } else if (getFigure(startPos) === 'pawn' && getFigure(endPos) === '' && getColor(startPos) === 'black' && Math.abs(endPos - startPos) === 9) {
            pieces[startPos + 1] = '';
            getPiece(startPos + 1).innerHTML = ''
        }

        const temp = pieces[startPos]
        pieces[startPos] = '';
        getPiece(startPos).innerHTML = ''

        pieces[endPos] = temp
        if (color === 'white') {
            getPiece(endPos).innerHTML = temp
            getPiece(endPos).style.fill = 'lavender';
        } else {
            getPiece(endPos).innerHTML = temp
            getPiece(endPos).style.fill = 'black';
        }

        if (getFigure(endPos) === 'king' && startPos === 60 && endPos === 62) {
            const temp = pieces[63]
            pieces[63] = '';
            getPiece(63).innerHTML = ''

            pieces[61] = temp
            getPiece(61).innerHTML = temp
            getPiece(61).style.fill = 'lavender';
            if(yourColor === 'black'){
                getPiece(61).classList.add('rotated')
            }
        } else if (getFigure(endPos) === 'king' && startPos === 60 && endPos === 58) {
            const temp = pieces[56]
            pieces[56] = '';
            getPiece(56).innerHTML = ''

            pieces[61] = temp
            getPiece(59).innerHTML = temp
            getPiece(59).style.fill = 'lavender';
            if(yourColor === 'black') {
                getPiece(59).classList.add('rotated')
            }
        } else if (getFigure(endPos) === 'king' && startPos === 4 && endPos === 6) {
            const temp = pieces[7]
            pieces[7] = '';
            getPiece(7).innerHTML = ''

            pieces[5] = temp
            getPiece(5).innerHTML = temp
            getPiece(5).style.fill = 'black';
            if(yourColor === 'black') {
                getPiece(5).classList.add('rotated')
            }
        } else if (getFigure(endPos) === 'king' && startPos === 4 && endPos === 2) {
            const temp = pieces[0]
            pieces[0] = '';
            getPiece(0).innerHTML = ''

            pieces[3] = temp
            getPiece(3).innerHTML = temp
            getPiece(3).style.fill = 'black';
            if(yourColor === 'black') {
                getPiece(3).classList.add('rotated')
            }
        }
    }
    // playMoveSound()
    if(yourColor === 'black'){
        getPiece(endPos).classList.add('rotated')
    }
}

function rotateBoard() {

    const pieces = document.querySelectorAll('.piece');

    gameBoard.style.transform = `rotate(180deg)`;
    pieces.forEach((piece, i) => {
        piece.classList.add('rotated')
    });

}
function playMoveSound() {
    const audio = new Audio('moveSound.mp3');

    audio.play();
}

function createBoard(){
    pieces.forEach((startPiece, i)=>{
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        square.setAttribute('square-id', i)
        if((i % 2 === 0 && Math.floor(i/8) % 2 === 0) || (i % 2 !== 0 && Math.floor(i/8) % 2 !== 0)){
            square.classList.add('beige')
        }
        else{
            square.classList.add('brown')
        }
        gameBoard.append(square)

        if(checkSquare(i) && getColor(i) === 'white'){
            square.querySelector('svg').style.fill = 'lavender';
        }
        else if(checkSquare(i) && getColor(i) === 'black'){
            square.querySelector('svg').style.fill = 'black';
        }

    })
    if(yourColor === 'black'){
        rotateBoard()
    }
}
function resetBoard() {
    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
        square.remove();
    });

    pieces = [
        rook0, knight0, bishop0, queen0, king0, bishop0, knight0, rook0,
        pawn0, pawn0, pawn0, pawn0, pawn0, pawn0, pawn0, pawn0,
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        pawn1, pawn1, pawn1, pawn1, pawn1, pawn1, pawn1, pawn1,
        rook1, knight1, bishop1,queen1, king1, bishop1,knight1, rook1
    ];

    createBoard();
}

function getPossibleMoves(currentFigure, currentPosition){
    switch (currentFigure) {
        case 'pawn':
            return getPossibleMovesForPawn(currentPosition)
        case 'rook':
            return getPossibleMovesForRook(currentPosition)
        case 'knight':
            return getPossibleMovesForKnight(currentPosition)
        case 'bishop':
            return getPossibleMovesForBishop(currentPosition)
        case 'queen':
            return getPossibleMovesForQueen(currentPosition)
        case 'king':
            return getPossibleMovesForKing(currentPosition)
    }
}

function getFilteredPossibleMoves(currentFigure, currentPosition){
    switch (currentFigure) {
        case 'pawn':
            return filterForAnyMoves(currentPosition, getPossibleMovesForPawn(currentPosition))
        case 'rook':
            return filterForAnyMoves(currentPosition, getPossibleMovesForRook(currentPosition))
        case 'knight':
            return filterForAnyMoves(currentPosition, getPossibleMovesForKnight(currentPosition))
        case 'bishop':
            return filterForAnyMoves(currentPosition, getPossibleMovesForBishop(currentPosition))
        case 'queen':
            return filterForAnyMoves(currentPosition, getPossibleMovesForQueen(currentPosition))
        case 'king':
            return filterForKingMoves(currentPosition, getPossibleMovesForKing(currentPosition))
    }
}

function isMate(color){
    let allPossibleMoves = []
    for(let i = 0; i < 64; i++){
        if(checkSquare(i) && getColor(i) === color){
            const currentFigure = getFigure(i);
            allPossibleMoves = allPossibleMoves.concat(getFilteredPossibleMoves(currentFigure, i))
        }
    }
    return allPossibleMoves.length === 0;
}
function getPossibleMovesForPawn(currentPos) {
    const [row, col] = [Math.floor(currentPos / 8), currentPos % 8];
    let moves = [];
    let color = getColor(currentPos);

    const direction = (color === 'white') ? -1 : 1;

    const doubleStep = (color === 'white' && currentPos >= 48 && currentPos <= 55) ||
        (color === 'black' && currentPos >= 8 && currentPos <= 15);

    switch (color){
        case 'white':
            if(row === 0){
                return moves;
            }
            break
        case 'black':
            if(row === 7){
                return moves;
            }
            break
    }

    const singleStepPos = currentPos + direction * 8;
    if (!checkSquare(singleStepPos) && getFigure(singleStepPos) === '') {
        moves.push(singleStepPos);
    }

    if (doubleStep && getFigure(singleStepPos) === '' && getFigure(singleStepPos + direction * 8) === '') {
        moves.push(singleStepPos + direction * 8);
    }

    const leftAttackPos = currentPos + direction * 9;
    if (leftAttackPos >= 0 && leftAttackPos <= 63 && col !== 0 && checkSquare(leftAttackPos) && getColor(leftAttackPos) !== color) {
        moves.push(leftAttackPos);
    }
    if(doublePawnMove && coordinateOfDoublePawnMove === currentPos+direction && col !== 0){
        moves.push(leftAttackPos);
    }

    const rightAttackPos = currentPos + direction * 7;
    if (rightAttackPos >= 0 && rightAttackPos <= 63 && col !== 7 && checkSquare(rightAttackPos) && getColor(rightAttackPos) !== color){
        moves.push(rightAttackPos);
    }
    if(doublePawnMove && coordinateOfDoublePawnMove === currentPos-direction && col !== 7){
        moves.push(rightAttackPos);
    }


    return moves;
}
function showPossibleTransformations(color, callback) {
    gameBoard.style.pointerEvents = 'none';

    gameBoard.classList.add('smoothed');
    const recommendedPieces = color === 'white' ? [rook1, knight1, bishop1, queen1] : [rook0, knight0, bishop0, queen0];
    const rectangle = document.createElement('div');
    rectangle.classList.add('rectangle');

    const parent = document.querySelector('body');
    const parentRect = parent.getBoundingClientRect();
    const topPosition = (parentRect.height - 80) / 2;
    const leftPosition = (parentRect.width - 320) / 2;
    rectangle.style.top = `${topPosition}px`;
    rectangle.style.left = `${leftPosition}px`;

    recommendedPieces.forEach((piece, i) => {
        const square = document.createElement('div');
        square.setAttribute('square-id', i);
        square.classList.add('square');
        square.innerHTML = piece;
        if (color === 'white') {
            square.querySelector('svg').style.fill = 'lavender';
        } else {
            square.querySelector('svg').style.fill = 'black';
        }
        square.addEventListener('click', function(event) {
            const square1 = event.target.closest('.square');
            const choice = square1.getAttribute('square-id');
            gameBoard.classList.remove('smoothed');
            const choicePanel = document.querySelectorAll('.rectangle');
            choicePanel.forEach(p => {
                p.parentNode.removeChild(p);
            });
            globalNewFigure = recommendedPieces[parseInt(choice)]
            callback(recommendedPieces[parseInt(choice)]);

            gameBoard.style.pointerEvents = 'auto';
        });
        rectangle.append(square);
    });

    parent.append(rectangle);
}

function showFinalScreen(winColor) {
    gameBoard.style.pointerEvents = 'none';

    gameBoard.classList.add('smoothed');

    const block1 = document.createElement('div');
    block1.style.height = '160px';
    block1.style.width = '320px';
    block1.style.display = 'flex';
    block1.style.alignItems = 'center';
    block1.style.justifyContent = 'center';

    const winMessageText = document.createElement('span');
    winMessageText.textContent = `${winColor} is win!`;
    winMessageText.style.fontSize = '40px';
    winMessageText.style.color = winColor;

    block1.appendChild(winMessageText);

    const block2 = document.createElement('div');
    block2.style.height = '160px';
    block2.style.width = '320px';
    block2.style.display = 'flex';
    block2.style.alignItems = 'center';
    block2.style.justifyContent = 'center';

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.style.padding = '10px 20px';
    restartButton.addEventListener('click', function (){
        if(!restartClick){
            sendRestartMessage();
            restartClick = true;
        }

    });

    block2.appendChild(restartButton);

    const winMessage = document.createElement('div');
    winMessage.appendChild(block1);
    winMessage.appendChild(block2);
    winMessage.style.border = `3px solid ${winColor}`;
    winMessage.style.borderRadius = '3px';

    if (winColor === 'white') {
        winMessage.style.backgroundColor = 'rgb(88, 88, 88)';
    } else {
        winMessage.style.backgroundColor = 'rgb(180, 180, 180)';
    }

    winMessage.classList.add('win');
    document.querySelector('body').append(winMessage);

    //добавить кнопочку restart (должна менять цвета элементов на противоположные и сбрасывать массив pieces к исходному)
}
function removeFinalScreen() {
    const winElement = document.querySelector('.win');
    if (winElement) {
        winElement.parentNode.removeChild(winElement);
    }
    gameBoard.classList.remove('smoothed');
    gameBoard.style.pointerEvents = 'auto';
}


function getPossibleMovesForRook(currentPos) {
    const [row, col] = [Math.floor(currentPos / 8), currentPos % 8];
    const color = getColor(currentPos);
    let moves = [];

    const directions = [
        { row: 1, col: 0 }, // вниз
        { row: -1, col: 0 }, // вверх
        { row: 0, col: -1 }, // влево
        { row: 0, col: 1 } // вправо
    ];

    for (const direction of directions) {
        let newRow = row + direction.row;
        let newCol = col + direction.col;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const newPos = newRow * 8 + newCol;

            if (checkSquare(newPos)) {
                if (getColor(newPos) === color) {
                    break;
                }
                moves.push(newPos);
                break;
            }
            moves.push(newPos);
            newRow += direction.row;
            newCol += direction.col;
        }
    }


    return moves
}

function getPossibleMovesForKnight(currentPos){
    const boardSize = 8;
    const moves = [];
    let color = getColor(currentPos)

    const knightMoves = [
        [-2, -1], [-2, 1], [2, -1], [2, 1],
        [-1, -2], [-1, 2], [1, -2], [1, 2]
    ];

    const [row, col] = [Math.floor(currentPos / boardSize), currentPos % boardSize];

    for (const [rDiff, cDiff] of knightMoves) {
        const newRow = row + rDiff;
        const newCol = col + cDiff;

        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
            const newPosition = newRow * boardSize + newCol;
            if((checkSquare(newPosition) && getColor(newPosition) !== color) || !checkSquare(newPosition)){
                moves.push(newPosition);
            }
        }
    }

    return moves;
}

function getPossibleMovesForBishop(currentPos){
    const boardSize = 8;
    const moves = [];
    const color = getColor(currentPos);

    const [startRow, startCol] = [Math.floor(currentPos / boardSize), currentPos % boardSize];
    const isValidMove = (row, col) => {
        if(row >= 0 && row < boardSize && col >= 0 && col < boardSize){
            if(checkSquare(row * boardSize + col) && getColor(row * boardSize + col) !== color){
                return true;
            }
            else if(checkSquare(row * boardSize + col) && getColor(row * boardSize + col) === color){
                return false;
            }
            return true;
        }
    };

    const findMovesInDirection = (rowIncrement, colIncrement) => {
        let newRow = startRow + rowIncrement;
        let newCol = startCol + colIncrement;

        while (isValidMove(newRow, newCol)) {
            const newPosition = newRow * boardSize + newCol;
            moves.push(newPosition);

            if (checkSquare(newPosition) && getColor(newPosition) !== color) {
                break; // Прекращаем движение в направлении, если встречаем фигуру противника
            }

            newRow += rowIncrement;
            newCol += colIncrement;
        }
    };

    findMovesInDirection(-1, -1); // Вверх-влево
    findMovesInDirection(-1, 1); // Вверх-вправо
    findMovesInDirection(1, -1); // Вниз-влево
    findMovesInDirection(1, 1); // Вниз-вправо

    return moves;
}

function getPossibleMovesForQueen(currentPos){
    const bishopMoves = getPossibleMovesForBishop(currentPos);
    const rookMoves = getPossibleMovesForRook(currentPos);

    return [...bishopMoves, ...rookMoves];
}

function getPossibleMovesForKing(currentPos){
    const boardSize = 8;
    let moves = [];
    const color = getColor(currentPos);

    if(color === 'black' && !didTheBlackKingMove){
        if(!checkSquare(5) && !checkSquare(6) && !didTheBlackLeftRookMove) {
            moves.push(6)
        }
        if(!checkSquare(3) && !checkSquare(2) && !checkSquare(1) && !didTheBlackRightRookMove){
            moves.push(2)
        }
    }

    const [row, col] = [Math.floor(currentPos / boardSize), currentPos % boardSize];

    for (let rDiff = -1; rDiff <= 1; rDiff++) {
        for (let cDiff = -1; cDiff <= 1; cDiff++) {
            if (rDiff === 0 && cDiff === 0) {
                continue;
            }

            const newRow = row + rDiff;
            const newCol = col + cDiff;

            if ((newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize &&
                    checkSquare(newRow * boardSize + newCol) && getColor(newRow * boardSize + newCol) !== color) ||
                newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && !checkSquare(newRow * boardSize + newCol)) {
                const newPosition = newRow * boardSize + newCol;
                moves.push(newPosition);
            }
        }
    }

    if(color === 'white' && !didTheWhiteKingMove){
        if(!checkSquare(61) && !checkSquare(62) && !didTheWhiteRightRookMove) {
            moves.push(62)
        }
        if(!checkSquare(59) && !checkSquare(58) && !checkSquare(57) && !didTheWhiteLeftRookMove){
            moves.push(58)
        }
    }

    return moves
}

function checkKingMove(startPos, endPos){
    const color = getColor(startPos)
    const pieceStart = pieces[startPos]
    const pieceEnd = pieces[endPos]

    pieces[startPos] = ''
    pieces[endPos] = pieceStart

    for(let i= 0; i < 64; i++){
        if(checkSquare(i) && getColor(i) !== color){
            let figure = getFigure(i);
            let enemyMoves = []
            if(figure === 'king'){
                enemyMoves = []
            }
            else if(figure === 'pawn'){
                const direction = (color === 'white') ? 1 : -1;
                const leftAttackPos = i + direction * 7;
                if (leftAttackPos >= 0 && leftAttackPos <= 63 && i % 8 !== 7) {
                    enemyMoves.push(leftAttackPos);
                }

                const rightAttackPos = i + direction * 9;
                if (rightAttackPos >= 0 && rightAttackPos <= 63 && i % 8 !== 0) {
                    enemyMoves.push(rightAttackPos);
                }
            }
            else{
                enemyMoves = getPossibleMoves(figure, i)
            }


            if(enemyMoves.includes(endPos)){
                pieces[startPos] = pieceStart
                pieces[endPos] = pieceEnd

                return false;
            }
        }
    }

    pieces[startPos] = pieceStart
    pieces[endPos] = pieceEnd

    return true
}
function filterForKingMoves(currentPos, moves){
    let filter1 = []
    moves.forEach(move => {
        if(checkKingMove(currentPos, move)){
            filter1.push(move)
        }
    })

    const color = getColor(currentPos)
    let anotherKingPos = -1
    for(let i = 0; i < 64; i++){
        if(getFigure(i) === 'king' && getColor(i) !== color){
            anotherKingPos = i
            break
        }
    }
    const possibleMovesForAnotherKing = [anotherKingPos+8, anotherKingPos-8, anotherKingPos+1, anotherKingPos-1,
        anotherKingPos+7, anotherKingPos-7, anotherKingPos+9, anotherKingPos-9]



    if(!filter1.includes(61)){
        filter1 = filter1.filter(i => i !== 62)
    }
    if(!filter1.includes(59)){
        filter1 = filter1.filter(i => i !== 58)
    }
    if(!filter1.includes(5)){
        filter1 = filter1.filter(i => i !== 6)
    }
    if(!filter1.includes(3)){
        filter1 = filter1.filter(i => i !== 2)
    }


    return filter1.filter(item => !possibleMovesForAnotherKing.includes(item))
}
function isCheck(color){
    let kingPos = -1;
    for(let i = 0; i < 64; i++){
        if(getFigure(i) === 'king' && getColor(i) === color){
            kingPos = i
            break
        }
    }

    return !checkKingMove(kingPos, kingPos)
}
function simulateMove(startPos, endPos, color) {
    const pieceStart = pieces[startPos]
    const pieceEnd = pieces[endPos]

    pieces[startPos] = ''
    pieces[endPos] = pieceStart

    let isHaveACheck = isCheck(color)

    pieces[startPos] = pieceStart
    pieces[endPos] = pieceEnd

    return isHaveACheck
}
function filterForAnyMoves(currentPos, moves){
    let color = getColor(currentPos)
    let finalRes = []
    moves.forEach(move => {
        if(!simulateMove(currentPos, move, color)){
            finalRes.push(move)
        }
    })
    return finalRes
}

function drawPossibleMoves(moves) {
    moves.forEach(move => {
        if(!checkSquare(move)) {
            const circleElement = document.createElement('div');
            circleElement.classList.add('circle');
            getPiece(move).appendChild(circleElement);
        }
        else{
            getPiece(move).querySelector('svg').classList.add('attacked')
        }
    });
}

function removeAttacks() {
    const circles = document.querySelectorAll('.circle');
    const squares = document.querySelectorAll('.attacked')
    circles.forEach(circle => {
        circle.parentNode.removeChild(circle);
    });
    squares.forEach(square => {
        square.classList.remove('attacked')
    })
}


//взаимодействие с сервером
const ws = new WebSocket('ws://localhost:8000');

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if(message.type === 'start'){
        gameBoard.addEventListener('click', function (event) {
            if(playingColor === yourColor) {
                if (firstClick === null) {
                    const square1 = event.target.closest('.square');
                    if (square1) {
                        currentPosition = parseInt(square1.getAttribute('square-id'))
                        if (getColor(currentPosition) === playingColor) {
                            if (checkSquare(currentPosition)) {
                                currentFigure = square1.querySelector('div').getAttribute('id').split('-')[1];
                                firstClick = currentPosition
                            } else {
                                firstClick = null
                                secondClick = null
                            }

                            if (square1.children.length > 0) {
                                possibleMoves = possibleMoves.concat(getFilteredPossibleMoves(currentFigure, currentPosition));
                                drawPossibleMoves(possibleMoves)
                            }
                        }
                    }
                } else {
                    const square2 = event.target.closest('.square');

                    if (square2) {
                        currentPosition = parseInt(square2.getAttribute('square-id'))
                        if (currentPosition === firstClick) {
                            removeAttacks()
                            possibleMoves = []
                            firstClick = null
                            secondClick = null
                        } else {
                            secondClick = currentPosition

                            removeAttacks()
                            if (possibleMoves.includes(secondClick)) {
                                movePiece(firstClick, secondClick)
                                if(!(getFigure(firstClick) === 'pawn' && (Math.floor(secondClick / 8) === 0 || Math.floor(secondClick / 8) === 7))) {
                                    sendMoveMessage(firstClick, secondClick, null)
                                }
                                if (playingColor === 'white') {
                                    playingColor = 'black'
                                } else {
                                    playingColor = 'white'
                                }
                            }
                            possibleMoves = []

                            firstClick = null;
                            secondClick = null;
                        }

                    }
                }
            }
        });
    }
    if (message.type === 'color') {
        yourColor = message.color
        createBoard()
    }
    else if (message.type === 'move') {
        if(message.newFigure !== null){
            globalNewFigure = message.newFigure
            const color = getColor(message.startPos)

            pieces[message.startPos] = ''
            getPiece(message.startPos).innerHTML = ''

            getPiece(message.endPos).innerHTML = message.newFigure

            if (color === 'white') {
                getPiece(message.endPos).style.fill = 'lavender';
            } else {
                getPiece(message.endPos).style.fill = 'black';
            }
            pieces[message.endPos] = message.newFigure;
            getPiece(message.endPos).innerHTML = message.newFigure;
            if(yourColor === 'black'){
                getPiece(message.endPos).classList.add('rotated')
            }
        }
        else {
            movePiece(message.startPos, message.endPos)
        }
        if (playingColor === 'white') {
            playingColor = 'black'
        } else {
            playingColor = 'white'
        }
        if(isMate(playingColor)){
            if(playingColor === 'black'){
                sendResultOfGameMessage('white')
            }
            else{
                sendResultOfGameMessage('black')

            }
        }
    }
    else if(message.type === 'result'){
        showFinalScreen(message.winColor)
    }
    else if(message.type === 'confirmRestart'){
        restartClick = false;
        removeFinalScreen();
        if(yourColor === 'black'){
            gameBoard.style.transform = `rotate(0deg)`;
            yourColor = 'white';
        }
        else{
            yourColor = 'black';
        }
        resetBoard();
        playingColor = 'white';
    }
};

function sendMoveMessage(startPos, endPos, newFigure) {
    const moveMessage = {
        type: 'move',
        startPos: startPos,
        endPos: endPos,
        newFigure: newFigure
    };

    ws.send(JSON.stringify(moveMessage));
}
function sendResultOfGameMessage(winColor){
    const message = {
        type: 'result',
        winColor: winColor
    };

    ws.send(JSON.stringify(message));
}
function sendRestartMessage(){
    const message = {
        type: 'restart',
        color: yourColor
    };

    ws.send(JSON.stringify(message));
}