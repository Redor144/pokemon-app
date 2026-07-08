import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors, fonts, spacing, typography } from '@/constants/theme';
import { getPokemonType } from '@/constants/pokemonTypes';
import {
  ATTACK_LABEL,
  DEFENSE_LABEL,
  HP_LABEL,
  SPEED_LABEL,
} from '@/constants/pokemonStats';
import { commonStyles } from '@/styles/common';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonSprite from '@/components/PokemonSprite';
import StatProgressBar from '@/components/StatProgressBar';
import TypeBadge from '@/components/TypeBadge';

const SPRITE_SIZE = 180;
const GLOW_SIZE = 260;

const MAX_STAT = 255;

function formatId(id: number) {
  return `#${String(id).padStart(3, '0')}`;
}

function StatRow({ label, value }: { label: string; value: number }) {
  const percent = Math.min(value / MAX_STAT, 1);
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <StatProgressBar percent={percent} />
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

type ActionProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'destructive';
};

type Props = {
  pokemon: PokemonListItem;
  action?: ActionProps;
};

export default function PokemonDetailContent({ pokemon, action }: Props) {
  const actionStyles =
    action?.variant === 'destructive'
      ? [commonStyles.primaryButton, styles.destructiveButton]
      : [commonStyles.primaryButton, styles.actionButton];
  const glowColor = getPokemonType(pokemon.types[0] ?? 'normal').color;
  const glowId = `sprite-glow-${pokemon.id}`;
  const glowRadius = GLOW_SIZE / 2;

  return (
    <>
      <Text style={styles.id}>{formatId(pokemon.id)}</Text>
      <View style={styles.spriteHero}>
        <Svg
          width={GLOW_SIZE}
          height={GLOW_SIZE}
          style={styles.spriteGlow}
          pointerEvents="none"
        >
          <Defs>
            <RadialGradient id={glowId} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={glowColor} stopOpacity={0.45} />
              <Stop offset="55%" stopColor={glowColor} stopOpacity={0.15} />
              <Stop offset="100%" stopColor={glowColor} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={glowRadius} cy={glowRadius} r={glowRadius} fill={`url(#${glowId})`} />
        </Svg>
        <PokemonSprite imageUrl={pokemon.imageUrl} size={SPRITE_SIZE} />
      </View>
      <Text style={styles.name}>{pokemon.name}</Text>

      <View style={[commonStyles.typeRow, styles.typeRow]}>
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </View>

      <View style={styles.stats}>
        <StatRow label={HP_LABEL} value={pokemon.hp} />
        <StatRow label={ATTACK_LABEL} value={pokemon.attack} />
        <StatRow label={DEFENSE_LABEL} value={pokemon.defense} />
        <StatRow label={SPEED_LABEL} value={pokemon.speed} />
      </View>

      {action && (
        <Pressable
          style={[
            ...actionStyles,
            action.disabled && commonStyles.primaryButtonDisabled,
          ]}
          onPress={action.onPress}
          disabled={action.disabled}
        >
          <Text
            style={[
              commonStyles.primaryButtonText,
              action.variant === 'destructive' && styles.destructiveButtonText,
            ]}
          >
            {action.label}
          </Text>
        </Pressable>
      )}
    </>
  );
}

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
    gap: spacing.md,
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
  statValue: {
    width: 32,
    textAlign: 'right',
    fontFamily: fonts.dmMonoMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.stat,
  },
  actionButton: {
    marginTop: spacing.sm,
  },
  destructiveButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.secondary,
  },
  destructiveButtonText: {
    color: colors.destructiveForeground,
  },
  spriteHero: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: SPRITE_SIZE + spacing.lg,
    marginVertical: spacing.sm,
  },
  spriteGlow: {
    position: 'absolute',
  },
});
