export const CAMERA_PERMISSION_REQUIRED_TITLE = "Camera Permission Required";
export const LOADING_CAMERA_TITLE = "Loading Camera…";
export const GRANT_PERMISSION_LABEL = "Grant permission";

export const OBJECT_TRACKING_BBOX_COLOR = "#4ade80";

export const MIN_TRACKING_IOU = 0.25;
export const TRACK_MISS_LIMIT = 4;

export const BBOX_PULSE = {
  scanning: {
    durationMs: 500,
    minOpacity: 0.35,
    maxOpacity: 1,
    minScale: 0.96,
    maxScale: 1.04,
  },
  tracking: {
    durationMs: 900,
    minOpacity: 0.55,
    maxOpacity: 1,
    minScale: 0.98,
    maxScale: 1.02,
  },
} as const;
