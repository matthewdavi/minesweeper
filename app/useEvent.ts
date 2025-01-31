import { useRef, useInsertionEffect, useCallback } from "react";

// The useEvent API has not yet been added to React,
// so this is a temporary shim to make this sandbox work.
// You're not expected to write code like this yourself.

export function useEvent<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef<T | null>(null);
  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    const f = ref.current;
    if (!f) throw new Error("useEvent callback is undefined");
    return f(...args);
  }, []) as T;
}
