import { memo } from 'react';
import { View, Pressable, Image, Text, StyleSheet } from 'react-native';
import { commonStyles } from '@/styles/common';
import { spacing } from '@/constants/theme';
import type { PokemonListItem } from '@/types/pokemon';

type Props = {
  pokemon: PokemonListItem;
  onPress: (pokemon: PokemonListItem) => void;
  isFavorite?: boolean;
};

function PokemonListRow({ pokemon, onPress, isFavorite }: Props) {
  return (
    <Pressable onPress={() => onPress(pokemon)}>
      <View style={commonStyles.row}>
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.thumbnail}
          resizeMode="contain"
        />
        <Text style={styles.rowText}>
          #{pokemon.id} - {pokemon.name}
        </Text>
        {/* later: favorite icon when isFavorite */}
      </View>
    </Pressable>
  );
}

export default memo(PokemonListRow);

const styles = StyleSheet.create({
  thumbnail: { width: 48, height: 48, marginRight: spacing.md },
  rowText: {
    color: '#ffffff',
    fontSize: 18,
    textTransform: 'capitalize',
    flex: 1,
  },
});