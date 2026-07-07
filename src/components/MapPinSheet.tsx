import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { ModalBottomSheet } from '@swmansion/react-native-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius, spacing, typography } from '@/constants/theme';
import { commonStyles } from '@/styles/common';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';
import { usePokemonList } from '@/hooks/usePokemonList';
import type { MapPin } from '@/types/mapPin';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonDetailContent from '@/components/PokemonDetailContent';
import PokemonListRow from '@/components/PokemonListRow';

export type MapPinSheetRef = {
  open: (pin: MapPin) => void;
  close: () => void;
};

type Props = {
  assignedPokemonIds: Set<number>;
  onAssignPokemon: (pinId: string, pokemon: PokemonListItem) => void;
  onDeletePin: (pinId: string) => void;
  onSelectionChange?: (pinId: string | null) => void;
};

const CLOSED_INDEX = 0;
const OPEN_INDEX = 1;
const LIST_HEIGHT = 280;

function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

const MapPinSheet = forwardRef<MapPinSheetRef, Props>(
  ({ assignedPokemonIds, onAssignPokemon, onDeletePin, onSelectionChange }, ref) => {
    const insets = useSafeAreaInsets();
    const { favorite } = useFavoritePokemon();
    const [index, setIndex] = useState(CLOSED_INDEX);
    const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);

    const isAssigning = selectedPin !== null && selectedPin.pokemon === null;

    const {
      pokemonList,
      isInitialLoading,
      isFetchingNextPage,
      hasMore,
      loadMore,
      refresh,
      isError,
    } = usePokemonList({ enabled: index === OPEN_INDEX && isAssigning });

    const resetState = useCallback(() => {
      setSelectedPin(null);
      setSelectedPokemon(null);
    }, []);

    const closeSheet = useCallback(() => {
      onSelectionChange?.(null);
      setIndex(CLOSED_INDEX);
    }, [onSelectionChange]);

    useImperativeHandle(ref, () => ({
      open: (pin) => {
        setSelectedPin(pin);
        setSelectedPokemon(null);
        onSelectionChange?.(pin.id);
        setIndex(OPEN_INDEX);
      },
      close: closeSheet,
    }));

    const handleIndexChange = useCallback(
      (nextIndex: number) => {
        setIndex(nextIndex);
        if (nextIndex === CLOSED_INDEX) {
          onSelectionChange?.(null);
        }
      },
      [onSelectionChange],
    );

    const handleSettle = useCallback(
      (nextIndex: number) => {
        if (nextIndex === CLOSED_INDEX) {
          resetState();
        }
      },
      [resetState],
    );

    const handleDeletePin = useCallback(() => {
      if (!selectedPin) return;
      onDeletePin(selectedPin.id);
      closeSheet();
    }, [selectedPin, onDeletePin, closeSheet]);

    const handleAssignPokemon = useCallback(() => {
      if (!selectedPin || !selectedPokemon) return;
      onAssignPokemon(selectedPin.id, selectedPokemon);
      closeSheet();
    }, [selectedPin, selectedPokemon, onAssignPokemon, closeSheet]);

    const handlePokemonPress = useCallback(
      (pokemon: PokemonListItem) => {
        if (assignedPokemonIds.has(pokemon.id)) return;
        setSelectedPokemon(pokemon);
      },
      [assignedPokemonIds],
    );

    const selectedId = selectedPokemon?.id;
    const favoriteId = favorite?.id;
    const isSelectedPokemonAssigned =
      selectedPokemon !== null && assignedPokemonIds.has(selectedPokemon.id);

    const keyExtractor = useCallback((item: PokemonListItem) => item.id.toString(), []);

    const renderItem: ListRenderItem<PokemonListItem> = useCallback(
      ({ item }) => (
        <PokemonListRow
          pokemon={item}
          onPress={handlePokemonPress}
          isSelected={selectedId === item.id}
          isFavorite={favoriteId === item.id}
          disabled={assignedPokemonIds.has(item.id)}
          disabledLabel="On another pin"
        />
      ),
      [handlePokemonPress, selectedId, favoriteId, assignedPokemonIds],
    );

    const listFooter = useMemo(() => {
      if (hasMore && isFetchingNextPage) {
        return (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.listFooter}
          />
        );
      }
      return null;
    }, [hasMore, isFetchingNextPage]);

    const listContent = useMemo(() => {
      if (isInitialLoading) {
        return (
          <View style={styles.listState}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        );
      }

      if (isError) {
        return (
          <View style={styles.listState}>
            <Text style={styles.errorTitle}>Could not load Pokémon</Text>
            <Text style={styles.errorCaption}>
              Check your connection and try again.
            </Text>
            <Pressable style={styles.retryButton} onPress={() => refresh()}>
              <Text style={commonStyles.primaryButtonText}>Retry</Text>
            </Pressable>
          </View>
        );
      }

      return (
        <FlashList
          data={pokemonList}
          keyExtractor={keyExtractor}
          extraData={[selectedId, favoriteId]}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={listFooter}
        />
      );
    }, [
      isInitialLoading,
      isError,
      pokemonList,
      keyExtractor,
      selectedId,
      favoriteId,
      renderItem,
      loadMore,
      listFooter,
      refresh,
    ]);

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
          {selectedPin?.pokemon && (
            <PokemonDetailContent
              pokemon={selectedPin.pokemon}
              action={{
                label: 'Delete pin',
                onPress: handleDeletePin,
                variant: 'destructive',
              }}
            />
          )}

          {selectedPin && !selectedPin.pokemon && (
            <>
              <Text style={styles.title}>New pin</Text>
              <Text style={styles.subtitle}>
                {formatCoordinates(selectedPin.latitude, selectedPin.longitude)}
              </Text>

              <View style={styles.listContainer}>{listContent}</View>

              <Pressable
                style={({ pressed }) => [
                  commonStyles.primaryButton,
                  (!selectedPokemon || isSelectedPokemonAssigned || isInitialLoading || isError) &&
                    commonStyles.primaryButtonDisabled,
                  pressed &&
                    selectedPokemon &&
                    !isSelectedPokemonAssigned &&
                    !isInitialLoading &&
                    !isError &&
                    styles.buttonPressed,
                ]}
                onPress={handleAssignPokemon}
                disabled={!selectedPokemon || isSelectedPokemonAssigned || isInitialLoading || isError}
              >
                <Text style={commonStyles.primaryButtonText}>Assign Pokémon</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleDeletePin}
              >
                <Text style={styles.deleteButtonText}>Delete pin</Text>
              </Pressable>
            </>
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
    height: LIST_HEIGHT,
    marginTop: spacing.md,
  },
  listState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  listFooter: {
    margin: spacing.lg,
  },
  errorTitle: {
    ...typography.heading,
    fontFamily: fonts.nunitoBold,
    fontSize: 18,
    textAlign: 'center',
  },
  errorCaption: {
    ...typography.caption,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    ...commonStyles.primaryButton,
    width: 'auto',
    paddingHorizontal: spacing.xl,
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
