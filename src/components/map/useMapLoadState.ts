import { useCallback, useEffect, useRef, useState } from "react";
import {
  MAP_LOAD_TIMEOUT_MS,
  type MapLoadState,
} from "@/components/map/mapConstants";

export function useMapLoadState() {
  const [loadState, setLoadState] = useState<MapLoadState>("loading");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLoadTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMapReady = useCallback(() => {
    clearLoadTimeout();
    setLoadState("ready");
  }, [clearLoadTimeout]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setLoadState((current) =>
        current === "loading" ? "unavailable" : current,
      );
    }, MAP_LOAD_TIMEOUT_MS);

    return clearLoadTimeout;
  }, [clearLoadTimeout]);

  return { loadState, handleMapReady };
}
