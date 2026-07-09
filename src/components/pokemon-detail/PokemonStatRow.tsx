import { Text, View } from 'react-native';
import StatProgressBar from '@/components/ui/StatProgressBar';
import { MAX_STAT, pokemonDetailStyles } from '@/components/pokemon-detail/pokemonDetailStyles';

type Props = {
  label: string;
  value: number;
};

export default function PokemonStatRow({ label, value }: Props) {
  const percent = Math.min(value / MAX_STAT, 1);

  return (
    <View style={pokemonDetailStyles.statRow}>
      <Text style={pokemonDetailStyles.statLabel}>{label}</Text>
      <StatProgressBar percent={percent} />
      <Text style={pokemonDetailStyles.statValue}>{value}</Text>
    </View>
  );
}
