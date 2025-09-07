import { Request, Response } from "express";
import { GameState, Cell, Shape, Color, Combo } from "../types";
import { getIo } from "../socket";

const SHAPES: Shape[] = ["triangle", "square", "diamond", "circle"];
const COLORS: Color[] = ["red", "green", "blue", "yellow"];

const ROWS = 3;
const COLOMS = 6;

const ALL_COMBOS: Combo[] = SHAPES.flatMap((shape) =>
  COLORS.map((color) => ({ shape, color }))
);

let game: GameState | null = null;

export const getActiveMultisessionGames = (req: Request, res: Response) => {
  if (game?.gameOver === false) {
    res.status(200).json({ message: "Active multisession games", game: game });
  } else {
    res.status(404).json({ message: "No active multisession games" });
  }
};

export const createMultisessionGame = (req: Request, res: Response) => {
  const isValidPlacement = (
    gameBoard: (Cell | undefined)[][],
    rowIndex: number,
    colIndex: number,
    candidate: Combo
  ): boolean => {
    const topNeighbor =
      rowIndex > 0 ? gameBoard[rowIndex - 1][colIndex] : undefined;
    const leftNeighbor =
      colIndex > 0 ? gameBoard[rowIndex][colIndex - 1] : undefined;

    if (
      topNeighbor &&
      (topNeighbor.shape === candidate.shape ||
        topNeighbor.color === candidate.color)
    ) {
      return false;
    }

    if (
      leftNeighbor &&
      (leftNeighbor.shape === candidate.shape ||
        leftNeighbor.color === candidate.color)
    ) {
      return false;
    }

    return true;
  };

  const initBoard = (): Cell[][] => {
    const board: (Cell | undefined)[][] = Array.from({ length: ROWS }, () =>
      Array<Cell | undefined>(COLOMS).fill(undefined)
    );

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLOMS; c++) {
        let pick: Combo | null = null;

        while (!pick) {
          const candidate =
            ALL_COMBOS[Math.floor(Math.random() * ALL_COMBOS.length)];
          if (isValidPlacement(board, r, c, candidate)) {
            pick = candidate;
          }
        }

        board[r][c] = { shape: pick.shape, color: pick.color, cooldown: 0 };
      }
    }

    return board as Cell[][];
  };

  game = {
    board: initBoard(),
    score: 0,
    gameOver: false,
  };

  res.status(201).json({ message: "Multisession game created", game: game });
};

export const updateMultisessionGame = (req: Request, res: Response) => {
  const io = getIo();
  const row = Number(req.body?.row);
  const col = Number(req.body?.col);

  if (!Number.isInteger(row) || !Number.isInteger(col)) {
    return res.status(400).json({ message: "row and col must be integers" });
  }

  if (!game) {
    return res.status(404).json({ message: "No active multisession games" });
  }

  if (row < 0 || row >= ROWS || col < 0 || col >= COLOMS) {
    return res.status(400).json({ message: "Out of board bounds" });
  }

  const cell = game.board[row][col];

  if (cell.cooldown > 0) {
    return res.status(400).json({ message: "Cell is on cooldown" });
  }

  const topNeighbor = row > 0 ? game.board[row - 1][col] : undefined;
  const leftNeighbor = col > 0 ? game.board[row][col - 1] : undefined;
  const rightNeighbor = col < COLOMS - 1 ? game.board[row][col + 1] : undefined;
  const bottomNeighbor = row < ROWS - 1 ? game.board[row + 1][col] : undefined;

  const isValid = (candidate: Combo) => {
    if (
      topNeighbor &&
      (topNeighbor.shape === candidate.shape ||
        topNeighbor.color === candidate.color)
    )
      return false;
    if (
      leftNeighbor &&
      (leftNeighbor.shape === candidate.shape ||
        leftNeighbor.color === candidate.color)
    )
      return false;
    if (
      rightNeighbor &&
      (rightNeighbor.shape === candidate.shape ||
        rightNeighbor.color === candidate.color)
    )
      return false;
    if (
      bottomNeighbor &&
      (bottomNeighbor.shape === candidate.shape ||
        bottomNeighbor.color === candidate.color)
    )
      return false;
    return true;
  };

  let chosen: Combo | null = null;
  for (const candidate of ALL_COMBOS) {
    if (
      isValid(candidate) &&
      candidate.shape !== game.board[row][col].shape &&
      candidate.color !== game.board[row][col].color
    ) {
      chosen = candidate;
      break;
    }
  }

  if (!chosen) {
    game.gameOver = true;
    if (io) {
      io.emit("state", game);
    }
    return res
      .status(400)
      .json({ message: "No valid combination for this cell", game });
  }

  for (const r of game.board) {
    for (const c of r) {
      if (c.cooldown > 0) c.cooldown--;
    }
  }

  game.board[row][col] = {
    shape: chosen.shape,
    color: chosen.color,
    cooldown: 3,
  };

  game.score++;

  if (io) {
    io.emit("state", game);
  }

  return res.status(200).json({ message: "Multisession game updated", game });
};
