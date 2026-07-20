import { useFavoritePokemon } from "@/contexts/FavoritePokemonContext";
import FavoriteDetailCard from "@/components/favorite/FavoriteDetailCard";
import FavoriteEmptyState from "@/components/favorite/FavoriteEmptyState";
import { useTabHeaderRight } from "@/hooks/useTabHeaderRight";
import { TabHeaderIcon } from "@/components/navigation/tabBarOptions";
import { Heart } from "lucide-react-native";

export default function FavoriteScreen() {
  const { favorite, clearFavoritePokemon } = useFavoritePokemon();

  useTabHeaderRight(
    favorite
      ? () => <TabHeaderIcon icon={Heart} filled variant="secondary" />
      : null,
  );

  if (!favorite) return <FavoriteEmptyState />;
  return (
    <FavoriteDetailCard pokemon={favorite} onRemove={clearFavoritePokemon} />
  );
}
