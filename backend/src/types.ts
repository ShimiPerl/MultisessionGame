export type Shape = "triangle" | "square" | "diamond" | "circle";
export type Color = "red" | "green" | "blue" | "yellow";

export interface Cell {
  shape: Shape;
  color: Color;
  cooldown: number; 
}

export interface GameState {
  board: Cell[][];
  score: number;
  gameOver: boolean;
}

export interface Combo {
  shape: Shape;
  color: Color;
}