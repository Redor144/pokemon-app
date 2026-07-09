import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PokemonSprite from '@/components/ui/PokemonSprite';
import { computeSpritePlacement } from '@/components/face-overlay/computeSpritePlacement';
import type { DetectedFace, FaceOverlayRef } from '@/components/face-overlay/faceOverlayTypes';
import type { PokemonListItem } from '@/types/pokemon';

const MAX_FACES = 3;

type Props = {
  pokemon: PokemonListItem | null;
  faces?: DetectedFace[];
  onSpritesReady?: () => void;
};

const FaceOverlay = memo(
  forwardRef<FaceOverlayRef, Props>(function FaceOverlay(
    { pokemon, faces: frozenFaces, onSpritesReady },
    ref,
  ) {
    const [liveFaces, setLiveFaces] = useState<DetectedFace[]>([]);
    const facesRef = useRef<DetectedFace[]>([]);
    const loadedSpriteIndicesRef = useRef<Set<number>>(new Set());

    const displayFaces = frozenFaces ?? liveFaces;

    useImperativeHandle(ref, () => ({
      updateFaces: (nextFaces) => {
        const sliced = nextFaces.slice(0, MAX_FACES);
        facesRef.current = sliced;
        if (frozenFaces === undefined) {
          setLiveFaces(sliced);
        }
      },
      getFaces: () => facesRef.current,
    }));

    useEffect(() => {
      loadedSpriteIndicesRef.current = new Set();

      if (!onSpritesReady || !pokemon || displayFaces.length === 0) {
        onSpritesReady?.();
      }
    }, [displayFaces, onSpritesReady, pokemon]);

    const handleSpriteLoad = (index: number) => {
      loadedSpriteIndicesRef.current.add(index);
      if (onSpritesReady && loadedSpriteIndicesRef.current.size >= displayFaces.length) {
        onSpritesReady();
      }
    };

    if (!pokemon) return null;

    return (
      <View style={styles.container} pointerEvents="none">
        {displayFaces.map((face, index) => {
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
              <PokemonSprite
                imageUrl={pokemon.imageUrl}
                size={placement.size}
                onLoad={onSpritesReady ? () => handleSpriteLoad(index) : undefined}
              />
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
