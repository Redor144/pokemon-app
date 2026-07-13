import type { Detection } from 'react-native-executorch';
import { MIN_TRACKING_IOU } from '@/components/camera/cameraConstants';
import type { Bbox } from '@/components/camera/previewCoords';

function bboxCenter(detection: Detection) {
  const { x1, y1, x2, y2 } = detection.bbox;

  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };
}

function distanceSquared(x1: number, y1: number, x2: number, y2: number) {
  const dx = x1 - x2;
  const dy = y1 - y2;

  return dx * dx + dy * dy;
}

function containsPoint(detection: Detection, imageX: number, imageY: number) {
  const { x1, y1, x2, y2 } = detection.bbox;

  return imageX >= x1 && imageX <= x2 && imageY >= y1 && imageY <= y2;
}

function pickDetectionAtTap(
  detections: Detection[],
  imageX: number,
  imageY: number,
): Detection | null {
  if (detections.length === 0) {
    return null;
  }

  const containing = detections.filter((detection) => containsPoint(detection, imageX, imageY));

  if (containing.length > 0) {
    return containing.sort((a, b) => b.score - a.score)[0];
  }

  return detections
    .map((detection) => {
      const center = bboxCenter(detection);

      return {
        detection,
        distance: distanceSquared(imageX, imageY, center.x, center.y),
      };
    })
    .sort((a, b) => a.distance - b.distance)[0].detection;
}

export function bboxIoU(a: Bbox, b: Bbox): number {
  const x1 = Math.max(a.x1, b.x1);
  const y1 = Math.max(a.y1, b.y1);
  const x2 = Math.min(a.x2, b.x2);
  const y2 = Math.min(a.y2, b.y2);

  const intersectionWidth = Math.max(0, x2 - x1);
  const intersectionHeight = Math.max(0, y2 - y1);
  const intersection = intersectionWidth * intersectionHeight;

  const areaA = (a.x2 - a.x1) * (a.y2 - a.y1);
  const areaB = (b.x2 - b.x1) * (b.y2 - b.y1);
  const union = areaA + areaB - intersection;

  if (union <= 0) {
    return 0;
  }

  return intersection / union;
}

function pickContinuingDetection(
  detections: Detection[],
  lastBbox: Bbox,
  trackedLabel: string | null,
  minIoU = MIN_TRACKING_IOU,
): Detection | null {
  let best: { detection: Detection; iou: number } | null = null;

  for (const detection of detections) {
    if (trackedLabel !== null && String(detection.label) !== trackedLabel) {
      continue;
    }

    const iou = bboxIoU(lastBbox, detection.bbox);

    if (iou >= minIoU && (!best || iou > best.iou)) {
      best = { detection, iou };
    }
  }

  return best?.detection ?? null;
}

export function bboxesAreClose(a: Bbox, b: Bbox, threshold = 3): boolean {
  return (
    Math.abs(a.x1 - b.x1) < threshold &&
    Math.abs(a.y1 - b.y1) < threshold &&
    Math.abs(a.x2 - b.x2) < threshold &&
    Math.abs(a.y2 - b.y2) < threshold
  );
}

export function pickTrackedDetection(
  detections: Detection[],
  imagePoint: { x: number; y: number } | null,
  lastBbox: Bbox | null,
  trackedLabel: string | null = null,
): Detection | null {
  if (detections.length === 0) {
    return null;
  }

  if (imagePoint) {
    return pickDetectionAtTap(detections, imagePoint.x, imagePoint.y);
  }

  if (lastBbox) {
    return pickContinuingDetection(detections, lastBbox, trackedLabel);
  }

  return null;
}
