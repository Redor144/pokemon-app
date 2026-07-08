import { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { commonStyles } from '@/styles/common';
import { colors, spacing } from '@/constants/theme';
import { usePokemonList } from '@/hooks/usePokemonList';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonListRow from '@/components/PokemonListRow';
import FeatureCardPlaceholder from '@/components/FeatureCardPlaceholder';
import {
  COULD_NOT_LOAD_POKEMON_CAPTION,
  COULD_NOT_LOAD_POKEMON_TITLE,
} from '@/constants/messages';

const NO_MORE_POKEMON_TITLE = 'No more Pokémon';

type QueryState = {
  isInitialLoading: boolean;
  isError: boolean;
};

type Props = {
  enabled?: boolean;
  onSelect: (pokemon: PokemonListItem) => void;
  selectedId?: number | null;
  favoriteId?: number | null;
  disabledIds?: Set<number>;
  disabledLabel?: string;
  listHeight?: number;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  enablePullToRefresh?: boolean;
  showEndOfListFooter?: boolean;
  onQueryStateChange?: (state: QueryState) => void;
};

export default function PokemonPickerList({
  enabled = true,
  onSelect,
  selectedId,
  favoriteId,
  disabledIds,
  disabledLabel,
  listHeight,
  style,
  contentContainerStyle,
  enablePullToRefresh = false,
  showEndOfListFooter = false,
  onQueryStateChange,
}: Props) {
  const {
    pokemonList,
    isInitialLoading,
    isFetchingNextPage,
    isRefreshing,
    hasMore,
    loadMore,
    refresh,
    isError,
  } = usePokemonList({ enabled });

  useEffect(() => {
    onQueryStateChange?.({ isInitialLoading, isError });
  }, [isInitialLoading, isError, onQueryStateChange]);

  const keyExtractor = useCallback((item: PokemonListItem) => item.id.toString(), []);

  const renderItem: ListRenderItem<PokemonListItem> = useCallback(
    ({ item }) => (
      <PokemonListRow
        pokemon={item}
        onPress={onSelect}
        isSelected={selectedId === item.id}
        isFavorite={favoriteId === item.id}
        disabled={disabledIds?.has(item.id)}
        disabledLabel={disabledLabel}
      />
    ),
    [onSelect, selectedId, favoriteId, disabledIds, disabledLabel],
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
    if (showEndOfListFooter && !hasMore && pokemonList.length > 0) {
      return <Text style={commonStyles.footerCaption}>{NO_MORE_POKEMON_TITLE}</Text>;
    }
    return null;
  }, [hasMore, isFetchingNextPage, showEndOfListFooter, pokemonList.length]);

  const isEmbedded = listHeight !== undefined;

  if (!isEmbedded && isInitialLoading) {
    return (
      <View style={[styles.screenState, style]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isEmbedded && isError) {
    return (
      <FeatureCardPlaceholder
        title={COULD_NOT_LOAD_POKEMON_TITLE}
        caption={COULD_NOT_LOAD_POKEMON_CAPTION}
        onAction={() => refresh()}
      />
    );
  }

  const listContent = (() => {
    if (isEmbedded && isInitialLoading) {
      return (
        <View style={styles.embeddedState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (isEmbedded && isError) {
      return (
        <View style={styles.embeddedState}>
          <FeatureCardPlaceholder
            title={COULD_NOT_LOAD_POKEMON_TITLE}
            caption={COULD_NOT_LOAD_POKEMON_CAPTION}
            onAction={() => refresh()}
          />
        </View>
      );
    }

    return (
      <FlashList
        data={pokemonList}
        keyExtractor={keyExtractor}
        extraData={[selectedId, favoriteId, disabledIds]}
        contentContainerStyle={contentContainerStyle}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          enablePullToRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          ) : undefined
        }
        ListFooterComponent={listFooter}
      />
    );
  })();

  if (isEmbedded) {
    return (
      <View style={[styles.embeddedContainer, { height: listHeight }, style]}>
        {listContent}
      </View>
    );
  }

  return (
    <View style={[styles.screenList, style]}>
      {listContent}
    </View>
  );
}

const styles = StyleSheet.create({
  screenState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenList: {
    flex: 1,
  },
  embeddedContainer: {
    width: '100%',
  },
  embeddedState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  listFooter: {
    margin: spacing.lg,
  },
});
