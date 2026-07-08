import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
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

const ALREADY_FAVORITE_LABEL = 'Already your Favorite';
const SET_AS_FAVORITE_LABEL = 'Set as Favorite';

const PokemonDetailSheet = forwardRef<PokemonDetailSheetRef, Props>(
  ({ onSelectionChange }, ref) => {
    const insets = useSafeAreaInsets();
    const indexRef = useRef(CLOSED_INDEX);
    const [index, setIndexState] = useState(CLOSED_INDEX);
    const [openRequest, setOpenRequest] = useState(0);
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);
    const { isFavorite, addFavoritePokemon } = useFavoritePokemon();

    const setIndex = useCallback((nextIndex: number) => {
      indexRef.current = nextIndex;
      setIndexState(nextIndex);
    }, []);

    const isCurrentFavorite = selectedPokemon ? isFavorite(selectedPokemon.id) : false;

    const handleFavoritePress = useCallback(() => {
      if (selectedPokemon) addFavoritePokemon(selectedPokemon);
    }, [selectedPokemon, addFavoritePokemon]);

    useImperativeHandle(ref, () => ({
      open: (next) => {
        setSelectedPokemon(next);
        onSelectionChange?.(next);
        setOpenRequest((count) => count + 1);
      },
      close: () => {
        onSelectionChange?.(null);
        setIndex(CLOSED_INDEX);
      },
    }));

    useEffect(() => {
      if (!selectedPokemon || openRequest === 0) return;

      const frame = requestAnimationFrame(() => {
        setIndex(OPEN_INDEX);
      });

      return () => cancelAnimationFrame(frame);
    }, [openRequest, selectedPokemon, setIndex]);

    const handleIndexChange = useCallback(
      (nextIndex: number) => {
        setIndex(nextIndex);
        if (nextIndex === CLOSED_INDEX) {
          onSelectionChange?.(null);
        }
      },
      [onSelectionChange, setIndex],
    );

    const handleSettle = useCallback((nextIndex: number) => {
      if (nextIndex !== CLOSED_INDEX) return;

      requestAnimationFrame(() => {
        if (indexRef.current === CLOSED_INDEX) {
          setSelectedPokemon(null);
        }
      });
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
                label: isCurrentFavorite ? ALREADY_FAVORITE_LABEL : SET_AS_FAVORITE_LABEL,
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
