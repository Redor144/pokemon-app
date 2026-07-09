import { Pressable, Text, View } from 'react-native';
import {
  ATTACK_LABEL,
  DEFENSE_LABEL,
  HP_LABEL,
  SPEED_LABEL,
} from '@/constants/pokemonStats';
import { commonStyles } from '@/styles/common';
import type { PokemonListItem } from '@/types/pokemon';
import PokemonStatRow from '@/components/pokemon-detail/PokemonStatRow';
import PokemonSpriteHero from '@/components/pokemon-detail/PokemonSpriteHero';
import { pokemonDetailStyles } from '@/components/pokemon-detail/pokemonDetailStyles';
import TypeBadge from '@/components/ui/TypeBadge';

function formatId(id: number) {
  return `#${String(id).padStart(3, '0')}`;
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
      ? [commonStyles.primaryButton, pokemonDetailStyles.destructiveButton]
      : [commonStyles.primaryButton, pokemonDetailStyles.actionButton];

  return (
    <>
      <Text style={pokemonDetailStyles.id}>{formatId(pokemon.id)}</Text>
      <PokemonSpriteHero
        pokemonId={pokemon.id}
        imageUrl={pokemon.imageUrl}
        primaryType={pokemon.types[0] ?? 'normal'}
      />
      <Text style={pokemonDetailStyles.name}>{pokemon.name}</Text>

      <View style={[commonStyles.typeRow, pokemonDetailStyles.typeRow]}>
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </View>

      <View style={pokemonDetailStyles.stats}>
        <PokemonStatRow label={HP_LABEL} value={pokemon.hp} />
        <PokemonStatRow label={ATTACK_LABEL} value={pokemon.attack} />
        <PokemonStatRow label={DEFENSE_LABEL} value={pokemon.defense} />
        <PokemonStatRow label={SPEED_LABEL} value={pokemon.speed} />
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
              action.variant === 'destructive' && pokemonDetailStyles.destructiveButtonText,
            ]}
          >
            {action.label}
          </Text>
        </Pressable>
      )}
    </>
  );
}
