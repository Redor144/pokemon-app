import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { type Region } from 'react-native-maps';
import { colors, radius, spacing } from '@/constants/theme';
import type { MapPin } from '@/types/mapPin';
import FeatureCardPlaceholder from '@/components/FeatureCardPlaceholder';
import MapPinControls from '@/components/MapPinControls';
import MapPinMarker from '@/components/MapPinMarker';

const MAP_LOAD_TIMEOUT_MS = 8000;

const CRACOW_REGION: Region = {
  latitude: 50.0647,
  longitude: 19.9450,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const MAP_UNAVAILABLE_TITLE = 'Map Unavailable';
const LOADING_MAP_TITLE = 'Loading Map…';

type MapLoadState = 'loading' | 'ready' | 'unavailable';

type MapPressEvent = {
  nativeEvent: { coordinate: { latitude: number; longitude: number } };
};

type Props = {
  pins: MapPin[];
  selectedPinId: string | null;
  isFavorite: (id: number) => boolean;
  isSelectingLocation: boolean;
  onMapPress: (event: MapPressEvent) => void;
  onMapLongPress: (event: MapPressEvent) => void;
  onMarkerPress: (pin: MapPin) => void;
  onAddPinPress: () => void;
};

export default function PokemonMap({
  pins,
  selectedPinId,
  isFavorite,
  isSelectingLocation,
  onMapPress,
  onMapLongPress,
  onMarkerPress,
  onAddPinPress,
}: Props) {
  const [loadState, setLoadState] = useState<MapLoadState>('loading');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLoadTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMapReady = useCallback(() => {
    clearLoadTimeout();
    setLoadState('ready');
  }, [clearLoadTimeout]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setLoadState((current) => (current === 'loading' ? 'unavailable' : current));
    }, MAP_LOAD_TIMEOUT_MS);

    return clearLoadTimeout;
  }, [clearLoadTimeout]);

  if (loadState === 'unavailable') {
    return (
      <View style={styles.mapCard}>
        <FeatureCardPlaceholder title={MAP_UNAVAILABLE_TITLE} />
      </View>
    );
  }

  return (
    <View style={styles.mapCard}>
      <MapView
        style={styles.map}
        userInterfaceStyle="dark"
        showsCompass={true}
        showsScale={true}
        initialRegion={CRACOW_REGION}
        onMapReady={handleMapReady}
        onPress={onMapPress}
        onLongPress={onMapLongPress}
      >
        {loadState === 'ready' &&
          pins.map((pin) => (
            <MapPinMarker
              key={`${pin.id}-${pin.pokemon?.id ?? 'empty'}-${selectedPinId === pin.id}`}
              pin={pin}
              isSelected={selectedPinId === pin.id}
              isFavorite={pin.pokemon !== null && isFavorite(pin.pokemon.id)}
              onPress={onMarkerPress}
            />
          ))}
      </MapView>

      {loadState === 'loading' && (
        <View style={styles.loadingOverlay}>
          <FeatureCardPlaceholder title={LOADING_MAP_TITLE} loading />
        </View>
      )}

      {loadState === 'ready' && (
        <MapPinControls
          isSelectingLocation={isSelectingLocation}
          pinCount={pins.length}
          onAddPinPress={onAddPinPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xl,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.card,
  },
});
