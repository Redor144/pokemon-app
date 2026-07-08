import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing, typography } from '@/constants/theme';
import { commonStyles } from '@/styles/common';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';
import type { MapPin } from '@/types/mapPin';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonPickerList from '@/components/PokemonPickerList';

const LIST_HEIGHT = 280;
const ON_ANOTHER_PIN_LABEL = 'On another pin';
const DELETE_PIN_LABEL = 'Delete pin';
const NEW_PIN_TITLE = 'New pin';
const ASSIGN_POKEMON_LABEL = 'Assign Pokémon';

type Props = {
  pin: MapPin;
  assignedPokemonIds: Set<number>;
  onAssign: (pokemon: PokemonListItem) => void;
  onDelete: () => void;
};

function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export default function MapPinAssignContent({
  pin,
  assignedPokemonIds,
  onAssign,
  onDelete,
}: Props) {
  const { favorite } = useFavoritePokemon();
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);
  const [queryState, setQueryState] = useState({ isInitialLoading: true, isError: false });

  const handlePokemonPress = useCallback(
    (pokemon: PokemonListItem) => {
      if (assignedPokemonIds.has(pokemon.id)) return;
      setSelectedPokemon((current) => (current?.id === pokemon.id ? null : pokemon));
    },
    [assignedPokemonIds],
  );

  const handleAssignPokemon = useCallback(() => {
    if (!selectedPokemon) return;
    onAssign(selectedPokemon);
  }, [selectedPokemon, onAssign]);

  const isSelectedPokemonAssigned =
    selectedPokemon !== null && assignedPokemonIds.has(selectedPokemon.id);
  const canAssign =
    selectedPokemon !== null &&
    !isSelectedPokemonAssigned &&
    !queryState.isInitialLoading &&
    !queryState.isError;

  return (
    <>
      <Text style={styles.title}>{NEW_PIN_TITLE}</Text>
      <Text style={styles.subtitle}>
        {formatCoordinates(pin.latitude, pin.longitude)}
      </Text>

      <View style={styles.listContainer}>
        <PokemonPickerList
          enabled
          onSelect={handlePokemonPress}
          selectedId={selectedPokemon?.id}
          favoriteId={favorite?.id}
          disabledIds={assignedPokemonIds}
          disabledLabel={ON_ANOTHER_PIN_LABEL}
          listHeight={LIST_HEIGHT}
          onQueryStateChange={setQueryState}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          commonStyles.primaryButton,
          !canAssign && commonStyles.primaryButtonDisabled,
          pressed && canAssign && styles.buttonPressed,
        ]}
        onPress={handleAssignPokemon}
        disabled={!canAssign}
      >
        <Text style={commonStyles.primaryButtonText}>{ASSIGN_POKEMON_LABEL}</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.deleteButton, pressed && styles.buttonPressed]}
        onPress={onDelete}
      >
        <Text style={styles.deleteButtonText}>{DELETE_PIN_LABEL}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  listContainer: {
    width: '100%',
    marginTop: spacing.md,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  deleteButton: {
    borderRadius: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    marginTop: spacing.sm,
  },
  deleteButtonText: {
    fontFamily: fonts.nunitoBold,
    fontSize: 16,
    color: colors.destructive,
  },
});
