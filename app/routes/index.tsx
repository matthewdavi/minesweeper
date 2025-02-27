import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { GameBoard } from "../components/zerojs-gameboard";
import { createGrid } from "../components/minesweeper-context";

// Define the schema for a single cell
const cellSchema = z.object({
  state: z.enum(["INITIAL", "OPENED", "FLAGGED"]),
  value: z.union([z.number(), z.literal("BOMB")]),
});

// Define the schema for the entire game state
const gameStateSchema = z.object({
  grid: z.array(z.array(cellSchema)), // 2D array of cells
  isGameOver: z.boolean(),
  isGameWon: z.boolean(),
  isFlaggingMode: z.boolean(),
  startTime: z.number(),
  gridSize: z.number(),
  windowState: z.enum(["MINIMIZED", "MAXIMIZED", "NORMAL"]).default("NORMAL"),
});

export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: gameStateSchema,
  errorComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Create a new game!
        </h1>
        <p className="text-gray-600 mb-6">
          Something went wrong with the game state.
        </p>
        <form
          action="/nojs/"
          method="get"
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 font-medium"
            >
              New game with
            </button>
            <input
              type="number"
              id="gridSize"
              name="gridSize"
              defaultValue={9}
              min="5"
              max="20"
              className="w-20 px-2 py-1 border border-gray-300 rounded"
            />
            <span className="text-gray-700 font-medium">rows and columns</span>
          </div>
          <input type="hidden" name="isGameOver" value="false" />
          <input type="hidden" name="isGameWon" value="false" />
          <input type="hidden" name="isFlaggingMode" value="false" />
          <input type="hidden" name="startTime" value={Date.now()} />
        </form>
      </div>
    </div>
  ),
  beforeLoad(ctx) {
    const isSearchEmpty = Object.keys(ctx.search).length === 0;
    if (isSearchEmpty) {
      redirect({
        to: "/",
        throw: true,
        search: {
          gridSize: 9,
          isGameOver: false,
          isGameWon: false,
          isFlaggingMode: false,
          startTime: Date.now(),
          grid: createGrid(9),
        },
      });
    }
    const noGrid = !ctx.search.grid || ctx.search.grid.length === 0;
    if (noGrid && ctx.search.gridSize) {
      const gridSize = ctx.search.gridSize;
      const grid = createGrid(gridSize);

      redirect({
        to: "/",
        throw: true,
        search: {
          ...ctx.search,
          grid: grid,
        },
      });
    }
    if (!ctx.search.startTime) {
      redirect({
        to: "/",
        throw: true,
        search: {
          ...ctx.search,
          startTime: Date.now(),
        },
      });
    }
  },
  loaderDeps(opts) {
    return {
      state: opts.search,
    };
  },
  loader: async ({ deps: { state } }) => {
    let timeElapsed = Date.now() - state.startTime;
    const isNewGame = state.grid
      .flat()
      .every((cell) => cell.state === "INITIAL");
    if (isNewGame) {
      timeElapsed = 0;
    }
    return {
      state,
      timeElapsed,
    };
  },
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#008080]">
      <div className="bg-[#c0c0c0] border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] border-2 p-1 shadow-md">
        <div className="bg-[#000080] text-white px-2 py-0.5 flex items-center justify-between mb-1">
          <span className="text-sm font-[system-ui]">
            Progressively Enhanced Minesweeper
          </span>
          <div className="flex gap-1">
            <button className="bg-[#c0c0c0] text-black px-2 border border-[#ffffff] hover:bg-[#d4d4d4] text-xs leading-3">
              _
            </button>
            <button className="bg-[#c0c0c0] text-black px-2 border border-[#ffffff] hover:bg-[#d4d4d4] text-xs leading-3">
              □
            </button>
            <Link
              to="/"
              search={{
                startTime: 0,
                isGameOver: false,
                isGameWon: false,
                isFlaggingMode: false,
                gridSize: 9,
                grid: createGrid(0),
              }}
              className="bg-[#c0c0c0] text-black px-2 border border-[#ffffff] hover:bg-[#d4d4d4] text-xs leading-3"
            >
              ×
            </Link>
          </div>
        </div>
        <div className="p-4 bg-[#c0c0c0]">
          <GameBoard />
        </div>
      </div>
      <div className="fixed bottom-4 text-center">
        <a
          href="https://github.com/matthewdavi/minesweeper"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5 invert" />
          <span>GitHub</span>
        </a>
      </div>
    </div>
  );
}
