import { useState } from "react";

export function useInactivityTimeout() {
  const [timeoutId, setTimeoutId] = useState(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const cancelTimeout = () => {
    clearTimeout(timeoutId);
    setHasTimedOut(false);
  }

  const refreshTimeout = (inactivityDuration) => {
    cancelTimeout();
    const timeout = () => setHasTimedOut(true);
    const nextTimeoutId = setTimeout(timeout, inactivityDuration);
    setTimeoutId(nextTimeoutId);
  };

  return { hasTimedOut, refreshTimeout, cancelTimeout };
}