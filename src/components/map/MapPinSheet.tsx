import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import type { MapPin } from '@/types/mapPin';
import type { PokemonListItem } from '@/types/pokemon';
import MapPinAssignContent from '@/components/map/MapPinAssignContent';
import PokemonDetailContent from '@/components/pokemon-detail/PokemonDetailContent';
import ModalSheetContainer from '@/components/sheets/ModalSheetContainer';
import { useModalBottomSheet } from '@/hooks/useModalBottomSheet';

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

const DELETE_PIN_LABEL = 'Delete pin';

const MapPinSheet = forwardRef<MapPinSheetRef, Props>(
  (
    { pins, assignedPokemonIds, onAssignPokemon, onDeletePin, onSelectionChange },
    ref,
  ) => {
    const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);

    const clearSelection = useCallback(() => {
      onSelectionChange?.(null);
    }, [onSelectionChange]);

    const activePin = useMemo(() => {
      if (!selectedPin) return null;
      return pins.find((pin) => pin.id === selectedPin.id) ?? selectedPin;
    }, [pins, selectedPin]);

    const {
      index,
      requestOpen,
      close,
      handleIndexChange,
      handleSettle,
    } = useModalBottomSheet({
      shouldOpen: selectedPin !== null,
      onClearSelection: clearSelection,
      onSettleClosed: () => setSelectedPin(null),
    });

    const closeSheet = close;

    useImperativeHandle(ref, () => ({
      open: (pin) => {
        setSelectedPin(pin);
        onSelectionChange?.(pin.id);
        requestOpen();
      },
      close: closeSheet,
    }));

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
      <ModalSheetContainer
        index={index}
        onIndexChange={handleIndexChange}
        onSettle={handleSettle}
        contentStyle={styles.sheetContent}
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
      </ModalSheetContainer>
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
