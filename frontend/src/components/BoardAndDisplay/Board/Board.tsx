import React from "react";
import { Cell } from "../../../types";
import styles from "./Board.module.css";

interface BoardProps {
  board: Cell[][];
  gameOver: boolean;
  handleCellClick: (rowIndex: number, colIndex: number) => void;
}

const Board = ({ board, gameOver, handleCellClick }: BoardProps) => {
  if (gameOver === true) {
    return <div className={styles.gameOver}>Game Over</div>;
  }

  const getShapeSymbol = (shape: string) => {
    switch (shape) {
      case "triangle":
        return "▲";
      case "square":
        return "■";
      case "diamond":
        return "♦";
      case "circle":
        return "●";
      default:
        return "?";
    }
  };

  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`${styles.cell} ${styles[`cell-${cell.color}`]} ${
              styles[`cell-${cell.shape}`]
            }`}
            style={{
              backgroundColor: cell.color,
              opacity: cell.cooldown > 0 ? 0.5 : 1,
            }}
          >
            <div
              className={styles.shapeSymbol}
              onClick={
                cell.cooldown === 0
                  ? () => handleCellClick(rowIndex, colIndex)
                  : () => alert("Cooldown is not 0")
              }
            >
              {getShapeSymbol(cell.shape)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
