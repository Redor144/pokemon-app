import type { LucideIcon } from 'lucide-react-native';
import {
  Bird,
  Bug,
  Circle,
  Stone,
  Flame,
  Droplets,
  FlaskConical,
  Ghost,
  Leaf,
  Snowflake,
  Sparkles,
  Zap,
  Hand,
  Shield,
  Moon,
  Shovel,
} from 'lucide-react-native';

export type PokemonTypeSlug =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'psychic'
  | 'ghost'
  | 'bug'
  | 'flying'
  | 'poison'
  | 'fairy'
  | 'fighting'
  | 'rock'
  | 'steel'
  | 'dark'
  | 'dragon'
  | 'ground';

export type PokemonTypeMeta = {
  label: string;
  color: string;
  bg: string;
  icon: LucideIcon;
};

export const pokemonTypes: Record<PokemonTypeSlug, PokemonTypeMeta> = {
  normal: {
    label: 'Normal',
    color: '#A0A0B0',
    bg: 'rgba(160,160,176,0.15)',
    icon: Circle,
  },
  fire: {
    label: 'Fire',
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.15)',
    icon: Flame,
  },
  water: {
    label: 'Water',
    color: '#4FC3F7',
    bg: 'rgba(79,195,247,0.15)',
    icon: Droplets,
  },
  grass: {
    label: 'Grass',
    color: '#66BB6A',
    bg: 'rgba(102,187,106,0.15)',
    icon: Leaf,
  },
  electric: {
    label: 'Electric',
    color: '#FFCB05',
    bg: 'rgba(255,203,5,0.15)',
    icon: Zap,
  },
  ice: {
    label: 'Ice',
    color: '#80DEEA',
    bg: 'rgba(128,222,234,0.15)',
    icon: Snowflake,
  },
  psychic: {
    label: 'Psychic',
    color: '#FF80AB',
    bg: 'rgba(255,128,171,0.15)',
    icon: Sparkles,
  },
  ghost: {
    label: 'Ghost',
    color: '#9C6ADE',
    bg: 'rgba(156,106,222,0.15)',
    icon: Ghost,
  },
  bug: {
    label: 'Bug',
    color: '#8BC34A',
    bg: 'rgba(139,195,74,0.15)',
    icon: Bug,
  },
  flying: {
    label: 'Flying',
    color: '#80DEEA',
    bg: 'rgba(128,222,234,0.15)',
    icon: Bird,
  },
  poison: {
    label: 'Poison',
    color: '#CE93D8',
    bg: 'rgba(206,147,216,0.15)',
    icon: FlaskConical,
  },
  fairy: {
    label: 'Fairy',
    color: '#FF80AB',
    bg: 'rgba(255,128,171,0.15)',
    icon: Sparkles,
  },
  fighting: {
    label: 'Fighting',
    color: '#FF5252',
    bg: 'rgba(255,82,82,0.15)',
    icon: Hand,
  },
  rock: {
    label: 'Rock',
    color: '#FFB74D',
    bg: 'rgba(255,183,77,0.15)',
    icon: Stone,
  },
  steel: {
    label: 'Steel',
    color: '#B0B0B0',
    bg: 'rgba(176,176,176,0.15)',
    icon: Shield,
  },
  dark: {
    label: 'Dark',
    color: '#757575',
    bg: 'rgba(117,117,117,0.15)',
    icon: Moon,
  },
  dragon: {
    label: 'Dragon',
    color: '#64B5F6',
    bg: 'rgba(100,181,246,0.15)',
    icon: Flame,
  },
  ground: {
    label: 'Ground',
    color: '#808080',
    bg: 'rgba(128,128,128,0.15)',
    icon: Shovel,
  },
};

export const defaultPokemonType = pokemonTypes.normal;

export function getPokemonType(type: string): PokemonTypeMeta {
  return pokemonTypes[type as PokemonTypeSlug] ?? defaultPokemonType;
}
