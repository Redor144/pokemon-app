import { Text, View } from 'react-native';
import { commonStyles } from '@/styles/common';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';

export default function FavoriteScreen() {
  const { favorite } = useFavoritePokemon();

  if (!favorite) {
    return (
      <View style={commonStyles.centerContent}>
        <Text>Placeholder for NO favorite pokémon sad</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.centerContent}>
      <Text>Placeholder for favorite pokémon!</Text>
    </View>
  );
}
