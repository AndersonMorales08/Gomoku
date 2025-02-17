class MyAgent extends Agent {
    constructor () {
        super()
        this.board = new Board()
        this.color = null
		// Blancas en el tablero
        this.whites = []
		// Negras en el tablero
        this.blacks = []
    }

    compute(board, move_state, time) {
        var sizeBoard = board.length
        var moves = this.board.valid_moves(board)
        switch (move_state) {
            case '1':
                var initSizeMove = sizeBoard - 2 
                var initValidMoves = moves.filter((move) => (move[0] <= initSizeMove && move[0] >= 1 && move[1] <= initSizeMove && move[1] >= 1)); // Quita la fila de arriba y la fila de abajo, y la columna de la derecha y la de la izquierda, para que las jugadas se hagan en un tablero de sizeBoard - 2
                var match = false

                var blackPos1 = Math.floor(initValidMoves.length * Math.random())
                var blackPos2 = Math.floor(initValidMoves.length * Math.random())
                var whitePos = Math.floor(initValidMoves.length * Math.random())
                
                for (var i = 0; i < 3; i++) {
                    if (blackPos1 !== whitePos && blackPos2 !== whitePos && blackPos1 !== blackPos2) {
                        match = this.verifyGoodMove(initValidMoves[blackPos1], initValidMoves[blackPos2])   // Verifica que las fichas no esten muy juntas
                    }
                    if (match) {
                        break;
                    } else {
                        blackPos1 = Math.floor(initValidMoves.length * Math.random())
                        blackPos2 = Math.floor(initValidMoves.length * Math.random())
                        whitePos = Math.floor(initValidMoves.length * Math.random())
                    }
                }

                if (match) {
                    return [initValidMoves[blackPos1], initValidMoves[blackPos2], initValidMoves[whitePos]]
                } else {
                    return[initValidMoves[0], initValidMoves[3], initValidMoves[1]]
                }
            break;
            case '2':
                var initSizeMove = sizeBoard - 2 
                var initValidMoves = moves.filter((move) => (move[0] <= initSizeMove && move[0] >= 1 && move[1] <= initSizeMove && move[1] >= 1));
                var match = false
                var brd = this.board.clone(board)

                var randNum = Math.random()

                this.dividePieces(brd)

                if(!this.verifyGoodMove(this.blacks[0], this.blacks[1])) {   // Si las fichas negras están juntas o con una separación de un cuadro, escoge las negras 
                    return 'BLACK'
                } else if (randNum < 0.03) {
                    var whitePosBrd = this.whites[0]
                    var xLeft = whitePosBrd[0] - 1
                    var xRight = whitePosBrd[0] + 1
                    var yUp = whitePosBrd[1] - 1
                    var yDown = whitePosBrd[1] + 1

                    if (xLeft < 0) xLeft = 0
                    if (xRight > sizeBoard - 1) xRight = sizeBoard - 1
                    if (yUp < 0) yUp = 0
                    if (yDown > sizeBoard - 1) yDown = sizeBoard - 1

                    var diffLeft = Math.abs(0 - xLeft)   // Revisa que tan separado esta de la parte izquierda del tablero 
                    var diffRight= Math.abs((sizeBoard - 1) - xRight)   // Revisa que tan separado esta de la parte derecha del tablero 
                    var diffUp = Math.abs(0 - yUp)  // Revisa que tan separado esta de la parte de arriba del tablero 
                    var diffDown = Math.abs((sizeBoard - 1) - yDown)   // Revisa que tan separado esta de la parte de abajo del tablero 
                    
                    var newCoor = [xLeft, xRight, yUp, yDown]
                    var diffList = [diffLeft, diffRight, diffUp, diffDown]

                    var varIndexMax = this.maxCross(diffList)   // Devuelve el indice del elemento más grando, es decir, del lado más separado de los límites del tablero
                    var isValid = []

                    for (var i = 0; i < diffList.length; i++) {   // Revisa que la jugada sea válida
                        if (varIndexMax === 0 || varIndexMax === 1) {
                            isValid = moves.filter((move) => (move[0] === newCoor[varIndexMax] && move[1] === whitePosBrd[1]))
                        } else {
                            isValid = moves.filter((move) => (move[0] === whitePosBrd[0] && move[1] === newCoor[varIndexMax]))
                        }

                        if (isValid.length > 0) {
                            break;
                        }
                    }

                    return isValid[0]
                } else {
                    var blackPos = Math.floor(initValidMoves.length * Math.random())
                    var whitePos = Math.floor(initValidMoves.length * Math.random())

                    var matchBlack = false
                    var matchWhite = false

                    for (var i = 0; i < 3; i++) {
                        if (blackPos !== whitePos) {
                            for (var j = 0; j < this.blacks.length; j++) {   // Revisa que la nueva ficha negra que vaya a poner este alejada de las otras dos.
                                matchBlack =  this.verifyGoodMove(initValidMoves[blackPos], this.blacks[j])

                                if(!matchBlack) break
                            }

                            if (matchBlack) {
                                matchWhite = this.verifyGoodMove(initValidMoves[whitePos], this.whites[0])
                            }
                        }
                        if (matchBlack && matchWhite) {
                            break;
                        } else {
                            blackPos = Math.floor(initValidMoves.length * Math.random())
                            whitePos = Math.floor(initValidMoves.length * Math.random())
                        }
                    }

                    if (matchBlack && matchWhite) {
                        return [initValidMoves[whitePos], initValidMoves[blackPos]]
                    } else {
                        return[initValidMoves[0], initValidMoves[1]]
                    }
                }
            break;
            case '3':
                var brd = this.board.clone(board)
                var maxBlack = -999
                var maxWhite = -999
                var analysisBlack = {}
                var analysiswhite = {}
                var currentBlack = 0
                var currentWhite = 0

                this.dividePieces(brd)

                for (var i = 0; i < this.blacks.length; i++) {
                     analysisBlack = this.localAnalysis(this.blacks[i], brd, "B", sizeBoard)
                     currentBlack = analysisBlack['density'] + analysisBlack['maxInLine']['value']   // Esta suma sirve para saber si escoger negras o blancas

                     if(currentBlack > maxBlack) {
                        maxBlack = currentBlack
                     }
                }

                for (var i = 0; i < this.whites.length; i++) {
                    analysiswhite = this.localAnalysis(this.whites[i], brd, "W", sizeBoard)
                    currentWhite = analysiswhite['density'] + analysiswhite['maxInLine']['value']   // Esta suma sirve para saber si escoger negras o blancas

                     if(currentWhite > maxWhite) {
                        maxWhite = currentWhite
                     }
                }

                if (maxBlack > maxWhite) {   // Escoge negras o blancas 
                    return 'BLACK'
                } else {
                    return this.bestMove(board, this.color)
                }
            break;
            default:
                return this.bestMove(board, this.color)
			break;
        }
    }

	// Divide las fichas dentro del tablero en las listas de su respectivo color.
    dividePieces(brd) {
        this.whites = []
        this.blacks = []
        for (var i = 0; i < brd.length; i++) {
            for (var j = 0; j < brd.length; j++) {
                if (brd[i][j] == 'W') {
                    this.whites.push([j, i])
                } else if (brd[i][j] == 'B') {
                    this.blacks.push([j, i])
                }
            }
        }
    }

	// Verifica que las fichas no esten muy juntas
    verifyGoodMove(pos1, pos2) {
        var good = false

        if (pos1[0] == pos2[0]) {
            if (Math.abs(pos1[1] - pos2[1]) - 1 > 1) {
                good = true
            }
        } else if (pos1[1] == pos2[1]) {
            if (Math.abs(pos1[0] - pos2[0]) - 1 > 1) {
                good = true
            } 
        } else {
            if (!((Math.abs(pos1[0] - pos2[0]) - 1 === 1 && Math.abs(pos1[1] - pos2[1]) - 1 === 1) || (Math.abs(pos1[0] - pos2[0]) - 1 === 0 && Math.abs(pos1[1] - pos2[1]) - 1 === 0))) {
                good = true;
            } 
        }

        return good
    }

    maxCross(listToComp) {
        var max = 0
        var maxValue = -999999
        for (var i = 0; i < listToComp.length; i++) {
            if (listToComp[i] >= maxValue) {
                max = i
                maxValue = listToComp[i]
            }
        }

        return max
    }

	// Analiza la posición de una ficha, en un cuadrado 5x5 con la ficha en el medio. Verifica cuántas fichas del color hay en esa area y si tiene fichas en línea.
    localAnalysis(pos, brd, color, sizeBoard) {
        var analysis = {}
        var inLinePieces = {'hor': 0, 'ver': 0, 'ltrbDiag': 0, 'rtlbDiag': 0}
        var density = 0
        var localAreaPos = this.localArea(pos, sizeBoard, 2)

        for (var i = localAreaPos[2]; i <= localAreaPos[3]; i++) {
            for (var j = localAreaPos[0]; j <= localAreaPos[1]; j++) {
                if (brd[i][j] === color) {
                    if (j === pos[0] && i === pos[1]) {
                        inLinePieces['hor'] += 1
                        inLinePieces['ver'] += 1
                        inLinePieces['ltrbDiag'] += 1
                        inLinePieces['rtlbDiag'] += 1
                    } else if (j === pos[0]) {   // Verifica que hallan fichas del mismo color en la verical
                        inLinePieces['ver'] += 1   
                    } else if (i === pos[1]) {   // Verifica que hallan fichas del mismo color en la horizontal
                        inLinePieces['hor'] += 1
                    } else if (Math.abs(j - pos[0]) === Math.abs(i - pos[1])) {
                        if ((j < pos[0] && i < pos[1]) || (j > pos[0] && i > pos[1])) {   // Verifica que hallan fichas del mismo color en la diagonal izquierda arriba a derech abajo
                            inLinePieces['ltrbDiag'] += 1
                        } else if ((j < pos[0] && i > pos[1]) || (j > pos[0] && i < pos[1])) {   // Verifica que hallan fichas del mismo color en la diagonal derecha arriba a izquierda abajo
                            inLinePieces['rtlbDiag'] += 1
                        }
                    }

                    density += 1
                } else if (brd[i][j] !== ' ') {   // Hace lo mismo que en el anterior if, pero con las fichas del otro color. Si esta en línea con una ficha de otro color, resta 2.
                    if (j === pos[0]) {
                        inLinePieces['ver'] -= 1
                    } else if (i === pos[1]) {
                        inLinePieces['hor'] -= 1
                    } else if (Math.abs(j - pos[0]) === Math.abs(i - pos[1])) {
                        if ((j < pos[0] && i < pos[1]) || (j > pos[0] && i > pos[1])) {
                            inLinePieces['ltrbDiag'] -= 1
                        } else if ((j < pos[0] && i > pos[1]) || (j > pos[0] && i < pos[1])) {
                            inLinePieces['rtlbDiag'] -= 1
                        }
                    }
                }
            }
        }

        analysis['density'] = density
        analysis['inLinePieces'] = inLinePieces

        var maxLine = this.maxInLine(analysis['inLinePieces'])
        var key = maxLine['keys'][maxLine['max']]
        var value = maxLine['values'][maxLine['max']]

        analysis['maxInLine'] = {'key': key, 'value': value} 

        return analysis
    }

    maxInLine(inLinePieces) {
        var keys = Object.keys(inLinePieces)
        var values = Object.values(inLinePieces)

        var max = 0
        var maxValue = -999999
        for (var i = 0; i < keys.length; i++) {
            if (values[i] > maxValue) {
                max = i
                maxValue = values[i]
            }
        }

        return {'max': max, 'keys': keys, 'values': values}
    }

	// Expande el area de la ficha para analizarlo
    localArea(pos, sizeBoard, areaExpanded) {
        var xLeft = pos[0] - areaExpanded
        var xRight = pos[0] + areaExpanded
        var yUp = pos[1] - areaExpanded
        var yDown = pos[1] + areaExpanded

        if (xLeft < 0) xLeft = 0
        if (xRight > sizeBoard - 1) xRight = sizeBoard - 1
        if (yUp < 0) yUp = 0
        if (yDown > sizeBoard - 1) yDown = sizeBoard - 1

        return [xLeft, xRight, yUp, yDown]
    }

    bestMove(board, color) {
        let opponentColor = color === 'W' ? 'B' : 'W';
        let size = board.length;
        let fallbackMove = null;

        let threeCount = 0; // Contador de líneas de 3 existentes

        for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (board[i][j] === ' ') {
                            let tempBoard = this.board.clone(board);

                            // 1. Bloquear si el oponente puede ganar
                this.board.move(tempBoard, [j, i], opponentColor);
                           if (this.board.winner(tempBoard) === opponentColor) {
                                return [j, i];
                            }

                            // 2. Ganar si hay oportunidad
                            tempBoard = this.board.clone(board);
                            this.board.move(tempBoard, [j, i], color);
                            if (this.board.winner(tempBoard) === color) {
                                return [j, i];
                            }

                            // 3. Contar cuántas líneas de 3 existen en el tablero
                            if (this.createsLine(board, [j, i], color, 3)) {
                                threeCount++;
                                if (!fallbackMove) {
                                        fallbackMove = [j, i]; // Guardamos este movimiento como opción si no encontramos algo mejor
                                }
                            }

                            // 4. Si hay suficientes líneas de 3, empezar a buscar líneas de 4
                            if (threeCount >= 2 && this.createsLine(board, [j, i], color, 4)) {
                                return [j, i]; // Prioriza formar líneas de 4 si ya hay varias de 3
                            }
                    }
                }
        }

        // Si no encontramos un movimiento crítico, jugamos el mejor intento de formar una línea de 3
        return fallbackMove || this.board.valid_moves(board)[0]; 
    }


    createsLine(board, [x, y], color, length) {
        let tempBoard = this.board.clone(board);
        this.board.move(tempBoard, [x, y], color);

        let size = board.length;
        let directions = [
                [1, 0],  // Horizontal →
                [0, 1],  // Vertical ↓
                [1, 1],  // Diagonal ↘
                [1, -1]  // Diagonal ↙
        ];

        for (let [dx, dy] of directions) {
                let count = 1;
                for (let step = 1; step < length; step++) {
                    let nx = x + dx * step, ny = y + dy * step;
                    if (nx >= 0 && nx < size && ny >= 0 && ny < size && tempBoard[ny][nx] === color) {
                            count++;
                    } else {
                            break;
                    }
                }
                for (let step = 1; step < length; step++) {
                    let nx = x - dx * step, ny = y - dy * step;
                    if (nx >= 0 && nx < size && ny >= 0 && ny < size && tempBoard[ny][nx] === color) {
                            count++;
                    } else {
                            break;
                    }
                }
                if (count >= length) return true;
        }
        return false;
    }
}