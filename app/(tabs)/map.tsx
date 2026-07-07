import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { commonStyles } from '@/styles/common';
import type { MapPin } from '@/types/mapPin';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';
import { MapPinsProvider, useMapPins } from '@/contexts/MapPinsContext';
import { useMapPinPlacement } from '@/hooks/useMapPinPlacement';
import MapPinSheet, { type MapPinSheetRef } from '@/components/MapPinSheet';
import PokemonMap from '@/components/PokemonMap';

function MapScreenContent() {
  const { pins, assignedPokemonIds, assignPokemon, deletePin } = useMapPins();
  const { isFavorite } = useFavoritePokemon();
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const sheetRef = useRef<MapPinSheetRef>(null);

  const openPinSheet = useCallback((pin: MapPin) => {
    sheetRef.current?.open(pin);
  }, []);

  const handleMarkerPress = useCallback(
    (pin: MapPin) => {
      openPinSheet(pin);
    },
    [openPinSheet],
  );

  const { isSelectingLocation, handleMapPress, handleMapLongPress, handleAddPinPress } =
    useMapPinPlacement(openPinSheet);

  return (
    <View style={commonStyles.screen}>
      <PokemonMap
        pins={pins}
        selectedPinId={selectedPinId}
        isFavorite={isFavorite}
        isSelectingLocation={isSelectingLocation}
        onMapPress={handleMapPress}
        onMapLongPress={handleMapLongPress}
        onMarkerPress={handleMarkerPress}
        onAddPinPress={handleAddPinPress}
      />

      <MapPinSheet
        ref={sheetRef}
        assignedPokemonIds={assignedPokemonIds}
        onAssignPokemon={assignPokemon}
        onDeletePin={deletePin}
        onSelectionChange={setSelectedPinId}
      />
    </View>
  );
}

export default function MapScreen() {
  return (
    <MapPinsProvider>
      <MapScreenContent />
    </MapPinsProvider>
  );
}
