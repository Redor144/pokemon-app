import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPokemonPage } from "@/lib/pokeapi";

const LIMIT = 20;

type Options = {
  enabled?: boolean;
};

export function usePokemonList({ enabled = true }: Options = {}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useInfiniteQuery({
    queryKey: ["pokemon", "list", "v2"],
    queryFn: ({ pageParam = 0 }) => fetchPokemonPage(pageParam, LIMIT),
    initialPageParam: 0,
    enabled,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + LIMIT : undefined,
  });

  const pokemonList = data?.pages.flatMap((page) => page.items) ?? [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    pokemonList,
    isFetchingNextPage,
    isInitialLoading: isLoading || (isFetching && !data),
    isRefreshing: isRefetching,
    hasMore: hasNextPage ?? false,
    loadMore,
    refresh: refetch,
    isError,
  };
}
