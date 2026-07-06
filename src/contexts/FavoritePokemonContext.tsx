import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FavoritePokemon } from '@/types/pokemon';

const FAVORITE_KEY = 'fav-poke';

type FavoritePokemonContextValue = {
  favorite: FavoritePokemon | null;
  isLoading: boolean;
  isFavorite: (id: number) => boolean;
  addFavoritePokemon: (pokemon: FavoritePokemon) => Promise<void>;
  clearFavoritePokemon: () => Promise<void>;
  reload: () => Promise<void>;
};

const FavoritePokemonContext = createContext<FavoritePokemonContextValue | null>(null);

export function FavoritePokemonProvider({ children }: { children: ReactNode }) {
  const [favorite, setFavorite] = useState<FavoritePokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadFavorite = useCallback(async () => {
    setIsLoading(true);
    try {
      const raw = await AsyncStorage.getItem(FAVORITE_KEY);
      setFavorite(raw ? JSON.parse(raw) : null);
    } catch (error) {
      console.error('Error loading favorite Pokemon:', error);
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

  const isFavorite = useCallback(
    (id: number) => favorite?.id === id,
    [favorite?.id],
  );

  const value = useMemo(
    () => ({
      favorite,
      isLoading,
      isFavorite,
      addFavoritePokemon,
      clearFavoritePokemon,
      reload: loadFavorite,
    }),
    [
      favorite,
      isLoading,
      isFavorite,
      addFavoritePokemon,
      clearFavoritePokemon,
      loadFavorite,
    ],
  );

  return (
    <FavoritePokemonContext.Provider value={value}>
      {children}
    </FavoritePokemonContext.Provider>
  );
}

export function useFavoritePokemon() {
  const context = useContext(FavoritePokemonContext);
  if (!context) {
    throw new Error('useFavoritePokemon must be used within FavoritePokemonProvider');
  }
  return context;
}
