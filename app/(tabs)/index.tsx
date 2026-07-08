import { StyleSheet, Text, View } from 'react-native';
import { Heart } from 'lucide-react-native';
import { commonStyles } from '@/styles/common';
import { colors, fonts, radius, spacing, typography } from '@/constants/theme';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';
import PokemonDetailContent from '@/components/PokemonDetailContent';
import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { TabHeaderIcon } from '@/components/tabBarOptions';

const NO_FAVORITE_TITLE = 'No favorite yet';
const NO_FAVORITE_CAPTION = 'Open the Pokédex and set a Pokémon as your favorite.';

const REMOVE_FAVORITE_LABEL = 'Remove Favorite';

export default function FavoriteScreen() {
  const { favorite, clearFavoritePokemon } = useFavoritePokemon();
  const navigation = useNavigation();
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: favorite
        ? () => <TabHeaderIcon icon={Heart} filled variant="secondary" />
        : undefined,
    });
  }, [navigation, favorite]);

  if (!favorite) {
    return (
      <View style={commonStyles.centered}>
        <Heart color={colors.mutedForeground} size={40} />
        <Text style={styles.emptyTitle}>{NO_FAVORITE_TITLE}</Text>
        <Text style={styles.emptyCaption}>
          {NO_FAVORITE_CAPTION}
        </Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.screen}>
      <View style={styles.card}>
        <View style={commonStyles.sheetContent}>
          <PokemonDetailContent
            pokemon={favorite}
            action={{
              label: REMOVE_FAVORITE_LABEL,
              onPress: clearFavoritePokemon,
              variant: 'destructive',
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderColor: colors.border,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: spacing.xl,
    marginTop: spacing.xl,
    marginHorizontal: spacing.md,
  },
  emptyTitle: {
    ...typography.heading,
    fontFamily: fonts.nunitoBold,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptyCaption: {
    ...typography.caption,
    marginTop: spacing.sm,
    textAlign: 'center',
    maxWidth: 260,
  },
});
