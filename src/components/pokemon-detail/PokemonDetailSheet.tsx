import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonDetailContent from '@/components/pokemon-detail/PokemonDetailContent';
import ModalSheetContainer from '@/components/sheets/ModalSheetContainer';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';
import { useModalBottomSheet } from '@/hooks/useModalBottomSheet';

export type PokemonDetailSheetRef = {
  open: (pokemon: PokemonListItem) => void;
  close: () => void;
};

type Props = {
  onSelectionChange?: (pokemon: PokemonListItem | null) => void;
};

const ALREADY_FAVORITE_LABEL = 'Already your Favorite';
const SET_AS_FAVORITE_LABEL = 'Set as Favorite';

const PokemonDetailSheet = forwardRef<PokemonDetailSheetRef, Props>(
  ({ onSelectionChange }, ref) => {
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);
    const { isFavorite, addFavoritePokemon } = useFavoritePokemon();

    const clearSelection = useCallback(() => {
      onSelectionChange?.(null);
    }, [onSelectionChange]);

    const {
      index,
      requestOpen,
      close,
      handleIndexChange,
      handleSettle,
    } = useModalBottomSheet({
      shouldOpen: selectedPokemon !== null,
      onClearSelection: clearSelection,
      onSettleClosed: () => setSelectedPokemon(null),
    });

    const isCurrentFavorite = selectedPokemon ? isFavorite(selectedPokemon.id) : false;

    const handleFavoritePress = useCallback(() => {
      if (selectedPokemon) addFavoritePokemon(selectedPokemon);
    }, [selectedPokemon, addFavoritePokemon]);

    useImperativeHandle(ref, () => ({
      open: (next) => {
        setSelectedPokemon(next);
        onSelectionChange?.(next);
        requestOpen();
      },
      close,
    }));

    return (
      <ModalSheetContainer
        index={index}
        onIndexChange={handleIndexChange}
        onSettle={handleSettle}
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
      </ModalSheetContainer>
    );
  },
);

PokemonDetailSheet.displayName = 'PokemonDetailSheet';

export default PokemonDetailSheet;
