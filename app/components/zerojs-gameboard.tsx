import { Link, redirect, useNavigate } from "@tanstack/react-router";
import { createGrid, type CELL_VALUE } from "./minesweeper-context";
import {
  deepCloneGrid,
  recursivelyRevealAdjacentCellsWithValueZero,
} from "./minesweeper-context";
import { useSearch } from "@tanstack/react-router";
import { Route } from "../routes/nojs";
import { TimerWrapper } from "./zerojs-timer";

export function GameBoard() {
  const state = useSearch({ from: "/nojs/" });
  const grid = state.grid;
  const numberOfBombs = grid
    .flat()
    .filter((cell) => cell.value === "BOMB").length;
  const numberOfFlaggedCells = grid
    .flat()
    .filter((cell) => cell.state === "FLAGGED").length;
  const numberOfBombsRemaining = numberOfBombs - numberOfFlaggedCells;

  const navigate = useNavigate();

  const getNextState = (
    rowIndex: number,
    cellIndex: number,
    isFlagging: boolean
  ) => {
    const newGrid = deepCloneGrid(grid);
    const cell = newGrid[rowIndex][cellIndex];
    const isFirstMove = newGrid
      .flat()
      .every((cell) => cell.state === "INITIAL");
    let startTime = state.startTime;
    if (isFirstMove) {
      startTime = Date.now();
    }
    if (isFlagging) {
      cell.state = cell.state === "FLAGGED" ? "INITIAL" : "FLAGGED";
    } else if (cell.state === "INITIAL") {
      if (cell.value === "BOMB") {
        newGrid.forEach((row) =>
          row.forEach((c) => {
            if (c.value === "BOMB") c.state = "OPENED";
          })
        );
        return {
          grid: newGrid,
          isGameOver: true,
          isGameWon: false,
          isFlaggingMode: state.isFlaggingMode,
          startTime: startTime,
          gridSize: state.gridSize,
        };
      }
      recursivelyRevealAdjacentCellsWithValueZero(newGrid, rowIndex, cellIndex);
    }

    const isGameWon = newGrid
      .flat()
      .every((cell) => cell.value === "BOMB" || cell.state === "OPENED");

    return {
      grid: newGrid,
      isGameOver: state.isGameOver || isGameWon,
      isGameWon,
      isFlaggingMode: state.isFlaggingMode,
      startTime: startTime,
      gridSize: state.gridSize,
    };
  };
  const stateWithFlaggingToggled = {
    ...state,
    isFlaggingMode: !state.isFlaggingMode,
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-[#c0c0c0] [border:2px_outset_#c0c0c0]">
      {/* Main control panel */}
      <div className="bg-[#c0c0c0] p-4 mb-4 [border:2px_outset_#c0c0c0]">
        <div className="bg-[#c0c0c0] p-3 mb-4 [border:2px_inset_#808080]">
          <div className="flex items-center justify-between">
            {/* Left counter */}
            <div className="bg-black px-3 py-1 [border:2px_inset_#808080]">
              <span className="text-2xl font-digital text-red-600">
                {String(numberOfBombsRemaining).padStart(3, "0")}
              </span>
            </div>

            {/* Center smiley */}
            <button className="w-10 h-10 bg-[#c0c0c0] flex items-center justify-center [border:2px_outset_#808080] active:[border:2px_inset_#808080]">
              <span className="text-2xl">
                {state.isGameOver ? "😢" : state.isGameWon ? "😎" : "😊"}
              </span>
            </button>

            <TimerWrapper />
          </div>

          {/* Mode toggle */}
          <noscript>
            <div className="flex items-center justify-center gap-4 mt-3">
              <h3 className="bg-[#c0c0c0] text-black px-2 py-1 text-sm font-['MS_Sans_Serif'] [border:2px_inset_#808080]">
                MODE SELECT:
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-['MS_Sans_Serif'] ${!state.isFlaggingMode ? "text-[#808080]" : "text-black"}`}
                >
                  Flag
                </span>
                <div className="bg-[#c0c0c0] [border:2px_outset_#dfdfdf] p-0.5">
                  <Link
                    to={Route.to}
                    search={stateWithFlaggingToggled}
                    className={`relative h-7 w-14 bg-[#c0c0c0] [border:2px_inset_#808080] ${
                      state.isGameOver || state.isGameWon
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={state.isGameOver || state.isGameWon}
                  >
                    <span className="sr-only">Toggle flagging mode</span>
                    <span
                      className={`absolute top-0.5 h-5 w-5 bg-[#c0c0c0] [border:2px_outset_#dfdfdf] ${
                        !state.isFlaggingMode ? "right-1" : "left-1"
                      }`}
                    />
                  </Link>
                </div>
                <span
                  className={`text-sm font-['MS_Sans_Serif'] ${state.isFlaggingMode ? "text-[#808080]" : "text-black"}`}
                >
                  Reveal
                </span>
              </div>
            </div>
          </noscript>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        {state.isGameOver && (
          <div className="text-xl font-bold text-red-500">Game Over!</div>
        )}
        {state.isGameWon && (
          <div className="text-xl font-bold text-green-500">You Win!</div>
        )}
      </div>

      {/* Game grid */}
      <div className="bg-[#c0c0c0] p-4 [border:2px_inset_#808080]">
        <div className="bg-[#808080] [border:2px_inset_#c0c0c0] p-1">
          {grid.map((row, rowIndex) => (
            <div className="flex justify-center" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Link
                  key={cellIndex}
                  to={Route.to}
                  search={getNextState(
                    rowIndex,
                    cellIndex,
                    state.isFlaggingMode
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (state.isGameOver || state.isGameWon) {
                      return;
                    }
                    navigate({
                      to: Route.to,
                      search: {
                        ...getNextState(rowIndex, cellIndex, false),
                        isFlaggingMode: state.isFlaggingMode,
                      },
                    });
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (state.isGameOver || state.isGameWon) {
                      return;
                    }
                    navigate({
                      to: Route.to,
                      search: {
                        ...getNextState(rowIndex, cellIndex, true),
                        isFlaggingMode: state.isFlaggingMode,
                      },
                    });
                  }}
                  disabled={
                    state.isGameOver ||
                    state.isGameWon ||
                    cell.state === "OPENED"
                  }
                  className={`
                    w-8 h-8 flex justify-center items-center
                    font-['MS_Sans_Serif']
                    ${
                      cell.state === "OPENED"
                        ? "bg-[#c0c0c0] [border:1px_inset_#808080]"
                        : "bg-[#c0c0c0] [border:2px_outset_#808080] hover:brightness-105"
                    }
                    ${state.isGameOver || state.isGameWon || cell.state === "OPENED" ? "cursor-default" : "cursor-pointer"}
                    text-lg
                  `}
                >
                  {cell.state === "OPENED" && <OpenCell value={cell.value} />}
                  {cell.state === "FLAGGED" && "🚩"}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Game controls */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <form
            action={Route.to}
            method="get"
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget as HTMLFormElement);
              const gridSize = formData.get("gridSize");
              if (gridSize) {
                navigate({
                  to: "/nojs",
                  search: {
                    gridSize: Number(gridSize),
                    isGameOver: false,
                    isGameWon: false,
                    isFlaggingMode: false,
                    startTime: Date.now(),
                    grid: createGrid(Number(gridSize)),
                  },
                });
              }
            }}
          >
            <label htmlFor="gridSize" className="sr-only">
              Grid Size
            </label>
            <input type="hidden" name="isGameOver" value="false" />
            <input type="hidden" name="isGameWon" value="false" />
            <input type="hidden" name="isFlaggingMode" value="false" />
            <input type="hidden" name="startTime" value={Date.now()} />
            <button
              type="submit"
              className="px-6 py-2 bg-[#c0c0c0] [border:2px_outset_#808080] hover:brightness-105 active:[border:2px_inset_#808080] cursor-pointer font-['MS_Sans_Serif']"
            >
              New game with
            </button>
            <input
              type="number"
              id="gridSize"
              name="gridSize"
              defaultValue={state.gridSize ?? 9}
              min="5"
              max="20"
              className="w-20 px-2 py-1 bg-white [border:2px_inset_#808080] text-black font-['MS_Sans_Serif']"
            />
            <span className="font-['MS_Sans_Serif'] text-black">
              rows and columns
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

function OpenCell({ value }: { value: CELL_VALUE }) {
  return <div>{value === "BOMB" ? "💣" : value}</div>;
}
