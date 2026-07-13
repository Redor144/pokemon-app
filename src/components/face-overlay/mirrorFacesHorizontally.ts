import type { DetectedFace } from '@/components/face-overlay/faceOverlayTypes';

export function mirrorFacesHorizontally(
  faces: readonly DetectedFace[],
  viewWidth: number,
): DetectedFace[] {
  return faces.map((face) => ({
    bounds: {
      x: viewWidth - face.bounds.x - face.bounds.width,
      y: face.bounds.y,
      width: face.bounds.width,
      height: face.bounds.height,
    },
  }));
}
