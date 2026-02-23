import { useState, useEffect } from 'react';

interface UseLoadingTimeoutOptions {
  timeout?: number;
  isLoading: boolean;
}

export function useLoadingTimeout({ timeout = 5000, isLoading }: UseLoadingTimeoutOptions) {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      if (isLoading) {
        setHasTimedOut(true);
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [isLoading, timeout]);

  const reset = () => {
    setHasTimedOut(false);
  };

  return { hasTimedOut, reset };
}
