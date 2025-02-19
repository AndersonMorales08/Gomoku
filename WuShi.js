class WuShi extends Agent {
    constructor () {
        super()
        this.board = new Board()
        this.color = null
        this.whites = []
        this.blacks = []
    }

    compute(board, move_state, time) {
        var sizeBoard = board.length
        var moves = this.board.valid_moves(board)
        console.log(move_state)
        switch (move_state) {
            case '1':
                var initSizeMove = sizeBoard - 2 
                var initValidMoves = moves.filter((move) => (move[0] <= initSizeMove && move[0] >= 1 && move[1] <= initSizeMove && move[1] >= 1));
                var match = false

                var blackPos1 = Math.floor(initValidMoves.length * Math.random())
                var blackPos2 = Math.floor(initValidMoves.length * Math.random())
                var whitePos = Math.floor(initValidMoves.length * Math.random())
                
                for (var i = 0; i < 3; i++) {
                    if (blackPos1 !== whitePos && blackPos2 !== whitePos && blackPos1 !== blackPos2) {
                        match = this.verifyGoodMove(initValidMoves[blackPos1], initValidMoves[blackPos2])
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

                if(!this.verifyGoodMove(this.blacks[0], this.blacks[1])) {
                    this.color = 'B'
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

                    var diffLeft = Math.abs(0 - xLeft) 
                    var diffRight= Math.abs((sizeBoard - 1) - xRight)
                    var diffUp = Math.abs(0 - yUp) 
                    var diffDown = Math.abs((sizeBoard - 1) - yDown)
                    
                    var newCoor = [xLeft, xRight, yUp, yDown]
                    var diffList = [diffLeft, diffRight, diffUp, diffDown]

                    var varIndexMax = this.maxCross(diffList)
                    var isValid = []

                    for (var i = 0; i < diffList.length; i++) {
                        if (varIndexMax === 0 || varIndexMax === 1) {
                            isValid = moves.filter((move) => (move[0] === newCoor[varIndexMax] && move[1] === whitePosBrd[1]))
                        } else {
                            isValid = moves.filter((move) => (move[0] === whitePosBrd[0] && move[1] === newCoor[varIndexMax]))
                        }

                        if (isValid.length > 0) {
                            break;
                        }
                    }
                    this.color = 'W'
                    return isValid[0]
                } else {
                    var blackPos = Math.floor(initValidMoves.length * Math.random())
                    var whitePos = Math.floor(initValidMoves.length * Math.random())

                    var matchBlack = false
                    var matchWhite = false

                    for (var i = 0; i < 3; i++) {
                        if (blackPos !== whitePos) {
                            for (var j = 0; j < this.blacks.length; j++) {
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
                     currentBlack = analysisBlack['density'] + analysisBlack['maxInLine']['value']

                     if(currentBlack > maxBlack) {
                        maxBlack = currentBlack
                     }
                }

                for (var i = 0; i < this.whites.length; i++) {
                    analysiswhite = this.localAnalysis(this.whites[i], brd, "W", sizeBoard)
                    currentWhite = analysiswhite['density'] + analysiswhite['maxInLine']['value']

                     if(currentWhite > maxWhite) {
                        maxWhite = currentWhite
                     }
                }

                if (maxBlack > maxWhite) { 
                    this.color = 'B'
                    return 'BLACK'
                } else {
                    this.color = 'W'
                    return this.bestMove(board, this.color)
                }
            break;
            default:
                this.color = move_state
                return this.bestMove(board, this.color)
			break;
        }
    }

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
                    } else if (j === pos[0]) {
                        inLinePieces['ver'] += 1
                    } else if (i === pos[1]) {
                        inLinePieces['hor'] += 1
                    } else if (Math.abs(j - pos[0]) === Math.abs(i - pos[1])) {
                        if ((j < pos[0] && i < pos[1]) || (j > pos[0] && i > pos[1])) {
                            inLinePieces['ltrbDiag'] += 1
                        } else if ((j < pos[0] && i > pos[1]) || (j > pos[0] && i < pos[1])) {
                            inLinePieces['rtlbDiag'] += 1
                        }
                    }

                    density += 1
                } else if (brd[i][j] !== ' ') {
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
        console.log('Color: ', color)
        console.log('OponentColor: ', opponentColor)
    	let size = board.length;
    	let center = Math.floor(size / 2);
    	let fallbackMove = null;
    	let bestScore = -Infinity; // Guardará la mejor puntuación encontrada

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
                		}

                		// 4. Si hay suficientes líneas de 3, priorizar crear líneas de 4
                		if (threeCount >= 2 && this.createsLine(board, [j, i], color, 4)) {
                    			return [j, i];
                		}

                		// 5. Evaluar si este es el mejor movimiento de respaldo (más cerca del centro)
                		let score = this.distanceFromCenter(j, i, center);
                		if (score > bestScore) {
                    			bestScore = score;
                    			fallbackMove = [j, i];
                		}
            		}
        	}
    	}

    	// Si no hay un movimiento claro, jugar el más cercano al centro
    	return fallbackMove || this.board.valid_moves(board)[0];
    }

    distanceFromCenter(x, y, center) {
    	return -((x - center) ** 2 + (y - center) ** 2); // Mientras más negativo, más lejos del centro
    }

    createsLine(board, [x, y], color, n) {
    	const directions = [
        	[1, 0],  // → Horizontal
        	[0, 1],  // ↓ Vertical
        	[1, 1],  // ↘ Diagonal principal
        	[-1, 1]  // ↙ Diagonal secundaria
    	];

    	for (const [dx, dy] of directions) {
        	let count = 1;  // Cuenta la pieza que colocaremos en (x, y)

        	// Recorre en una dirección (positiva)
        	let i = 1;
        	while (this.isValid(board, x + i * dx, y + i * dy) && board[y + i * dy][x + i * dx] === color) {
            		count++;
            		i++;
        	}

        	// Recorre en la dirección opuesta (negativa)
        	i = 1;
        	while (this.isValid(board, x - i * dx, y - i * dy) && board[y - i * dy][x - i * dx] === color) {
            		count++;
            		i++;
        	}

        	// Si encontramos la cantidad de piezas necesarias, retorna true
        	if (count >= n) {
            		return true;
        	}
    	}

    	return false;
    }

    isValid(board, x, y) {
    	return x >= 0 && y >= 0 && x < board.length && y < board.length;
    }
}