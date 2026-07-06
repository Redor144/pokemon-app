import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { commonStyles } from '@/styles/common';
import { colors, fonts, radius, spacing, typography } from '@/constants/theme';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';
import PokemonDetailContent from '@/components/PokemonDetailContent';
import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { TabHeaderIcon } from '@/components/tabBarOptions';


export default function FavoriteScreen() {
  const { favorite, clearFavoritePokemon } = useFavoritePokemon();
  const insets = useSafeAreaInsets();
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
        <Text style={styles.emptyTitle}>No favorite yet</Text>
        <Text style={styles.emptyCaption}>
          Open the Pokédex and set a Pokémon as your favorite.
        </Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <View style={styles.card}>
          <View style={commonStyles.sheetContent}>
            <PokemonDetailContent
              pokemon={favorite}
              action={{
                label: 'Remove Favorite',
                onPress: clearFavoritePokemon,
                variant: 'destructive',
              }}
            />
          </View>
        </View>
      </ScrollView>
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
