class MyAgent extends Agent{
	constructor(){
		super()
		this.board = new Board()
		this.color = null
	}

	compute(board, move_state, time){
		switch(move_state){
			case '1':
			break;
			case '2':
			break;
			case '3':
			break;
			default:
				return this.BestMove(board, this.color)
			break;
		}
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