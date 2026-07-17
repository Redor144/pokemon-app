import { useCallback, useEffect, useRef, useState } from "react";

const CLOSED_INDEX = 0;
const OPEN_INDEX = 1;

type Options = {
  shouldOpen?: boolean;
  onClose?: () => void;
  onClearSelection?: () => void;
  onSettleClosed?: () => void;
};

export function useModalBottomSheet({
  shouldOpen = true,
  onClose,
  onClearSelection,
  onSettleClosed,
}: Options = {}) {
  const indexRef = useRef(CLOSED_INDEX);
  const [index, setIndexState] = useState(CLOSED_INDEX);
  const [openRequest, setOpenRequest] = useState(0);

  const setIndex = useCallback((nextIndex: number) => {
    indexRef.current = nextIndex;
    setIndexState(nextIndex);
  }, []);

  const close = useCallback(() => {
    onClose?.();
    onClearSelection?.();
    setIndex(CLOSED_INDEX);
  }, [onClose, onClearSelection, setIndex]);

  const requestOpen = useCallback(() => {
    setOpenRequest((count) => count + 1);
  }, []);

  useEffect(() => {
    if (!shouldOpen || openRequest === 0) return;

    const frame = requestAnimationFrame(() => {
      setIndex(OPEN_INDEX);
    });

    return () => cancelAnimationFrame(frame);
  }, [openRequest, shouldOpen, setIndex]);

  const handleIndexChange = useCallback(
    (nextIndex: number) => {
      setIndex(nextIndex);
      if (nextIndex === CLOSED_INDEX) {
        onClearSelection?.();
      }
    },
    [onClearSelection, setIndex],
  );

  const handleSettle = useCallback(
    (nextIndex: number) => {
      if (nextIndex !== CLOSED_INDEX) return;

      onClearSelection?.();

      requestAnimationFrame(() => {
        if (indexRef.current === CLOSED_INDEX) {
          onSettleClosed?.();
        }
      });
    },
    [onClearSelection, onSettleClosed],
  );

  return {
    index,
    openIndex: OPEN_INDEX,
    isOpen: index === OPEN_INDEX,
    requestOpen,
    close,
    handleIndexChange,
    handleSettle,
  };
}
