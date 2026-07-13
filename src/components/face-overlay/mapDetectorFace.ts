import type { Face } from 'react-native-vision-camera-face-detector';
import type { DetectedFace } from '@/components/face-overlay/faceOverlayTypes';

function mapDetectorFace(face: Face): DetectedFace {
  return {
    bounds: {
      x: face.bounds.x,
      y: face.bounds.y,
      width: face.bounds.width,
      height: face.bounds.height,
    },
  };
}

export function mapDetectorFaces(faces: readonly Face[]): DetectedFace[] {
  return faces.map(mapDetectorFace);
}
