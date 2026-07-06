import { useCallback, useMemo, useRef, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, type ListRenderItem } from 'react-native';
import { commonStyles } from '@/styles/common';
import { spacing } from '@/constants/theme';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';
import { usePokemonList } from '@/hooks/usePokemonList';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonListRow from '@/components/PokemonListRow';
import PokemonDetailSheet, {
  type PokemonDetailSheetRef,
} from '@/components/PokemonDetailSheet';

export default function PokemonListScreen() {
  const {
    pokemonList,
    isFetchingNextPage,
    isRefreshing,
    hasMore,
    loadMore,
    refresh,
  } = usePokemonList();
  const { favorite } = useFavoritePokemon();
  const sheetRef = useRef<PokemonDetailSheetRef>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);

  const handleRowPress = useCallback((pokemon: PokemonListItem) => {
    sheetRef.current?.open(pokemon);
  }, []);

  const selectedId = selectedPokemon?.id;
  const favoriteId = favorite?.id;

  const keyExtractor = useCallback((item: PokemonListItem) => item.id.toString(), []);

  const renderItem: ListRenderItem<PokemonListItem> = useCallback(
    ({ item }) => (
      <PokemonListRow
        pokemon={item}
        onPress={handleRowPress}
        isSelected={selectedId === item.id}
        isFavorite={favoriteId === item.id}
      />
    ),
    [handleRowPress, selectedId, favoriteId],
  );

  const listFooter = useMemo(() => {
    if (hasMore && isFetchingNextPage) {
      return <ActivityIndicator size="large" style={{ margin: spacing.lg }} />;
    }
    if (!hasMore && pokemonList.length > 0) {
      return <Text style={commonStyles.footerCaption}>No more Pokémon</Text>;
    }
    return null;
  }, [hasMore, isFetchingNextPage, pokemonList.length]);

  return (
    <View style={commonStyles.screen}>
      <FlatList
        data={pokemonList}
        keyExtractor={keyExtractor}
        extraData={[selectedId, favoriteId]}
        contentContainerStyle={commonStyles.listContent}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListFooterComponent={listFooter}
      />

      <PokemonDetailSheet
        ref={sheetRef}
        onSelectionChange={setSelectedPokemon}
      />
    </View>
  );
}
