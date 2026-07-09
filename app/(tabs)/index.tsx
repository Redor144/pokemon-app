import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';
import FavoriteDetailCard from '@/components/favorite/FavoriteDetailCard';
import FavoriteEmptyState from '@/components/favorite/FavoriteEmptyState';
import { useFavoriteHeader } from '@/hooks/useFavoriteHeader';

export default function FavoriteScreen() {
  const { favorite, clearFavoritePokemon } = useFavoritePokemon();
  useFavoriteHeader(favorite);

  if (!favorite) return <FavoriteEmptyState />;
  return <FavoriteDetailCard pokemon={favorite} onRemove={clearFavoritePokemon} />;
}
