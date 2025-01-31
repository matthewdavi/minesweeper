import { createContext, useState, useContext } from "react";

export type CELL_STATE = "INITIAL" | "OPENED" | "FLAGGED";

export type CELL_VALUE = number | "BOMB";

export const GRID_SIZE = 9;

interface Cell {
  state: CELL_STATE;
  value: CELL_VALUE;
}

export interface GameState {
  grid: Cell[][];
  revealCell: (row: number, col: number) => void;
  flagCell: (row: number, col: number) => void;
  resetGame: () => void;
  isGameOver: boolean;
  isGameWon: boolean;
}

export const MinesweeperContext = createContext<GameState | undefined>(
  undefined
);

export function useMinesweeperContext() {
  const context = useContext(MinesweeperContext);
  if (context === undefined) {
    throw new Error(
      "useMinesweeperContext must be used within a MinesweeperProvider"
    );
  }
  return context;
}

export function createGrid(size: number = GRID_SIZE): Cell[][] {
  const initialPass = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      state: "INITIAL",
      value: Math.random() < 0.2 ? "BOMB" : 0,
    }))
  );

  const gridWithAdjacentBombsCalculated = initialPass.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      if (cell.value === "BOMB") {
        return { value: "BOMB", state: "INITIAL" };
      }
      let adjacentBombCount = 0;
      // one square above
      if (initialPass[rowIndex - 1]?.[colIndex]?.value === "BOMB") {
        adjacentBombCount++;
      }
      // one square below
      if (initialPass[rowIndex + 1]?.[colIndex]?.value === "BOMB") {
        adjacentBombCount++;
      }
      // one square to the left
      if (initialPass[rowIndex]?.[colIndex - 1]?.value === "BOMB") {
        adjacentBombCount++;
      }
      // one square to the right
      if (initialPass[rowIndex]?.[colIndex + 1]?.value === "BOMB") {
        adjacentBombCount++;
      }
      // top left
      if (initialPass[rowIndex - 1]?.[colIndex - 1]?.value === "BOMB") {
        adjacentBombCount++;
      }
      // top right
      if (initialPass[rowIndex - 1]?.[colIndex + 1]?.value === "BOMB") {
        adjacentBombCount++;
      }
      // bottom left
      if (initialPass[rowIndex + 1]?.[colIndex - 1]?.value === "BOMB") {
        adjacentBombCount++;
      }
      // bottom right
      if (initialPass[rowIndex + 1]?.[colIndex + 1]?.value === "BOMB") {
        adjacentBombCount++;
      }
      return { value: adjacentBombCount, state: "INITIAL" };
    })
  );

  return gridWithAdjacentBombsCalculated as Cell[][];
}

export function deepCloneGrid(grid: Cell[][]): Cell[][] {
  return JSON.parse(JSON.stringify(grid)) as Cell[][];
}

export function recursivelyRevealAdjacentCellsWithValueZero(
  grid: Cell[][],
  row: number,
  col: number
) {
  if (!grid[row]?.[col]) {
    return;
  }
  grid[row][col].state = "OPENED";
  if (grid[row][col].value !== 0) {
    return grid;
  }
  // one square above
  if (grid[row - 1]?.[col]?.state !== "OPENED") {
    recursivelyRevealAdjacentCellsWithValueZero(grid, row - 1, col);
  }
  // one square below
  if (grid[row + 1]?.[col]?.state !== "OPENED") {
    recursivelyRevealAdjacentCellsWithValueZero(grid, row + 1, col);
  }

  // one square left
  if (grid[row]?.[col - 1]?.state !== "OPENED") {
    recursivelyRevealAdjacentCellsWithValueZero(grid, row, col - 1);
  }
  // one square right
  if (grid[row]?.[col + 1]?.state !== "OPENED") {
    recursivelyRevealAdjacentCellsWithValueZero(grid, row, col + 1);
  }

  // bottom left
  if (grid[row + 1]?.[col - 1]?.state !== "OPENED") {
    recursivelyRevealAdjacentCellsWithValueZero(grid, row + 1, col - 1);
  }
  // bottom right
  if (grid[row + 1]?.[col + 1]?.state !== "OPENED") {
    recursivelyRevealAdjacentCellsWithValueZero(grid, row + 1, col + 1);
  }

  // top left
  if (grid[row - 1]?.[col - 1]?.state !== "OPENED") {
    recursivelyRevealAdjacentCellsWithValueZero(grid, row - 1, col - 1);
  }
  // top right
  if (grid[row - 1]?.[col + 1]?.state !== "OPENED") {
    recursivelyRevealAdjacentCellsWithValueZero(grid, row - 1, col + 1);
  }
  return grid;
}

export function MinesweeperProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [grid, setGrid] = useState(() => createGrid());
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  function revealCell(row: number, col: number) {
    setGrid((oldGrid) => {
      const newGrid = deepCloneGrid(oldGrid);
      const cell = newGrid[row][col];
      if (cell.state === "OPENED") {
        return newGrid;
      }
      recursivelyRevealAdjacentCellsWithValueZero(newGrid, row, col);
      if (cell.value === "BOMB") {
        setIsGameOver(true);
        return newGrid;
      }
      let isGameWon = true;
      for (const row of newGrid) {
        for (const cell of row) {
          if (cell.value !== "BOMB" && cell.state !== "OPENED") {
            isGameWon = false;
            break;
          }
        }
      }
      setIsGameWon(isGameWon);

      return newGrid;
    });
  }

  function flagCell(row: number, col: number) {
    setGrid((oldGrid) => {
      const newGrid = deepCloneGrid(oldGrid);
      const cell = newGrid[row][col];
      cell.state = cell.state === "FLAGGED" ? "INITIAL" : "FLAGGED";
      return newGrid;
    });
  }

  function resetGame() {
    console.log("resetGame");
  }

  return (
    <MinesweeperContext.Provider
      value={{ grid, revealCell, flagCell, resetGame, isGameOver, isGameWon }}
    >
      {children}
    </MinesweeperContext.Provider>
  );
}
