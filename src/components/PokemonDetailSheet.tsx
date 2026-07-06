import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { ModalBottomSheet } from '@swmansion/react-native-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/constants/theme';
import { commonStyles } from '@/styles/common';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonDetailContent from '@/components/PokemonDetailContent';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';

export type PokemonDetailSheetRef = {
  open: (pokemon: PokemonListItem) => void;
  close: () => void;
};

type Props = {
  onSelectionChange?: (pokemon: PokemonListItem | null) => void;
};

const CLOSED_INDEX = 0;
const OPEN_INDEX = 1;

const PokemonDetailSheet = forwardRef<PokemonDetailSheetRef, Props>(
  ({ onSelectionChange }, ref) => {
    const insets = useSafeAreaInsets();
    const [index, setIndex] = useState(CLOSED_INDEX);
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);
    const { isFavorite, addFavoritePokemon } = useFavoritePokemon();

    const isCurrentFavorite = selectedPokemon ? isFavorite(selectedPokemon.id) : false;

    const handleFavoritePress = useCallback(() => {
      if (selectedPokemon) addFavoritePokemon(selectedPokemon);
    }, [selectedPokemon, addFavoritePokemon]);

    useImperativeHandle(ref, () => ({
      open: (next) => {
        setSelectedPokemon(next);
        onSelectionChange?.(next);
        setIndex(OPEN_INDEX);
      },
      close: () => {
        onSelectionChange?.(null);
        setIndex(CLOSED_INDEX);
      },
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

    const handleSettle = useCallback((nextIndex: number) => {
      if (nextIndex === CLOSED_INDEX) {
        setSelectedPokemon(null);
      }
    }, []);

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
            { paddingBottom: insets.bottom + spacing.xl },
          ]}
        >
          {selectedPokemon && (
            <PokemonDetailContent
              pokemon={selectedPokemon}
              action={{
                label: isCurrentFavorite ? 'Already your Favorite' : 'Set as Favorite',
                onPress: handleFavoritePress,
                disabled: isCurrentFavorite,
              }}
            />
          )}
        </View>
      </ModalBottomSheet>
    );
  },
);

PokemonDetailSheet.displayName = 'PokemonDetailSheet';

export default PokemonDetailSheet;
