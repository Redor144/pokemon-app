import { Platform, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Heart, MapPin } from 'lucide-react-native';
import { colors, radius } from '@/constants/theme';
import type { MapPin as MapPinData } from '@/types/mapPin';
import PokemonSprite from '@/components/ui/PokemonSprite';

const MARKER_SPRITE_SIZE = 36;

type Props = {
  pin: MapPinData;
  isSelected: boolean;
  isFavorite: boolean;
  onPress: (pin: MapPinData) => void;
};

export default function MapPinMarker({ pin, isSelected, isFavorite, onPress }: Props) {

  return (
    <Marker
      coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={() => onPress(pin)}
    >
      <View style={styles.markerWrapper} collapsable={false}>
        <View
          style={[
            styles.marker,
            isSelected && styles.markerSelected,
            !pin.pokemon && styles.markerEmpty,
          ]}
        >
          {pin.pokemon ? (
            <PokemonSprite
              key={pin.pokemon.imageUrl}
              imageUrl={pin.pokemon.imageUrl}
              size={MARKER_SPRITE_SIZE}
            />
          ) : (
            <MapPin color={colors.primary} size={20} />
          )}
        </View>
        {isFavorite && (
          <View style={[styles.favoriteBadge, isSelected && styles.favoriteBadgeSelected]}>
            <Heart color={colors.primary} size={10} fill={colors.primary} />
          </View>
        )}
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
    overflow: 'visible',
    ...Platform.select({
      android: { paddingTop: 2, paddingRight: 2 },
    }),
  },
  marker: {
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 2,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  favoriteBadgeSelected: {
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  markerEmpty: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  markerSelected: {
    borderColor: colors.secondary,
    borderWidth: 3,
  },
});
