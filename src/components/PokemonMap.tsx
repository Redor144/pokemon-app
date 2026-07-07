import { StyleSheet, View } from 'react-native';
import MapView, { type Region } from 'react-native-maps';
import { colors, radius, spacing } from '@/constants/theme';
import type { MapPin } from '@/types/mapPin';
import MapPinControls from '@/components/MapPinControls';
import MapPinMarker from '@/components/MapPinMarker';

const CRACOW_REGION: Region = {
  latitude: 50.0647,
  longitude: 19.9450,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

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
  return (
    <View style={styles.mapCard}>
      <MapView
        style={styles.map}
        userInterfaceStyle="dark"
        showsCompass={true}
        showsScale={true}
        initialRegion={CRACOW_REGION}
        onPress={onMapPress}
        onLongPress={onMapLongPress}
      >
        {pins.map((pin) => (
          <MapPinMarker
            key={`${pin.id}-${pin.pokemon?.id ?? 'empty'}`}
            pin={pin}
            isSelected={selectedPinId === pin.id}
            isFavorite={pin.pokemon !== null && isFavorite(pin.pokemon.id)}
            onPress={onMarkerPress}
          />
        ))}
      </MapView>

      <MapPinControls
        isSelectingLocation={isSelectingLocation}
        pinCount={pins.length}
        onAddPinPress={onAddPinPress}
      />
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
});
