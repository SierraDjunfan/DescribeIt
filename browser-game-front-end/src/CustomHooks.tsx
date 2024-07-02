import { useRef, useEffect } from "react";

export const useInterval = (intervalFunction: any, interval: any) => {
  const savedIntervalFunction = useRef();

  useEffect(() => {
    savedIntervalFunction.current = intervalFunction;
  }, [intervalFunction]);

  useEffect(() => {
    if (interval !== null) {
      const intervalIdentifier = setInterval(() => (savedIntervalFunction as any).current(), interval);
      return () => clearInterval(intervalIdentifier);
    }
  }, [interval]);
}