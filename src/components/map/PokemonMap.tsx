import { View } from "react-native";
import MapView from "react-native-maps";
import type { MapPin } from "@/types/mapPin";
import FeatureCardPlaceholder from "@/components/ui/FeatureCardPlaceholder";
import MapPinControls from "@/components/map/MapPinControls";
import MapPinMarker from "@/components/map/MapPinMarker";
import {
  CRACOW_REGION,
  type MapPressEvent,
} from "@/components/map/mapConstants";
import { mapStyles } from "@/components/map/mapStyles";
import { useMapLoadState } from "@/components/map/useMapLoadState";

const MAP_UNAVAILABLE_TITLE = "Map Unavailable";
const LOADING_MAP_TITLE = "Loading Map…";

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
  const { loadState, handleMapReady } = useMapLoadState();

  if (loadState === "unavailable") {
    return (
      <View style={mapStyles.mapCard}>
        <FeatureCardPlaceholder title={MAP_UNAVAILABLE_TITLE} />
      </View>
    );
  }

  return (
    <View style={mapStyles.mapCard}>
      <MapView
        style={mapStyles.map}
        userInterfaceStyle="dark"
        showsCompass={true}
        showsScale={true}
        initialRegion={CRACOW_REGION}
        onMapReady={handleMapReady}
        onPress={onMapPress}
        onLongPress={onMapLongPress}
      >
        {loadState === "ready" &&
          pins.map((pin) => (
            <MapPinMarker
              key={`${pin.id}-${pin.pokemon?.id ?? "empty"}-${selectedPinId === pin.id}`}
              pin={pin}
              isSelected={selectedPinId === pin.id}
              isFavorite={pin.pokemon !== null && isFavorite(pin.pokemon.id)}
              onPress={onMarkerPress}
            />
          ))}
      </MapView>

      {loadState === "loading" && (
        <View style={mapStyles.loadingOverlay}>
          <FeatureCardPlaceholder title={LOADING_MAP_TITLE} loading />
        </View>
      )}

      {loadState === "ready" && (
        <MapPinControls
          isSelectingLocation={isSelectingLocation}
          pinCount={pins.length}
          onAddPinPress={onAddPinPress}
        />
      )}
    </View>
  );
}
