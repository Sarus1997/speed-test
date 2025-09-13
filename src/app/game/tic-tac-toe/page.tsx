"use client";

import { useState } from "react";
import styles from "../../../scss/TicTacToe.module.scss";

type Player = "X" | "O" | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = board.slice();
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className={styles.container}>
      <h1>Tic Tac Toe</h1>
      <div className={styles.status}>
        {winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? "X" : "O"}`}
      </div>
      <div className={styles.board}>
        {board.map((_, i) => (
          <button
            key={i}
            className={styles.square}
            onClick={() => handleClick(i)}
          >
            {board[i]}
          </button>
        ))}
      </div>
      <button className={styles.reset} onClick={resetGame}>
        Restart
      </button>
    </div>
  );
}

function calculateWinner(board: Player[]): Player {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
