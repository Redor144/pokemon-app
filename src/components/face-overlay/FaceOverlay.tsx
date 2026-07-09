import { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PokemonSprite from '@/components/ui/PokemonSprite';
import { computeSpritePlacement } from '@/components/face-overlay/computeSpritePlacement';
import type { DetectedFace, FaceOverlayRef } from '@/components/face-overlay/faceOverlayTypes';
import type { PokemonListItem } from '@/types/pokemon';

const MAX_FACES = 3;

type Props = {
  pokemon: PokemonListItem | null;
};

const FaceOverlay = memo(
  forwardRef<FaceOverlayRef, Props>(function FaceOverlay({ pokemon }, ref) {
    const [faces, setFaces] = useState<DetectedFace[]>([]);

    useImperativeHandle(ref, () => ({
      updateFaces: (nextFaces) => {
        setFaces(nextFaces.slice(0, MAX_FACES));
      },
    }));

    if (!pokemon) return null;

    return (
      <View style={styles.container} pointerEvents="none">
        {faces.map((face, index) => {
          const placement = computeSpritePlacement(face);

          return (
            <View
              key={index}
              style={[
                styles.sprite,
                {
                  left: placement.left,
                  top: placement.top,
                  width: placement.size,
                  height: placement.size,
                  transform: [
                    { translateX: placement.size / 2 },
                    { translateY: placement.pivotY },
                    { rotate: `${placement.rotation}deg` },
                    { translateX: -placement.size / 2 },
                    { translateY: -placement.pivotY },
                  ],
                },
              ]}
            >
              <PokemonSprite imageUrl={pokemon.imageUrl} size={placement.size} />
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
