import type { DetectedFace } from '@/components/face-overlay/faceOverlayTypes';

const SPRITE_SIZE_RATIO = 0.95;
const SPRITE_ABOVE_RATIO = 0.7;

type SpritePlacement = {
  left: number;
  top: number;
  size: number;
};

export function computeSpritePlacement(face: DetectedFace): SpritePlacement {
  const { bounds } = face;
  const size = bounds.width * SPRITE_SIZE_RATIO;

  return {
    left: bounds.x + (bounds.width - size) / 2,
    top: bounds.y - size * SPRITE_ABOVE_RATIO,
    size,
  };
}
