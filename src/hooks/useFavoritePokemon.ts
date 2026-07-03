import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { FavoritePokemon } from "../types/pokemon";

const FAVORITE_KEY = "fav-poke";

export function useFavoritePokemon() {
    const [favorite, setFavorite] = useState<FavoritePokemon | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const loadFavorite = useCallback(async () => {
        setIsLoading(true);
        try {
            const raw = await AsyncStorage.getItem(FAVORITE_KEY);
            setFavorite(raw ? JSON.parse(raw) : null);
        } catch (error) {
            console.error("Error loading favorite Pokemon:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFavorite();
    }, [loadFavorite]);

    const addFavoritePokemon = useCallback(async (pokemon: FavoritePokemon) => {
        setFavorite(pokemon);
        await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(pokemon));
    }, []);

    const clearFavoritePokemon = useCallback(async () => {
        setFavorite(null);
        await AsyncStorage.removeItem(FAVORITE_KEY);
    }, []);

    return {
        favorite,
        isLoading,
        isFavorite: (id: number) => favorite?.id === id,
        addFavoritePokemon,
        clearFavoritePokemon,
        reload: loadFavorite,
    };
}