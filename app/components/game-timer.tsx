import {
  useState,
  useEffect,
  useRef,
  useInsertionEffect,
  useCallback,
} from "react";
import { useMinesweeperContext } from "./minesweeper-context";

export function GameTimer() {
  const [time, setTime] = useState(0);

  const { isGameOver, isGameWon } = useMinesweeperContext();

  const timerFunction = useEvent(() => {
    if (isGameOver || isGameWon) {
      return;
    }
    setTime((t) => t + 1);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      timerFunction();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timerFunction]);

  return <div>Time: {time}</div>;
}

export function useEvent(fn: Function): any {
  const ref = useRef<any>(null);
  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useCallback((...args: any[]) => {
    const f = ref.current;
    return f(...args);
  }, []);
}
