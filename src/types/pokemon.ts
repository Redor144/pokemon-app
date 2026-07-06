export type PokemonStats = {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
};

export type PokemonListItem = {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  types: string[];
} & PokemonStats;

export type FavoritePokemon = PokemonListItem; // to change