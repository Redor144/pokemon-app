import { Platform } from 'react-native';
import type {
  DetectedFace,
  FaceLandmarks,
  FacePoint,
  SpritePlacement,
} from '@/components/face-overlay/faceOverlayTypes';

const SPRITE_EYE_DISTANCE_RATIO = 3.2;
const CROWN_EYE_RATIO = 0.95;
const SEAT_OVERLAP_RATIO = 0.12;
const FALLBACK_SPRITE_SIZE_RATIO = 0.85;
const FALLBACK_SEAT_OVERLAP_RATIO = 0.1;

function computeRollRotation(face: DetectedFace): number {
  if (Platform.OS === 'android') {
    return face.rollAngle ?? 0;
  }

  return -(face.rollAngle ?? 0);
}

function rotatePoint(point: FacePoint, pivot: FacePoint, radians: number): FacePoint {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - pivot.x;
  const dy = point.y - pivot.y;

  return {
    x: pivot.x + dx * cos - dy * sin,
    y: pivot.y + dx * sin + dy * cos,
  };
}

function uprightLandmarks(landmarks: FaceLandmarks, rotation: number): FaceLandmarks {
  const leftEye = landmarks.LEFT_EYE;
  const rightEye = landmarks.RIGHT_EYE;

  if (!leftEye || !rightEye) {
    return landmarks;
  }

  const pivot = {
    x: (leftEye.x + rightEye.x) / 2,
    y: (leftEye.y + rightEye.y) / 2,
  };
  const radians = (-rotation * Math.PI) / 180;

  return {
    LEFT_EYE: rotatePoint(leftEye, pivot, radians),
    RIGHT_EYE: rotatePoint(rightEye, pivot, radians),
    NOSE_BASE: landmarks.NOSE_BASE
      ? rotatePoint(landmarks.NOSE_BASE, pivot, radians)
      : undefined,
  };
}

export function computeSpritePlacement(face: DetectedFace): SpritePlacement {
  const { bounds, landmarks } = face;
  const rotation = computeRollRotation(face);
  const alignedLandmarks = landmarks ? uprightLandmarks(landmarks, rotation) : undefined;
  const leftEye = alignedLandmarks?.LEFT_EYE;
  const rightEye = alignedLandmarks?.RIGHT_EYE;

  if (leftEye && rightEye) {
    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    const eyeCenterY = (leftEye.y + rightEye.y) / 2;
    const eyeDistance = Math.abs(rightEye.x - leftEye.x);

    if (eyeDistance > 0) {
      const size = eyeDistance * SPRITE_EYE_DISTANCE_RATIO;
      const nose = alignedLandmarks?.NOSE_BASE;
      const eyeToNose = nose ? nose.y - eyeCenterY : 0;
      const crownY =
        eyeToNose > 0
          ? eyeCenterY - eyeToNose * CROWN_EYE_RATIO
          : eyeCenterY - eyeDistance * CROWN_EYE_RATIO;

      const pivotY = size * (1 - SEAT_OVERLAP_RATIO);

      return {
        left: eyeCenterX - size / 2,
        top: crownY - pivotY,
        size,
        pivotY,
        rotation,
      };
    }
  }

  const size = bounds.width * FALLBACK_SPRITE_SIZE_RATIO;
  const pivotY = size * (1 - FALLBACK_SEAT_OVERLAP_RATIO);

  return {
    left: bounds.x + (bounds.width - size) / 2,
    top: bounds.y - pivotY,
    size,
    pivotY,
    rotation,
  };
}
