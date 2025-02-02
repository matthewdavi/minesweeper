import { Link, redirect, useNavigate } from "@tanstack/react-router";
import { createGrid, type CELL_VALUE } from "./minesweeper-context";
import {
  deepCloneGrid,
  recursivelyRevealAdjacentCellsWithValueZero,
} from "./minesweeper-context";
import { useSearch } from "@tanstack/react-router";
import { Route } from "../routes";
import { TimerWrapper } from "./zerojs-timer";

export function GameBoard() {
  const state = useSearch({ from: "/" });
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

    let startTime = state.startTime;

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
            <ModeSelector />
          </noscript>

          <div className="md:hidden">
            <ModeSelector />
          </div>
        </div>
      </div>

      {/* Floating game status messages */}
      {(state.isGameOver || state.isGameWon) && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-[#c0c0c0] p-4 [border:2px_outset_#c0c0c0] shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
            {state.isGameOver && (
              <div className="font-['MS_Sans_Serif'] text-xl text-[#ff0000] font-bold px-8 py-2 animate-[pulse_1s_ease-in-out_infinite]">
                GAME OVER
              </div>
            )}
            {state.isGameWon && (
              <div className="font-['MS_Sans_Serif'] text-xl text-black px-8 py-2">
                VICTORY!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game grid */}
      <div className={"w-full p-4 [border:2px_inset_#808080]"}>
        <div
          className={"mx-auto flex flex-col gap-px p-2 bg-[#c0c0c0]"}
          style={{ width: `${state.gridSize * 32}px` }}
        >
          {grid.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={"flex flex-row"}
              style={{ height: "32px" }}
            >
              {row.map((cell, cellIndex) => {
                // Base styling for all cells.
                const baseClasses =
                  "w-8 h-8 flex-shrink-0 flex-grow-0 flex justify-center items-center font-['MS_Sans_Serif'] text-[min(2vw,1.125rem)] [-webkit-touch-callout:none]";
                // For Windows 95 look:
                // Unopened cell: raised border (light top and left, dark bottom and right).
                // Opened cell: inset border (dark top/left, light bottom/right).
                const cellClasses =
                  cell.state === "OPENED"
                    ? "bg-[#c0c0c0] border-2 border-t-[#404040] border-l-[#404040] border-r-white border-b-white cursor-default"
                    : "bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] hover:bg-gray-200 cursor-pointer";
                return (
                  <Link
                    key={`${rowIndex}-${cellIndex}`}
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
                    className={baseClasses + " " + cellClasses}
                  >
                    {cell.state === "OPENED" && <OpenCell value={cell.value} />}
                    {cell.state === "FLAGGED" && "🚩"}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Game controls */}
        <div className="flex flex-col items-center gap-2">
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
                  to: "/",
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

function ModeSelector() {
  const state = useSearch({ from: "/" });

  return (
    <div className={"flex items-center justify-center gap-4 mt-3"}>
      <h3
        className={
          "bg-[#c0c0c0] text-black px-2 py-1 text-sm font-['MS_Sans_Serif'] [border:2px_inset_#808080]"
        }
      >
        {"MODE SELECT:"}
      </h3>
      <div className={"flex flex-col"}>
        <Link
          to={Route.to}
          search={{
            ...state,
            isFlaggingMode: true,
          }}
          className={`flex items-center gap-3 px-2 py-1 ${
            state.isGameOver || state.isGameWon
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          disabled={state.isGameOver || state.isGameWon}
        >
          <div
            className={`w-4 h-4 bg-white [border:2px_inset_#808080] flex items-center justify-center ${
              state.isFlaggingMode ? "bg-[#c0c0c0]" : ""
            }`}
          >
            {state.isFlaggingMode && (
              <span className="text-black text-xs">✓</span>
            )}
          </div>
          <span className="text-sm font-['MS_Sans_Serif']">Flag Mode</span>
        </Link>

        <Link
          to={Route.to}
          search={{
            ...state,
            isFlaggingMode: false,
          }}
          className={`flex items-center gap-2 px-2 py-1 ${
            state.isGameOver || state.isGameWon
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          disabled={state.isGameOver || state.isGameWon}
        >
          <div
            className={`w-4 h-4 bg-white [border:2px_inset_#808080] flex items-center justify-center ${
              !state.isFlaggingMode ? "bg-[#c0c0c0]" : ""
            }`}
          >
            {!state.isFlaggingMode && (
              <span className="text-black text-xs">✓</span>
            )}
          </div>
          <span className="text-sm font-['MS_Sans_Serif']">Reveal Mode</span>
        </Link>
      </div>
    </div>
  );
}
