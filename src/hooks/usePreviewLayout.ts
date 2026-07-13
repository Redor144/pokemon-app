import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

export function usePreviewLayout() {
  const [previewLayout, setPreviewLayout] = useState({ width: 0, height: 0 });

  const handlePreviewLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPreviewLayout((current) =>
      current.width === width && current.height === height ? current : { width, height },
    );
  }, []);

  return { previewLayout, handlePreviewLayout };
}
