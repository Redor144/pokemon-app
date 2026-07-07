import { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  Pressable,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { commonStyles } from '@/styles/common';
import { fonts, spacing, typography, colors } from '@/constants/theme';
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
    isInitialLoading,
    isFetchingNextPage,
    isRefreshing,
    hasMore,
    loadMore,
    refresh,
    isError,
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
      return <ActivityIndicator size="large" color={colors.primary} style={{ margin: spacing.lg }} />;
    }
    if (!hasMore && pokemonList.length > 0) {
      return <Text style={commonStyles.footerCaption}>No more Pokémon</Text>;
    }
    return null;
  }, [hasMore, isFetchingNextPage, pokemonList.length]);

  if (isInitialLoading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={commonStyles.centered}>
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
    <View style={commonStyles.screen}>
      <FlashList
        data={pokemonList}
        keyExtractor={keyExtractor}
        extraData={[selectedId, favoriteId]}
        contentContainerStyle={commonStyles.listContent}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListFooterComponent={listFooter}
      />

      <PokemonDetailSheet
        ref={sheetRef}
        onSelectionChange={setSelectedPokemon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  errorTitle: {
    ...typography.heading,
    fontFamily: fonts.nunitoBold,
    textAlign: 'center',
  },
  errorCaption: {
    ...typography.caption,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    textAlign: 'center',
    maxWidth: 260,
  },
  retryButton: {
    ...commonStyles.primaryButton,
    width: 'auto',
    paddingHorizontal: spacing.xl,
  },
});
