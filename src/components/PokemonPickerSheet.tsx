import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ModalBottomSheet } from '@swmansion/react-native-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/constants/theme';
import { commonStyles } from '@/styles/common';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonPickerList from '@/components/PokemonPickerList';

export type PokemonPickerSheetRef = {
  open: () => void;
  close: () => void;
};

type Props = {
  selectedId?: number | null;
  onSelect: (pokemon: PokemonListItem) => void;
};

const CLOSED_INDEX = 0;
const OPEN_INDEX = 1;
const LIST_HEIGHT = 280;
const CHOOSE_POKEMON_TITLE = 'Choose Pokémon';

const PokemonPickerSheet = forwardRef<PokemonPickerSheetRef, Props>(
  ({ selectedId, onSelect }, ref) => {
    const insets = useSafeAreaInsets();
    const { favorite } = useFavoritePokemon();
    const indexRef = useRef(CLOSED_INDEX);
    const [index, setIndexState] = useState(CLOSED_INDEX);
    const [openRequest, setOpenRequest] = useState(0);

    const setIndex = useCallback((nextIndex: number) => {
      indexRef.current = nextIndex;
      setIndexState(nextIndex);
    }, []);

    const closeSheet = useCallback(() => {
      setIndex(CLOSED_INDEX);
    }, [setIndex]);

    useImperativeHandle(ref, () => ({
      open: () => {
        setOpenRequest((count) => count + 1);
      },
      close: closeSheet,
    }));

    useEffect(() => {
      if (openRequest === 0) return;

      const frame = requestAnimationFrame(() => {
        setIndex(OPEN_INDEX);
      });

      return () => cancelAnimationFrame(frame);
    }, [openRequest, setIndex]);

    const handleIndexChange = useCallback(
      (nextIndex: number) => {
        setIndex(nextIndex);
      },
      [setIndex],
    );

    const handleSelect = useCallback(
      (pokemon: PokemonListItem) => {
        onSelect(pokemon);
        closeSheet();
      },
      [onSelect, closeSheet],
    );

    return (
      <ModalBottomSheet
        detents={[0, 'content']}
        index={index}
        onIndexChange={handleIndexChange}
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
          <Text style={styles.title}>{CHOOSE_POKEMON_TITLE}</Text>
          <View style={styles.listContainer}>
            <PokemonPickerList
              enabled={index === OPEN_INDEX}
              onSelect={handleSelect}
              selectedId={selectedId}
              favoriteId={favorite?.id}
              listHeight={LIST_HEIGHT}
            />
          </View>
        </View>
      </ModalBottomSheet>
    );
  },
);

PokemonPickerSheet.displayName = 'PokemonPickerSheet';

export default PokemonPickerSheet;

const styles = StyleSheet.create({
  sheetContent: {
    alignItems: 'stretch',
  },
  title: {
    ...typography.heading,
    textAlign: 'center',
  },
  listContainer: {
    width: '100%',
  },
});
