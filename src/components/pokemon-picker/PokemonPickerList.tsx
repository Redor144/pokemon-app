import { useEffect } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { usePokemonList } from '@/hooks/usePokemonList';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonPickerListContent from '@/components/pokemon-picker/PokemonPickerListContent';
import PokemonPickerListStates from '@/components/pokemon-picker/PokemonPickerListStates';
import { pokemonPickerStyles } from '@/components/pokemon-picker/pokemonPickerStyles';

export type QueryState = {
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

  const isEmbedded = listHeight !== undefined;
  const variant = isEmbedded ? 'embedded' : 'screen';

  if (!isEmbedded && isInitialLoading) {
    return (
      <View style={style}>
        <PokemonPickerListStates variant="screen" state="loading" />
      </View>
    );
  }

  if (!isEmbedded && isError) {
    return <PokemonPickerListStates variant="screen" state="error" onRetry={refresh} />;
  }

  const listContent = (() => {
    if (isEmbedded && isInitialLoading) {
      return <PokemonPickerListStates variant="embedded" state="loading" />;
    }

    if (isEmbedded && isError) {
      return <PokemonPickerListStates variant="embedded" state="error" onRetry={refresh} />;
    }

    return (
      <PokemonPickerListContent
        pokemonList={pokemonList}
        selectedId={selectedId}
        favoriteId={favoriteId}
        disabledIds={disabledIds}
        disabledLabel={disabledLabel}
        contentContainerStyle={contentContainerStyle}
        enablePullToRefresh={enablePullToRefresh}
        showEndOfListFooter={showEndOfListFooter}
        isFetchingNextPage={isFetchingNextPage}
        isRefreshing={isRefreshing}
        hasMore={hasMore}
        onSelect={onSelect}
        onLoadMore={loadMore}
        onRefresh={refresh}
      />
    );
  })();

  if (isEmbedded) {
    return (
      <View style={[pokemonPickerStyles.embeddedContainer, { height: listHeight }, style]}>
        {listContent}
      </View>
    );
  }

  return <View style={[pokemonPickerStyles.screenList, style]}>{listContent}</View>;
}
