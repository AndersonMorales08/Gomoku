class Agent{
    constructor(){}
    
    /**
     * Determines the movement to play
     *  @param board A character matrix with the current board configuration
     *  @param move_state A character indicating the movement to realize:
     *      '1' : Agent has to play the first move by placing two black and one white pieces. 
     *            Must return an array [[x1,y1], [x2,y2], [x3,y3]] with the positions of the 2 black pieces
     *            followed by the position of the white piece (in such order) 
     *      '2' : Agent has to play the second movement. It must be one of the following options
     *           (i) Play with black so must return a 'BLACK' message.
     *           (ii) Play one white piece and continue playing with white pieces. 
     *                Must return the position to play [x,y]
     *           (iii) Place two pieces one white and one black. Must return an array [[x1,y1], [x2,y2]]
     *                 with the positions of the white and black pieces (in such order) 
     *      '3' : Agent has to decide if play with whites or black pieces, If agent decides to play with 
     *            white must to play a white piece, i.e., must return a position [x,y] for placing that
     *            piece. If agent decides to play with black pieces must return a 'BLACK' message.
     *      'W' : The agent must play a white movement, i.e., must return a position [x,y] for a white piece.
     *            The first time recieving this message will indicate to the agent that its color is white for 
     *            the entire game.
     *      'B' : The agent must play a black movement, i.e., must return a position [x,y] for a black piece.
     *            The first time recieving this message will indicate to the agent that its color is black for 
     *            the entire game.
     *  @param time An array with the agent's remaining time
     */                              
    compute( board, move_state, time ){ return 0 }
}

/*
 * A class for board operations (it is not the board but a set of operations over it)
 */
class Board{
    constructor(){}

    // Initializes a board of the given size. A board is a matrix of size*size of characters ' ', 'B', or 'W'
    init(size){
        var board = []
        for(var i=0; i<size; i++){
            board[i] = []
            for(var j=0; j<size; j++)
                board[i][j] = ' '
        }
        return board
    }

    // Deep clone of a board for reducing the risk of damaging the real board
    clone(board){
        var size = board.length
        var b = []
        for(var i=0; i<size; i++){
            b[i] = []
            for(var j=0; j<size; j++)
                b[i][j] = board[i][j]
        }
        return b
    }

    // Determines if a piece can be set at row y, column x
    check(board, x, y){
        return (board[y][x]==' ')
    }

    // Computes all the valid moves for the given 'color'
    valid_moves(board){
        var moves = []
        var size = board.length
        for( var i=0; i<size; i++)
            for( var j=0; j<size; j++)
                if(this.check(board, j, i)) moves.push([j,i])
        return moves
    }

    // Computes the new board when a piece of 'color' is set at column 'j'
    // If it is an invalid movement stops the game and declares the other 'color' as winner
    move(board, pos, color){
        var size = board.length
        var i = pos[1]
        var j = pos[0]
        if(board[i][j]!=' ') return false
        board[i][j] = color
        return true
    }

    // Determines the winner of the game if available 'W': white, 'B': black, ' ': none
    winner(board){
        var k = 5
        var size = board.length
        for( var i=0; i<size; i++){
            for(var j=0; j<size; j++){
                var p = board[i][j]
                if(p!=' '){
                    if(j+k<=size && i+k<=size){                        
                        var c = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j+h]==p) c++
                        if(c==k) return p
                    }
                    if(j+1>=k && i+k<=size){                        
                        var c = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j-h]==p) c++
                        if(c==k) return p

                    }
                    if(j+k<=size){                        
                        var c = 1
                        for(var h=1;h<k; h++)
                            if(board[i][j+h]==p) c++
                        if(c==k) return p

                    }
                    if(i+k<=size){
                        var c = 1
                        for(var h=1;h<k; h++)
                            if(board[i+h][j]==p) c++
                            else break;
                        if(c==k) return p
                    }
                }
            }
        }      
        return ''
    }

    // Draw the board on the canvas
    print(board){
        var size = board.length
        // Commands to be run (left as string to show them into the editor)
        var grid = []
        for(var i=0; i<size; i++){
            for(var j=0; j<size; j++)
                grid.push({"command":"translate", "y":i, "x":j, "commands":[{"command":"-"}, {"command":board[i][j]}]})
        }

	    var commands = {"r":true,"x":1.0/size,"y":1.0/size,"command":"fit", "commands":grid}
        Konekti.client['canvas'].setText(commands)
    }
}

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
        let bestMoves = []
        let scoreMoves = []

    	let threeCount = 0; // Contador de líneas de 3 existentes

    	for (let i = 0; i < size; i++) {
        	for (let j = 0; j < size; j++) {
                if (board[i][j] === ' ') {
                    let tempBoard = this.board.clone(board);

                    // 1. Bloquear si el oponente puede ganar
                    this.board.move(tempBoard, [j, i], opponentColor);
                    if (this.board.winner(tempBoard) === opponentColor) {
                        bestMoves.push([j, i])
                        scoreMoves.push(8)	
                        // return [j, i];
                    }

                    // 2. Ganar si hay oportunidad
                    tempBoard = this.board.clone(board);
                    this.board.move(tempBoard, [j, i], color);
                    if (this.board.winner(tempBoard) === color) {
                        bestMoves.push([j, i])
                        scoreMoves.push(10)	
                        // return [j, i];
                    }

                    if (this.createsLine(board, [j, i], opponentColor, 4)) {
                        bestMoves.push([j, i])
                        scoreMoves.push(7)	
                    }

                    // 3. Contar cuántas líneas de 3 existen en el tablero
                    if (this.createsLine(board, [j, i], color, 3)) {
                            threeCount++;
                    }

                    // 4. Si hay suficientes líneas de 3, priorizar crear líneas de 4
                    if (threeCount >= 2 && this.createsLine(board, [j, i], color, 4)) {
                        bestMoves.push([j, i])
                        scoreMoves.push(6)	
                        // return [j, i];
                    }

                    // 5. Evaluar si este es el mejor movimiento de respaldo (más cerca del centro)
                    let score = this.distanceFromCenter(j, i, center);
                    console.log(score)
                    if (score > bestScore) {
                            bestScore = score;
                            fallbackMove = [j, i];
                    }
                }
        	}
    	}

        bestMoves.push(fallbackMove)
        scoreMoves.push(4)

        let bestMovement = this.maxCross(scoreMoves)

    	// Si no hay un movimiento claro, jugar el más cercano al centro
    	return bestMoves[bestMovement] || this.board.valid_moves(board)[0];
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

    playNow(brd, color, sizeBoard) {
        var pieces = {}
        if (color === "W") {
            pieces = this.piecesInLocalArea(this.whites, brd, color, sizeBoard)
        } else if (color === "B") {
            pieces = this.piecesInLocalArea(this.blacks, brd, color, sizeBoard)
        }
        console.log(color)
        if (color === 'W') {
            console.log(this.whites)
        } else {
            console.log(this.blacks)
        }
        console.log(pieces)
    }

    piecesInLocalArea(pieces, brd, color, sizeBoard) {
        var blacksPos = []
        var whitesPos = []
        var localAreaPos = []
        var pos = []
        for (var k = 0; k < pieces.length; k++) {
            var inLinePieces1 = {'hor': [], 'ver': [], 'ltrbDiag': [], 'rtlbDiag': []}
            var inLinePieces2 = {'hor': [], 'ver': [], 'ltrbDiag': [], 'rtlbDiag': []}

            pos = pieces[k]
            localAreaPos = this.localArea(pos, sizeBoard, 3)

            for (var i = localAreaPos[2]; i <= localAreaPos[3]; i++) {
                for (var j = localAreaPos[0]; j <= localAreaPos[1]; j++) {
                    if (brd[i][j] === color) {
                        if (j === pos[0] && i === pos[1]) {
                            
                        } else if (j === pos[0]) {
                            inLinePieces1['ver'].push([j, i])
                        } else if (i === pos[1]) {
                            inLinePieces1['hor'].push([j, i])
                        } else if (Math.abs(j - pos[0]) === Math.abs(i - pos[1])) {
                            if ((j < pos[0] && i < pos[1]) || (j > pos[0] && i > pos[1])) {
                                inLinePieces1['ltrbDiag'].push([j, i])
                            } else if ((j < pos[0] && i > pos[1]) || (j > pos[0] && i < pos[1])) {
                                inLinePieces1['rtlbDiag'].push([j, i])
                            }
                        }
                    } else if (brd[i][j] !== ' ') {
                        if (j === pos[0]) {
                            inLinePieces2['ver'].push([j, i])
                        } else if (i === pos[1]) {
                            inLinePieces2['hor'].push([j, i]) 
                        } else if (Math.abs(j - pos[0]) === Math.abs(i - pos[1])) {
                            if ((j < pos[0] && i < pos[1]) || (j > pos[0] && i > pos[1])) {
                                inLinePieces2['ltrbDiag'].push([j, i])
                            } else if ((j < pos[0] && i > pos[1]) || (j > pos[0] && i < pos[1])) {
                                inLinePieces2['rtlbDiag'].push([j, i])
                            }
                        }
                    }
                }
            }

            if (color === 'W') {
                whitesPos.push(inLinePieces1)
                blacksPos.push(inLinePieces2)
            } else if (color === 'B') {
                whitesPos.push(inLinePieces2)
                blacksPos.push(inLinePieces1)
            }
        }

        return {'whitesPos': whitesPos, 'blacksPos': blacksPos}
    }
}

/*
 * Player's Code (Must inherit from Agent) 
 * This is an example of a rangom player agent
 */
class RandomPlayer extends Agent{
    constructor(){ 
        super() 
        this.board = new Board()
    }

    compute(board, move_state, time){
        for(var i=0; i<200000000; i++){} // Making it very slow to test time restriction
        for(var i=0; i<200000000; i++){} // Making it very slow to test time restriction
        var moves = this.board.valid_moves(board)
        var index1, index2, index3
        var r
        switch(move_state){
            case '1':
                index1 = Math.floor(moves.length * Math.random())
                index2 = index1 
                while(index1==index2){
                    index2 = Math.floor(moves.length * Math.random())
                }
                index3 = index1
                while(index3==index1 || index3==index2){
                    index3 = Math.floor(moves.length * Math.random())
                }
                return [moves[index1], moves[index2], moves[index3]]
            break;
            case '2':
                r = Math.random()
                // if(r<0.9999933333) return 'BLACK'
                // if(r<0.66666){
                //     index1 = Math.floor(moves.length * Math.random())
                //     return moves[index1]
                // }
                index1 = Math.floor(moves.length * Math.random())
                index2 = index1 
                while(index1==index2){
                    index2 = Math.floor(moves.length * Math.random())
                }
                return [moves[index1], moves[index2]]
            break;
            case '3':
                r = Math.random()
                if(r<0.0000005) return 'BLACK'
                index1 = Math.floor(moves.length * Math.random())
                return moves[index1]
            break;
            default:
                index1 = Math.floor(moves.length * Math.random())
                return moves[index1]
            break;
        }
    }
}

/*
 * Environment (Cannot be modified or any of its attributes accesed directly)
 */
class Environment extends MainClient{
	constructor(){ 
        super()
        this.board = new Board()
    }

    setPlayers(players){ this.players = players }

	// Initializes the game 
	init(){ 
        var white = Konekti.vc('W').value // Name of competitor with white pieces
        var black = Konekti.vc('B').value // Name of competitor with black pieces
        var time = 1000*parseInt(Konekti.vc('time').value) // Maximum playing time assigned to a competitor (milliseconds)
        var size = parseInt(Konekti.vc('size').value) // Size of the reversi board
 
        this.size = size
        this.rb = this.board.init(size)
 
        var b1 = this.board.clone(this.rb)
        var b2 = this.board.clone(this.rb)

        this.white = white
        this.black = black
        this.ptime = {'W':time, 'B':time}
        Konekti.vc('W_time').innerHTML = ''+time
        Konekti.vc('B_time').innerHTML = ''+time
        this.winner = ''
        this.state = '1' 
    }

    // Listen to play button 
	play(){ 
        var TIME = 50
        var x = this
        var board = x.board
        Konekti.vc('log').innerHTML = 'The winner is...'

        x.init()
        var start = -1

        function clock(){
            if(x.winner!='') return
            if(start==-1) setTimeout(clock,TIME)
            else{
                var end = Date.now()
                var ellapsed = end - start
                var remaining = x.ptime[x.player] - ellapsed
                Konekti.vc(x.player+'_time').innerHTML = remaining
                Konekti.vc((x.player=='W'?'B':'W')+'_time').innerHTML = x.ptime[x.player=='W'?'B':'W']
                
                if(remaining <= 0) x.winner = (x.player=='W'?x.black:x.white) + ' since ' + (x.player=='W'?x.white:x.black) + 'got time out'
                else setTimeout(clock,TIME) 
            }
        }

        function swap(color){
            Konekti.vc('W').value = x.black
            Konekti.vc('B').value = x.white
            var tmp = x.black
            x.black = x.white
            x.white = tmp
            tmp = x.ptime.W
            x.ptime.W = x.ptime.B
            x.ptime.B = tmp
            tmp = Konekti.vc('W_time').innerHTML
            Konekti.vc('W_time').innerHTML = Konekti.vc('B_time').innerHTML
            Konekti.vc('B_time').innerHTML = tmp
            x.state = color
        }

        function get(player, board, state){
            var oplayer = player == x.black?x.white:x.black
            var P = player == x.black?'B':'W'
            var O = player == x.black?'W':'B'
            var time = x.ptime[P]
            start = Date.now()
            var action = x.players[player].compute(board, state, time)
            var end = Date.now()
            time  -= (end - start)
            x.ptime[P] = time
            Konekti.vc(P+'_time').innerHTML = time
            if(time <= 0){
                x.winner = oplayer + ' since ' + player + ' got run of time'
                action = null
            }else{
                switch(state){
                    case '1':
                        if(!Array.isArray(action) || action.length != 3){
                            x.winner = oplayer + ' since ' + player + ' produces wrong answer'
                            action = null
                        }
                    break;
                    case '2':
                    case '3':
                        if(!((Array.isArray(action) && action.length >= 1 && action.length <= 2) || action=='BLACK')){
                            x.winner = oplayer + ' since ' + player + ' produces wrong answer'
                            action = null
                        }
                    break;
                    default:
                        if(!Array.isArray(action) || action.length != 2){
                            x.winner = oplayer + ' since ' + player + ' produces wrong answer'
                            action = null
                        }
                    break;
                }
            }
            return action
        }
        
        function compute(){
            var b = board.clone(x.rb)
            var action
            switch(x.state){
                case '1':
                    action = get(x.black, b, '1')
                    if(action != null)
                        for( var i=0; i<3; i++ ){
                            if(!board.move(x.rb, action[i], i<2?'B':'W')){
                                x.winner = x.white + ' ...Invalid move taken by ' + x.black + ' on position ' + action[i][0] + ',' +action[i][1] 
                            }
                        }
                    if(x.winner == '') x.state = '2'
                break;    
                case '2':
                    action = get(x.white, b, '2')
                    if(action == 'BLACK'){
                        swap('W')
                        x.state = 'W'
                    }else{
                        if(action != null){
                            if(typeof action[0] == 'number'){
                                if(!board.move(x.rb, action, 'W')){
                                    x.winner = x.black + ' ...Invalid move taken by ' + x.white + ' on position ' + action[i][0] + ',' +action[i][1] 
                                }
                                x.state = 'B'
                            }else{
                                for( var i=0; i<2; i++ ){
                                    if(!board.move(x.rb, action[i], i<1?'W':'B')){
                                        x.winner = x.black + ' ...Invalid move taken by ' + x.white + ' on position ' + action[i][0] + ',' +action[i][1] 
                                    }
                                }
                                x.state = '3'
                            }
                        }
                    }
                break;
                case '3':
                    action = get(x.black, b, '3')
                    if(action == 'BLACK') x.state = 'W'
                    else{
                        if(action != null && board.move(x.rb, action, 'W')) swap('B')
                        else{ 
                            x.winner = x.white + ' ...Invalid move taken by ' + x.black + ' on position ' + action[0] + ',' + action[1] 
                        }
                    }                    
                break;
                default:
                    var P = x.state
                    var O = (P=='W')?'B':'W'
                    var action = get(P=='W'?x.white:x.black, b, P)
                    if(action != null){
                        var flag = board.move(x.rb, action, P)
                        if(!flag){
                            x.winner = O + ' ...Invalid move taken by ' + P + ' on column ' +  + action[0] + ',' +action[1] 
                        }else{
                            var winner = board.winner(x.rb)
                            if(winner!= '') x.winner = winner=='W'?x.white:x.black
                            else{
                                x.state = O
                            }    
                        }                    
                    }
            }
            board.print(x.rb)
            start = -1
            if(x.winner=='') setTimeout(compute,TIME)
            else Konekti.vc('log').innerHTML = 'The winner is ' + x.winner
        }

        board.print(x.rb)
        setTimeout(clock, 1000)
        setTimeout(compute, 1000)
    }
}

// Drawing commands
function custom_commands(){
    return [
        { 
            "command":" ", "commands":[
                {
                    "command":"fillStyle",
                    "color":{"red":255, "green":255, "blue":255, "alpha":255}
                },
                {
                    "command":"polygon",
                    "x":[0.2,0.2,0.8,0.8],
                    "y":[0.2,0.8,0.8,0.2]
                }

            ]},
        { 
            "command":"-", 
            "commands":[
                {
                    "command":"strokeStyle",
                    "color":{"red":0, "green":0, "blue":0, "alpha":255}
                },
                {
                    "command":"polyline",
                    "x":[0,0,1,1,0],
                    "y":[0,1,1,0,0]
                }
            ]
        },
        {
            "command":"B",
            "commands":[
                {
                    "command":"fillStyle",
                    "color":{"red":0, "green":0, "blue":0, "alpha":255}
                },
                {
                    "command":"polygon",
                    "x":[0.2,0.2,0.8,0.8],
                    "y":[0.2,0.8,0.8,0.2]
                }
            ]
        },  
        {
            "command":"W",
            "commands":[
                {
                    "command":"fillStyle",
                    "color":{"red":255, "green":255, "blue":0, "alpha":255}
                },
                {
                    "command":"polygon",
                    "x":[0.2,0.2,0.8,0.8],
                    "y":[0.2,0.8,0.8,0.2]
                },
            ]
        }
    ] 
}