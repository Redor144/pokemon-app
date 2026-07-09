import { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PokemonSprite from '@/components/PokemonSprite';
import type { PokemonListItem } from '@/types/pokemon';

export type FaceBounds = { x: number; y: number; width: number; height: number };
export type FaceOverlayRef = { updateFaces: (faces: FaceBounds[]) => void };

const MAX_FACES = 3;
const SPRITE_SIZE_RATIO = 0.65;
const FOREHEAD_OFFSET_RATIO = 2;

type Props = {
  pokemon: PokemonListItem | null;
};

const FaceOverlay = memo(
  forwardRef<FaceOverlayRef, Props>(function FaceOverlay({ pokemon }, ref) {
    const [faces, setFaces] = useState<FaceBounds[]>([]);

    useImperativeHandle(ref, () => ({
      updateFaces: (nextFaces) => {
        setFaces(nextFaces.slice(0, MAX_FACES));
      },
    }));

    if (!pokemon) return null;

    return (
      <View style={styles.container} pointerEvents="none">
        {faces.map((face, index) => {
          const spriteSize = face.width * SPRITE_SIZE_RATIO;
          const left = face.x + (face.width - spriteSize) / 2;
          const top = face.y - spriteSize * FOREHEAD_OFFSET_RATIO;

          return (
            <View
              key={index}
              style={[
                styles.sprite,
                {
                  left,
                  top,
                  width: spriteSize,
                  height: spriteSize,
                },
              ]}
            >
              <PokemonSprite imageUrl={pokemon.imageUrl} size={spriteSize} />
            </View>
          );
        })}
      </View>
    );
  }),
);

export default FaceOverlay;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  sprite: {
    position: 'absolute',
  },
});
