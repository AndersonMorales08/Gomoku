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

	bestMove(board, color){
		let opponentColor = color === 'W' ? 'B' : 'W';

		let blockingMove = this.findWinningMove(board, opponentColor);
		if (blockingMove) return blockingMove;
	
		let winningMove = this.findWinningMove(board, color);
		if (winningMove) return winningMove;

		let moves = this.board.valid_moves(board);
		return moves.length ? moves[0] : null;
	}

	findWinningMove(board, color) {
		let size = board.length;
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (board[i][j] === ' ') {
					let tempBoard = this.board.clone(board);
					this.board.move(tempBoard, [j, i], color);

					if (this.board.winner(tempBoard) === color) {
						return [j, i];
					}
				}
			}
		}
		return null;
	}
}