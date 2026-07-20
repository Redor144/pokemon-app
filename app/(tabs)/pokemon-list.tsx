import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { commonStyles } from "@/styles/common";
import { useFavoritePokemon } from "@/contexts/FavoritePokemonContext";
import type { PokemonListItem } from "@/types/pokemon";
import PokemonPickerList from "@/components/pokemon-picker/PokemonPickerList";
import PokemonDetailSheet, {
  type PokemonDetailSheetRef,
} from "@/components/pokemon-detail/PokemonDetailSheet";
import { usePokemonList } from "@/hooks/usePokemonList";
import { TabHeaderCounter } from "@/components/navigation/tabBarOptions";
import { useTabHeaderRight } from "@/hooks/useTabHeaderRight";

export default function PokemonListScreen() {
  const { favorite } = useFavoritePokemon();
  const { pokemonList } = usePokemonList();
  const sheetRef = useRef<PokemonDetailSheetRef>(null);
  const [selectedPokemon, setSelectedPokemon] =
    useState<PokemonListItem | null>(null);

  useTabHeaderRight(
    (remountKey) => (
      <TabHeaderCounter value={pokemonList.length} remountKey={remountKey} />
    ),
    { remountOnFocus: true },
  );

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
