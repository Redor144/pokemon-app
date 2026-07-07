import { memo, useCallback } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { commonStyles } from '@/styles/common';
import { colors, spacing, typography } from '@/constants/theme';
import type { PokemonListItem } from '@/types/pokemon';
import { Heart } from 'lucide-react-native';
import PokemonSprite from '@/components/PokemonSprite';
import TypeBadge from '@/components/TypeBadge';
import StatProgressBar from './StatProgressBar';

const MAX_HP = 255;

type Props = {
  pokemon: PokemonListItem;
  onPress: (pokemon: PokemonListItem) => void;
  isFavorite?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
  disabledLabel?: string;
};

function formatId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

function PokemonListRow({
  pokemon,
  onPress,
  isFavorite,
  isSelected,
  disabled,
  disabledLabel,
}: Props) {
  const hpPercent = Math.min(pokemon.hp / MAX_HP, 1);
  const handlePress = useCallback(() => {
    if (disabled) return;
    onPress(pokemon);
  }, [disabled, onPress, pokemon]);

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <View style={[commonStyles.row, isSelected && styles.selected, disabled && styles.disabled]}>
        <PokemonSprite imageUrl={pokemon.imageUrl} size={56} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[typography.pokemonName, styles.name]}>{pokemon.name}</Text>
            {isFavorite && <Heart color={colors.primary} size={14} fill={colors.primary} />}
          </View>
          <Text style={typography.pokemonId}>{formatId(pokemon.id)}</Text>
          {disabled && disabledLabel ? (
            <Text style={styles.disabledLabel}>{disabledLabel}</Text>
          ) : (
            <View style={[commonStyles.typeRow, styles.typeRow]}>
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.right}>
          <View style={styles.hpBlock}>
            <Text style={styles.hpLabel}>HP {pokemon.hp}</Text>
            <StatProgressBar percent={hpPercent} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default memo(PokemonListRow);

const styles = StyleSheet.create({
  selected: {
    borderWidth: 2,
    borderColor: colors.ring,
  },
  disabled: {
    opacity: 0.45,
  },
  disabledLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
    color: colors.mutedForeground,
  },
  info: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  name: { textTransform: 'capitalize' },
  typeRow: { marginTop: spacing.xs },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  hpBlock: { width: 72, gap: spacing.md },
  hpLabel: {
    ...typography.mono,
    marginBottom: spacing.xs,
    textAlign: 'right',
  },
});
