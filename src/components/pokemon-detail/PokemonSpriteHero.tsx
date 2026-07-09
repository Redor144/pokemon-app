import { View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { getPokemonType } from '@/constants/pokemonTypes';
import PokemonSprite from '@/components/ui/PokemonSprite';
import {
  GLOW_SIZE,
  SPRITE_SIZE,
  pokemonDetailStyles,
} from '@/components/pokemon-detail/pokemonDetailStyles';

type Props = {
  pokemonId: number;
  imageUrl: string;
  primaryType: string;
};

export default function PokemonSpriteHero({ pokemonId, imageUrl, primaryType }: Props) {
  const glowColor = getPokemonType(primaryType).color;
  const glowId = `sprite-glow-${pokemonId}`;
  const glowRadius = GLOW_SIZE / 2;

  return (
    <View style={pokemonDetailStyles.spriteHero}>
      <Svg
        width={GLOW_SIZE}
        height={GLOW_SIZE}
        style={pokemonDetailStyles.spriteGlow}
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
      <PokemonSprite imageUrl={imageUrl} size={SPRITE_SIZE} />
    </View>
  );
}
