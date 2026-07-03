import { useCallback, useRef, useState, useEffect } from "react";
import { fetchPokemonPage } from "../lib/pokeapi";
import type { PokemonListItem } from "../types/pokemon";

const LIMIT = 20;

export function usePokemonList() {
    const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadingMore = useRef(false);
    const offsetRef = useRef(0);

    const loadPage = useCallback(async (offset: number, append: boolean) => {
        if (loadingMore.current) return;
        loadingMore.current = true;
        setIsLoading(true);
        try {
            const { items, hasMore: more } = await fetchPokemonPage(offset, LIMIT);
            
            setHasMore(more);
            offsetRef.current = offset;
            
            setPokemonList((prev) => {
                if (!append) return items;
                const existingIds = new Set(prev.map(p => p.id));
                const newItems = items.filter(item => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });
        } catch (error) {
            console.error("Error loading Pokemon list:", error);
        } finally {
            loadingMore.current = false;
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadPage(0, false);
    }, [loadPage]);


    const loadMore = useCallback(() => {
        if (!hasMore || isLoading) return;
        loadPage(offsetRef.current + LIMIT, true);
    }, [hasMore, isLoading, loadPage]);

    const refresh = useCallback(async () => {
        setIsRefreshing(true);
        offsetRef.current = 0;
        setHasMore(true);
        loadPage(0, false);
    }, [loadPage]);

    return {
        pokemonList,
        isLoading,
        isRefreshing,
        hasMore,
        loadMore,
        refresh,
    };
}