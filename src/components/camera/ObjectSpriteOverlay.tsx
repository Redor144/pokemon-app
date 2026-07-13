import { StyleSheet, View } from 'react-native';
import PokemonSprite from '@/components/ui/PokemonSprite';
import type { PokemonListItem } from '@/types/pokemon';

export type BboxRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Props = {
  rect: BboxRect;
  pokemon: PokemonListItem;
  onSpriteReady?: () => void;
};

export default function ObjectSpriteOverlay({ rect, pokemon, onSpriteReady }: Props) {
  const spriteSize = Math.max(rect.width, rect.height);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      ]}
    >
      <PokemonSprite
        imageUrl={pokemon.imageUrl}
        size={spriteSize}
        style={{ width: rect.width, height: rect.height }}
        onLoad={onSpriteReady}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
