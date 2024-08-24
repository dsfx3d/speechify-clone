import {useCallback, useState} from "react";

export function useInactivityTimeout() {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timeout = useCallback(() => setHasTimedOut(true), []);

  const cancelTimeout = () => {
    clearTimeout(timeoutId);
    setHasTimedOut(false);
  };

  const refreshTimeout = (inactivityDuration: number) => {
    cancelTimeout();
    const nextTimeoutId = setTimeout(timeout, inactivityDuration);
    setTimeoutId(nextTimeoutId);
  };

  return {hasTimedOut, refreshTimeout, cancelTimeout};
}
