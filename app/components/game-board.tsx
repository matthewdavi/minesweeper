import { useMinesweeperContext, type CELL_VALUE } from "./minesweeper-context";

import { GameTimer } from "./game-timer";

export function GameBoard() {
  const { grid, flagCell, revealCell } = useMinesweeperContext();
  const numberOfBombs = grid
    .flat()
    .filter((cell) => cell.value === "BOMB").length;

  const numberOfFlaggedCells = grid
    .flat()
    .filter((cell) => cell.state === "FLAGGED").length;
  const numberOfBombsRemaining = numberOfBombs - numberOfFlaggedCells;
  return (
    <div>
      <div className="flex flex-row w-full justify-between">
        <GameTimer />
        <div className="text-red-500">{numberOfBombsRemaining}</div>{" "}
      </div>
      {grid.map((row, rowIndex) => (
        <div style={{ display: "flex", flexDirection: "row" }} key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <button
              key={cellIndex}
              style={{
                width: 30,
                height: 30,
                border: "2px solid white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                revealCell(rowIndex, cellIndex);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                flagCell(rowIndex, cellIndex);
              }}
            >
              {cell.state === "OPENED" ? <OpenCell value={cell.value} /> : null}
              {cell.state === "FLAGGED" ? (
                <div style={{ width: 30, height: 30 }}>🚩</div>
              ) : null}

              {cell.state === "INITIAL" ? (
                <div
                  style={{ backgroundColor: "gray", width: 30, height: 30 }}
                />
              ) : null}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function OpenCell({ value }: { value: CELL_VALUE }) {
  if (value === "BOMB") {
    return <div className="bg-red-500">💣 </div>;
  }
  return <div>{value}</div>;
}
