import { createFileRoute } from "@tanstack/react-router";
import { MinesweeperProvider } from "../components/minesweeper-context";
import { GameBoard } from "../components/game-board";
export const Route = createFileRoute("/minesweeper")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex w-full min-h-screen bg-gray-100 flex-col items-center">
      <h1 className="text-2xl font-bold">Minesweeper</h1>
      <MinesweeperProvider>
        <GameBoard />
      </MinesweeperProvider>
    </div>
  );
}
