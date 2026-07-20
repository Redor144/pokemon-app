import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { FlashList, type ListRenderItem } from "@shopify/flash-list";
import { commonStyles } from "@/styles/common";
import { colors } from "@/constants/theme";
import type { PokemonListItem } from "@/types/pokemon";
import PokemonListRow from "@/components/pokemon-picker/PokemonListRow";
import { pokemonPickerStyles } from "@/components/pokemon-picker/pokemonPickerStyles";

const NO_MORE_POKEMON_TITLE = "No more Pokémon";

type Props = {
  pokemonList: PokemonListItem[];
  selectedId?: number | null;
  favoriteId?: number | null;
  disabledIds?: Set<number>;
  disabledLabel?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  enablePullToRefresh: boolean;
  showEndOfListFooter: boolean;
  isFetchingNextPage: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  onSelect: (pokemon: PokemonListItem) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
};

export default function PokemonPickerListContent({
  pokemonList,
  selectedId,
  favoriteId,
  disabledIds,
  disabledLabel,
  contentContainerStyle,
  enablePullToRefresh,
  showEndOfListFooter,
  isFetchingNextPage,
  isRefreshing,
  hasMore,
  onSelect,
  onLoadMore,
  onRefresh,
}: Props) {
  const keyExtractor = useCallback(
    (item: PokemonListItem) => item.id.toString(),
    [],
  );

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
          style={pokemonPickerStyles.listFooter}
        />
      );
    }
    if (showEndOfListFooter && !hasMore && pokemonList.length > 0) {
      return (
        <Text style={commonStyles.footerCaption}>{NO_MORE_POKEMON_TITLE}</Text>
      );
    }
    return null;
  }, [hasMore, isFetchingNextPage, showEndOfListFooter, pokemonList.length]);

  return (
    <FlashList
      data={pokemonList}
      keyExtractor={keyExtractor}
      extraData={[selectedId, favoriteId, disabledIds]}
      contentContainerStyle={contentContainerStyle}
      renderItem={renderItem}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        enablePullToRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
      ListFooterComponent={listFooter}
    />
  );
}
