export type FaceBounds = { x: number; y: number; width: number; height: number };
export type FacePoint = { x: number; y: number };
export type FaceLandmarks = {
  LEFT_EYE?: FacePoint;
  RIGHT_EYE?: FacePoint;
  NOSE_BASE?: FacePoint;
};
export type DetectedFace = {
  bounds: FaceBounds;
  landmarks?: FaceLandmarks;
  rollAngle?: number;
};
export type FaceOverlayRef = {
  updateFaces: (faces: DetectedFace[]) => void;
  getFaces: () => DetectedFace[];
};

export type SpritePlacement = {
  left: number;
  top: number;
  size: number;
  pivotY: number;
  rotation: number;
};
