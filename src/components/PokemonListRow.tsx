import { memo, useCallback } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { commonStyles } from '@/styles/common';
import { colors, spacing, radius, fonts } from '@/constants/theme';
import { getPokemonType } from '@/constants/pokemonTypes';
import type { PokemonListItem } from '@/types/pokemon';
import { Heart } from 'lucide-react-native';
import PokemonSprite from '@/components/PokemonSprite';

const MAX_HP = 255;

type Props = {
  pokemon: PokemonListItem;
  onPress: (pokemon: PokemonListItem) => void;
  isFavorite?: boolean;
  isSelected?: boolean;
};

function formatId(id: number): string {
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

function PokemonListRow({ pokemon, onPress, isFavorite, isSelected }: Props) {
  const hpPercent = Math.min(pokemon.hp / MAX_HP, 1);
  const handlePress = useCallback(() => onPress(pokemon), [onPress, pokemon]);

  return (
    <Pressable onPress={handlePress}>
      <View style={[commonStyles.row, isSelected && styles.selected]}>
        <PokemonSprite imageUrl={pokemon.imageUrl} size={56} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{pokemon.name}</Text>
            {isFavorite && <Heart color={colors.primary} size={14} fill={colors.primary}/>}
          </View>
          <Text style={styles.id}>{formatId(pokemon.id)}</Text>
          <View style={styles.typeRow}>
            {pokemon.types.map((type) => <TypeBadge key={type} type={type} />)}
          </View>
        </View>

        <View style={styles.right}>
          <View style={styles.hpBlock}>
            <Text style={styles.hpLabel}>HP {pokemon.hp}</Text>
            <View style={styles.hpTrack}>
              <View style={[styles.hpFill, { width: `${hpPercent * 100}%` }]} />
            </View>
          </View>
        </View>
        {/* later: favorite icon when isFavorite */}
      </View>
    </Pressable>
  );
}

export default memo(PokemonListRow);

const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#12121c',
      borderWidth: 1,
      borderColor: '#b58e3d',
      borderRadius: radius.xl,
      padding: spacing.md,
      marginBottom: spacing.md,
      gap: spacing.lg,
    },
    selected: {
      borderWidth: 2,
      borderColor: colors.ring,
    },
    info: { flex: 1, gap: 2 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    name: {
      fontFamily: fonts.nunitoBold,
      fontSize: 16,
      color: colors.foreground,
      textTransform: 'capitalize',
    },
    id: {
      fontFamily: fonts.dmMonoRegular,
      fontSize: 11,
      color: colors.mutedForeground,
    },
    typeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: radius.full,
      borderWidth: 1,
      marginTop: 4,
    },
    typeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 4,
    },
    typeText: {
      fontFamily: fonts.nunitoBold,
      fontSize: 9,
      letterSpacing: 0.5,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    hpBlock: { width: 72 },
    hpLabel: {
      fontFamily: fonts.dmMonoRegular,
      fontSize: 10,
      color: colors.mutedForeground,
      marginBottom: 4,
      textAlign: 'right',
    },
    hpTrack: {
      height: 4,
      backgroundColor: colors.muted,
      borderRadius: radius.full,
      overflow: 'hidden',
    },
    hpFill: {
      height: '100%',
      backgroundColor: '#ff5f36',
      borderRadius: radius.full,
    },
  });