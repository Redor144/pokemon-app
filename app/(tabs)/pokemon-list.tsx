import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { commonStyles } from '@/styles/common';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonPickerList from '@/components/PokemonPickerList';
import PokemonDetailSheet, {
  type PokemonDetailSheetRef,
} from '@/components/PokemonDetailSheet';

export default function PokemonListScreen() {
  const { favorite } = useFavoritePokemon();
  const sheetRef = useRef<PokemonDetailSheetRef>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);

  const handleRowPress = useCallback((pokemon: PokemonListItem) => {
    sheetRef.current?.open(pokemon);
  }, []);

  const selectedId = selectedPokemon?.id;
  const favoriteId = favorite?.id;

  return (
    <View style={commonStyles.screen}>
      <PokemonPickerList
        onSelect={handleRowPress}
        selectedId={selectedId}
        favoriteId={favoriteId}
        contentContainerStyle={commonStyles.listContent}
        enablePullToRefresh
        showEndOfListFooter
      />

      <PokemonDetailSheet
        ref={sheetRef}
        onSelectionChange={setSelectedPokemon}
      />
    </View>
  );
}
