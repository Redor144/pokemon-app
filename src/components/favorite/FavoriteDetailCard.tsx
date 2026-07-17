import { View } from "react-native";
import PokemonDetailContent from "../pokemon-detail/PokemonDetailContent";
import { favoriteStyles } from "@/components/favorite/favoriteStyles";
import { commonStyles } from "@/styles/common";
import type { PokemonListItem } from "@/types/pokemon";

const REMOVE_FAVORITE_LABEL = "Remove Favorite";

type Props = {
  pokemon: PokemonListItem;
  onRemove: () => void;
};

export default function FavoriteDetailCard({ pokemon, onRemove }: Props) {
  return (
    <View style={commonStyles.screen}>
      <View style={favoriteStyles.card}>
        <View style={commonStyles.sheetContent}>
          <PokemonDetailContent
            pokemon={pokemon}
            action={{
              label: REMOVE_FAVORITE_LABEL,
              onPress: onRemove,
              variant: "destructive",
            }}
          />
        </View>
      </View>
    </View>
  );
}
