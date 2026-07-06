import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ModalBottomSheet } from '@swmansion/react-native-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, typography } from '@/constants/theme';
import { commonStyles } from '@/styles/common';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonSprite from '@/components/PokemonSprite';
import TypeBadge from '@/components/TypeBadge';
import { useFavoritePokemon } from '@/contexts/FavoritePokemonContext';

export type PokemonDetailSheetRef = {
  open: (pokemon: PokemonListItem) => void;
  close: () => void;
};

type Props = {
  onSelectionChange?: (pokemon: PokemonListItem | null) => void;
};

const CLOSED_INDEX = 0;
const OPEN_INDEX = 1;

const MAX_STAT = 255;

function formatId(id: number) {
  return `#${String(id).padStart(3, '0')}`;
}

function StatRow({ label, value }: { label: string; value: number }) {
  const percent = Math.min(value / MAX_STAT, 1);
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={[commonStyles.progressTrack, commonStyles.progressTrackMd, styles.statTrack]}>
        <View style={[commonStyles.progressFill, { width: `${percent * 100}%` }]} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const PokemonDetailSheet = forwardRef<PokemonDetailSheetRef, Props>(
  ({ onSelectionChange }, ref) => {
    const insets = useSafeAreaInsets();
    const [index, setIndex] = useState(CLOSED_INDEX);
    const [pokemon, setPokemon] = useState<PokemonListItem | null>(null);
    const { isFavorite, addFavoritePokemon } = useFavoritePokemon();

    const isCurrentFavorite = pokemon ? isFavorite(pokemon.id) : false;

    const handleFavoritePress = useCallback(() => {
      if (pokemon) addFavoritePokemon(pokemon);
    }, [pokemon, addFavoritePokemon]);

    useImperativeHandle(ref, () => ({
      open: (next) => {
        setPokemon(next);
        onSelectionChange?.(next);
        setIndex(OPEN_INDEX);
      },
      close: () => {
        onSelectionChange?.(null);
        setIndex(CLOSED_INDEX);
      },
    }));

    const handleIndexChange = useCallback(
      (nextIndex: number) => {
        setIndex(nextIndex);
        if (nextIndex === CLOSED_INDEX) {
          onSelectionChange?.(null);
        }
      },
      [onSelectionChange],
    );

    const handleSettle = useCallback((nextIndex: number) => {
      if (nextIndex === CLOSED_INDEX) {
        setPokemon(null);
      }
    }, []);

    return (
      <ModalBottomSheet
        detents={[0, 'content']}
        index={index}
        onIndexChange={handleIndexChange}
        onSettle={handleSettle}
        scrimColor={colors.overlay}
        surface={
          <View style={[StyleSheet.absoluteFill, commonStyles.sheetSurface]} />
        }
      >
        <View
          style={[
            commonStyles.sheetContent,
            { paddingBottom: insets.bottom + spacing.xl },
          ]}
        >
          {pokemon && (
            <>
              <Text style={styles.id}>{formatId(pokemon.id)}</Text>

              <PokemonSprite imageUrl={pokemon.imageUrl} size={180} />

              <Text style={styles.name}>{pokemon.name}</Text>

              <View style={[commonStyles.typeRow, styles.typeRow]}>
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </View>

              <View style={styles.stats}>
                <StatRow label="HP" value={pokemon.hp} />
                <StatRow label="Attack" value={pokemon.attack} />
                <StatRow label="Defense" value={pokemon.defense} />
                <StatRow label="Speed" value={pokemon.speed} />
              </View>

              <Pressable
                style={[
                  commonStyles.primaryButton,
                  styles.favoriteButton,
                  isCurrentFavorite && commonStyles.primaryButtonDisabled,
                ]}
                onPress={handleFavoritePress}
                disabled={isCurrentFavorite}
              >
                <Text style={commonStyles.primaryButtonText}>
                  {isCurrentFavorite ? 'Already your Favorite' : 'Set as Favorite'}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </ModalBottomSheet>
    );
  },
);

PokemonDetailSheet.displayName = 'PokemonDetailSheet';

export default PokemonDetailSheet;

const styles = StyleSheet.create({
  id: {
    ...typography.pokemonId,
    alignSelf: 'flex-start',
  },
  name: {
    ...typography.pokemonNameLarge,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  typeRow: {
    justifyContent: 'center',
  },
  stats: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statLabel: {
    width: 72,
    ...typography.mono,
    fontSize: 12,
    lineHeight: 16,
  },
  statTrack: {
    flex: 1,
  },
  statValue: {
    width: 32,
    textAlign: 'right',
    fontFamily: fonts.dmMonoMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.stat,
  },
  favoriteButton: {
    marginTop: spacing.sm,
  },
});
