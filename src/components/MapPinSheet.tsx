import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { ModalBottomSheet } from '@swmansion/react-native-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/constants/theme';
import { commonStyles } from '@/styles/common';
import type { MapPin } from '@/types/mapPin';
import type { PokemonListItem } from '@/types/pokemon';
import MapPinAssignContent from '@/components/MapPinAssignContent';
import PokemonDetailContent from '@/components/PokemonDetailContent';

export type MapPinSheetRef = {
  open: (pin: MapPin) => void;
  close: () => void;
};

type Props = {
  pins: MapPin[];
  assignedPokemonIds: Set<number>;
  onAssignPokemon: (pinId: string, pokemon: PokemonListItem) => void;
  onDeletePin: (pinId: string) => void;
  onSelectionChange?: (pinId: string | null) => void;
};

const CLOSED_INDEX = 0;
const OPEN_INDEX = 1;
const DELETE_PIN_LABEL = 'Delete pin';

const MapPinSheet = forwardRef<MapPinSheetRef, Props>(
  (
    { pins, assignedPokemonIds, onAssignPokemon, onDeletePin, onSelectionChange },
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    const indexRef = useRef(CLOSED_INDEX);
    const [index, setIndexState] = useState(CLOSED_INDEX);
    const [openRequest, setOpenRequest] = useState(0);
    const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);

    const setIndex = useCallback((nextIndex: number) => {
      indexRef.current = nextIndex;
      setIndexState(nextIndex);
    }, []);

    const clearSelection = useCallback(() => {
      onSelectionChange?.(null);
    }, [onSelectionChange]);

    const activePin = useMemo(() => {
      if (!selectedPin) return null;
      return pins.find((pin) => pin.id === selectedPin.id) ?? selectedPin;
    }, [pins, selectedPin]);

    const closeSheet = useCallback(() => {
      clearSelection();
      setIndex(CLOSED_INDEX);
    }, [clearSelection, setIndex]);

    useImperativeHandle(ref, () => ({
      open: (pin) => {
        setSelectedPin(pin);
        onSelectionChange?.(pin.id);
        setOpenRequest((count) => count + 1);
      },
      close: closeSheet,
    }));

    useEffect(() => {
      if (!selectedPin || openRequest === 0) return;

      const frame = requestAnimationFrame(() => {
        setIndex(OPEN_INDEX);
      });

      return () => cancelAnimationFrame(frame);
    }, [openRequest, selectedPin, setIndex]);

    const handleIndexChange = useCallback(
      (nextIndex: number) => {
        setIndex(nextIndex);
        if (nextIndex === CLOSED_INDEX) {
          clearSelection();
        }
      },
      [clearSelection, setIndex],
    );

    const handleSettle = useCallback(
      (nextIndex: number) => {
        if (nextIndex !== CLOSED_INDEX) return;

        clearSelection();

        requestAnimationFrame(() => {
          if (indexRef.current === CLOSED_INDEX) {
            setSelectedPin(null);
          }
        });
      },
      [clearSelection],
    );

    const handleDeletePin = useCallback(() => {
      if (!activePin) return;
      onDeletePin(activePin.id);
      closeSheet();
    }, [activePin, onDeletePin, closeSheet]);

    const handleAssignPokemon = useCallback(
      (pokemon: PokemonListItem) => {
        if (!activePin) return;
        onAssignPokemon(activePin.id, pokemon);
        closeSheet();
      },
      [activePin, onAssignPokemon, closeSheet],
    );

    return (
      <ModalBottomSheet
        detents={[0, 'content']}
        index={index}
        onIndexChange={handleIndexChange}
        onSettle={handleSettle}
        scrimColor={colors.overlay}
        surface={
          <View style={[StyleSheet.absoluteFill, commonStyles.sheetSurface]} />
        }
      >
        <View
          style={[
            commonStyles.sheetContent,
            styles.sheetContent,
            { paddingBottom: insets.bottom + spacing.xl },
          ]}
        >
          {activePin?.pokemon && (
            <PokemonDetailContent
              pokemon={activePin.pokemon}
              action={{
                label: DELETE_PIN_LABEL,
                onPress: handleDeletePin,
                variant: 'destructive',
              }}
            />
          )}

          {activePin && !activePin.pokemon && (
            <MapPinAssignContent
              pin={activePin}
              assignedPokemonIds={assignedPokemonIds}
              onAssign={handleAssignPokemon}
              onDelete={handleDeletePin}
            />
          )}
        </View>
      </ModalBottomSheet>
    );
  },
);

MapPinSheet.displayName = 'MapPinSheet';

export default MapPinSheet;

const styles = StyleSheet.create({
  sheetContent: {
    width: '100%',
    alignItems: 'stretch',
  },
});
