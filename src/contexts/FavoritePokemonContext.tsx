import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FAVORITE_KEY, storage } from "@/lib/storage";
import type { FavoritePokemon } from "@/types/pokemon";

function readFavorite(): FavoritePokemon | null {
  try {
    const raw = storage.getString(FAVORITE_KEY);
    return raw ? (JSON.parse(raw) as FavoritePokemon) : null;
  } catch (error) {
    console.error("Error loading favorite Pokemon:", error);
    return null;
  }
}

type FavoritePokemonContextValue = {
  favorite: FavoritePokemon | null;
  isFavorite: (id: number) => boolean;
  addFavoritePokemon: (pokemon: FavoritePokemon) => void;
  clearFavoritePokemon: () => void;
  reload: () => void;
};

const FavoritePokemonContext =
  createContext<FavoritePokemonContextValue | null>(null);

export function FavoritePokemonProvider({ children }: { children: ReactNode }) {
  const [favorite, setFavorite] = useState<FavoritePokemon | null>(
    readFavorite,
  );

  const reload = useCallback(() => {
    setFavorite(readFavorite());
  }, []);

  const addFavoritePokemon = useCallback((pokemon: FavoritePokemon) => {
    setFavorite(pokemon);
    storage.set(FAVORITE_KEY, JSON.stringify(pokemon));
  }, []);

  const clearFavoritePokemon = useCallback(() => {
    setFavorite(null);
    storage.remove(FAVORITE_KEY);
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorite?.id === id,
    [favorite?.id],
  );

  const value = useMemo(
    () => ({
      favorite,
      isFavorite,
      addFavoritePokemon,
      clearFavoritePokemon,
      reload,
    }),
    [favorite, isFavorite, addFavoritePokemon, clearFavoritePokemon, reload],
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
    throw new Error(
      "useFavoritePokemon must be used within FavoritePokemonProvider",
    );
  }
  return context;
}
