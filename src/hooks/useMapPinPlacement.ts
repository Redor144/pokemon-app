import { useCallback, useRef, useState } from 'react';
import { useMapPins } from '@/contexts/MapPinsContext';
import type { MapPin } from '@/types/mapPin';

type MapPressEvent = {
  nativeEvent: { coordinate: { latitude: number; longitude: number } };
};

export function useMapPinPlacement(onPinPlaced: (pin: MapPin) => void) {
  const { addPin } = useMapPins();
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const suppressNextPress = useRef(false);

  const placePin = useCallback(
    (latitude: number, longitude: number) => {
      const newPin = addPin(latitude, longitude);
      setIsSelectingLocation(false);
      onPinPlaced(newPin);
    },
    [addPin, onPinPlaced],
  );

  const handleMapPress = useCallback(
    (event: MapPressEvent) => {
      if (suppressNextPress.current) {
        suppressNextPress.current = false;
        return;
      }
      if (!isSelectingLocation) return;
      const { latitude, longitude } = event.nativeEvent.coordinate;
      placePin(latitude, longitude);
    },
    [isSelectingLocation, placePin],
  );

  const handleMapLongPress = useCallback(
    (event: MapPressEvent) => {
      suppressNextPress.current = true;
      const { latitude, longitude } = event.nativeEvent.coordinate;
      placePin(latitude, longitude);
    },
    [placePin],
  );

  const handleAddPinPress = useCallback(() => {
    setIsSelectingLocation((current) => !current);
  }, []);

  return {
    isSelectingLocation,
    handleMapPress,
    handleMapLongPress,
    handleAddPinPress,
  };
}
