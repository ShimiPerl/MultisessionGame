import React from "react";
import { GameState } from "../../types";
import Board from "./Board/Board";
import Score from "./Score/Score";
import styles from "./BoardAndDisplay.module.css";

interface BoardAndDisplayProps extends GameState {
  handleCellClick: (rowIndex: number, colIndex: number) => void;
  handleGameOver: () => void;
}

const BoardAndDisplay = ({
  board,
  score,
  gameOver,
  handleCellClick,
  handleGameOver,
}: BoardAndDisplayProps) => {
  if (gameOver === false) {
    return (
      <div className={styles.container}>
        <div className={styles.boardSection}>
          <Board
            board={board}
            gameOver={gameOver}
            handleCellClick={handleCellClick}
          />
        </div>
        <div className={styles.scoreSection}>
          <Score score={score} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.boardSection}>
        <Board
          board={board}
          gameOver={gameOver}
          handleCellClick={handleCellClick}
        />
      </div>
      <div className={styles.scoreSection}>
        <Score score={score} />
        <button onClick={handleGameOver}>Game Over</button>
      </div>
    </div>
  );
};

export default BoardAndDisplay;
