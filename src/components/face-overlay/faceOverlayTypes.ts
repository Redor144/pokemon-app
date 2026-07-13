type FaceBounds = { x: number; y: number; width: number; height: number };

export type DetectedFace = {
  bounds: FaceBounds;
};

export type FaceOverlayRef = {
  updateFaces: (faces: DetectedFace[]) => void;
  getFaces: () => DetectedFace[];
};
