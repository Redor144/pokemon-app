import type { PokemonListItem } from "@/types/pokemon";

export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  pokemon: PokemonListItem | null;
};
