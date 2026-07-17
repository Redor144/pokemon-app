export type DetectionMode = "face" | "object";
export type CameraFacing = "front" | "back";

export type CameraPreviewRef = {
  captureForSave: () => Promise<string>;
};
