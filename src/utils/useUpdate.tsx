import { useState, useCallback } from 'react';

export default function useUpdate() {
  const [, setUpdate] = useState(0);
  const func = useCallback(() => {
    setUpdate((prev) => ++prev);
  }, [setUpdate]);

  return func;
}
