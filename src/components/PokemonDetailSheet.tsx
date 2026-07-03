import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState,
    memo,
  } from 'react';
  import { Pressable, StyleSheet, Text, View } from 'react-native';
  import { ModalBottomSheet } from '@swmansion/react-native-bottom-sheet';
  import { useSafeAreaInsets } from 'react-native-safe-area-context';
  import { colors, fonts, radius, spacing } from '@/constants/theme';
  import { getPokemonType } from '@/constants/pokemonTypes';
  import { commonStyles } from '@/styles/common';
  import type { PokemonListItem } from '@/types/pokemon';
  import PokemonSprite from '@/components/PokemonSprite';
  import { useFavoritePokemon } from '@/hooks/useFavoritePokemon';
  
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
  const STAT_COLOR = '#ff5f36'

  function formatId(id: number) {
    return `#${String(id).padStart(3, '0')}`;
  }
  const TypeBadge = memo(function TypeBadge({ type }: { type: string }) {
    const meta = getPokemonType(type);
    const Icon = meta.icon;
    return (
      <View style={[styles.typeBadge, { backgroundColor: meta.bg, borderColor: meta.color }]}>
        <Icon color={meta.color} size={10} />
        <Text style={[styles.typeText, { color: meta.color }]}>{type.toUpperCase()}</Text>
      </View>
    );
  });
  function StatRow({ label, value }: { label: string; value: number }) {
    const percent = Math.min(value / MAX_STAT, 1);
    return (
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.statTrack}>
          <View style={[styles.statFill, { width: `${percent * 100}%` }]} />
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
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.background,
              ]}
            />
          }
        >
          <View
            style={[
              styles.content,
              { paddingBottom: insets.bottom + spacing.xl },
            ]}
          >
            {pokemon && (
            <>
                <Text style={styles.id}>{formatId(pokemon.id)}</Text>

                <PokemonSprite imageUrl={pokemon.imageUrl} size={180} />

                <Text style={styles.name}>{pokemon.name}</Text>

                <View style={styles.typeRow}>
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
                style={[styles.favoriteButton, isCurrentFavorite && styles.favoriteButtonDisabled]}
                onPress={handleFavoritePress}
                disabled={isCurrentFavorite}
                >
                <Text style={styles.favoriteButtonText}>
                    {isCurrentFavorite ? 'Favorite' : 'Set as Favorite'}
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
    background: {
      backgroundColor: colors.card,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
    },
    content: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        gap: spacing.md,
      },
      id: {
        alignSelf: 'flex-start',
        fontFamily: fonts.dmMonoRegular,
        fontSize: 11,
        color: colors.mutedForeground,
      },
      name: {
        fontFamily: fonts.nunitoBold,
        fontSize: 24,
        color: colors.foreground,
        textTransform: 'capitalize',
        textAlign: 'center',
      },
      typeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.xs,
      },
      typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.full,
        borderWidth: 1,
      },
      typeText: {
        fontFamily: fonts.nunitoBold,
        fontSize: 9,
        letterSpacing: 0.5,
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
        fontFamily: fonts.dmMonoRegular,
        fontSize: 12,
        color: colors.mutedForeground,
      },
      statTrack: {
        flex: 1,
        height: 6,
        backgroundColor: colors.muted,
        borderRadius: radius.full,
        overflow: 'hidden',
      },
      statFill: {
        height: '100%',
        backgroundColor: STAT_COLOR,
        borderRadius: radius.full,
      },
      statValue: {
        width: 32,
        textAlign: 'right',
        fontFamily: fonts.dmMonoMedium,
        fontSize: 12,
        color: STAT_COLOR,
      },
      favoriteButton: {
        width: '100%',
        marginTop: spacing.sm,
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        paddingVertical: spacing.md,
        alignItems: 'center',
      },
      favoriteButtonDisabled: {
        opacity: 0.6,
      },
      favoriteButtonText: {
        fontFamily: fonts.nunitoBold,
        fontSize: 16,
        color: colors.primaryForeground,
      },
  });