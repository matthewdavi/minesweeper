import { useState, useEffect } from "react";

import { useEvent } from "../useEvent";
import { useSearch, useLoaderData } from "@tanstack/react-router";

export function TimerWrapper() {
  const { state, timeElapsed } = useLoaderData({ from: "/nojs/" });
  const { isGameOver, isGameWon, grid } = useSearch({ from: "/nojs/" });
  const [elapsed, setElapsed] = useState(timeElapsed);

  const timerFunction = useEvent(() => {
    const isFirstMove = grid.flat().every((cell) => cell.state === "INITIAL");
    if (isGameOver || isGameWon || isFirstMove) {
      return;
    }
    setElapsed(Date.now() - state.startTime);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      timerFunction();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Timer timeElapsed={elapsed} />;
}

function Timer({ timeElapsed }: { timeElapsed: number }) {
  return (
    <div className="bg-gray-500 p-[2px] [border-style:outset]">
      <div className="bg-black p-1">
        <div className="font-['Digital-7'] text-red-600 text-2xl leading-none tabular-nums">
          {String(Math.floor(timeElapsed / 1000)).padStart(3, "0")}
        </div>
      </div>
    </div>
  );
}
