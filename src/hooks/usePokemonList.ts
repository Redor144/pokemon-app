import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPokemonPage } from "@/lib/pokeapi";

const LIMIT = 20;

export function usePokemonList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isRefetching,
        refetch,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ['pokemon', 'list', 'v2'],
        queryFn: ({ pageParam = 0 }) => fetchPokemonPage(pageParam, LIMIT),
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => lastPage.hasMore ? lastPageParam + LIMIT : undefined,
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
        isInitialLoading: isFetching && !data,
        isRefreshing: isRefetching,
        hasMore: hasNextPage ?? false,
        loadMore,
        refresh: refetch,
        isError,
        error,
    };
}