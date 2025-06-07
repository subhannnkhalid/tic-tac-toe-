import React, { useState, useEffect } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameCount, setGameCount] = useState({ x: 0, o: 0, draws: 0 });

  // Check for winner
  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  // Check if board is full
  const isBoardFull = (squares) => {
    return squares.every(square => square !== null);
  };

  // Handle square click
  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  // Reset scores
  const resetScores = () => {
    setGameCount({ x: 0, o: 0, draws: 0 });
  };

  // Check for winner or draw after each move
  useEffect(() => {
    const gameWinner = checkWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameCount(prev => ({
        ...prev,
        [gameWinner.toLowerCase()]: prev[gameWinner.toLowerCase()] + 1
      }));
    } else if (isBoardFull(board) && !gameWinner) {
      setWinner('draw');
      setGameCount(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  }, [board]);

  // Square component
  const Square = ({ value, onClick, isWinning }) => (
    <button
      className={`
        w-20 h-20 border-2 border-gray-600 bg-gray-100 hover:bg-gray-200 
        text-4xl font-bold transition-all duration-200 
        ${isWinning ? 'bg-green-200 border-green-500' : ''}
        ${value === 'X' ? 'text-blue-600' : 'text-red-600'}
        disabled:cursor-not-allowed
      `}
      onClick={onClick}
      disabled={value !== null || winner !== null}
    >
      {value}
    </button>
  );

  // Get status message
  const getStatus = () => {
    if (winner === 'draw') return "It's a draw! 🤝";
    if (winner) return `Player ${winner} wins! 🎉`;
    return `Next player: ${isXNext ? 'X' : 'O'}`;
  };

  // Get winning squares for highlighting
  const getWinningSquares = () => {
    if (!winner || winner === 'draw') return [];
    
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return lines[i];
      }
    }
    return [];
  };

  const winningSquares = getWinningSquares();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tic Tac Toe</h1>
          <p className="text-gray-600">Classic game for two players</p>
        </div>

        {/* Score Board */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-center mb-3">Score Board</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">X</div>
              <div className="text-lg font-semibold">{gameCount.x}</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="text-xl font-bold text-gray-600">Draws</div>
              <div className="text-lg font-semibold">{gameCount.draws}</div>
            </div>
            <div className="bg-red-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">O</div>
              <div className="text-lg font-semibold">{gameCount.o}</div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6">
          <div className={`
            text-xl font-semibold py-3 px-6 rounded-lg
            ${winner === 'draw' ? 'bg-yellow-100 text-yellow-800' : 
              winner ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
          `}>
            {getStatus()}
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {board.map((square, index) => (
              <Square
                key={index}
                value={square}
                onClick={() => handleClick(index)}
                isWinning={winningSquares.includes(index)}
              />
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            New Game
          </button>
          <button
            onClick={resetScores}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Reset Scores
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;