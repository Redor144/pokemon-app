// Maps between view coordinates (tap / overlay) and ExecuTorch screen-space coordinates.
// runOnFrame returns bboxes in screen-space; sensor frames are landscape-native, so width/height
// are swapped relative to portrait preview. The preview uses "cover" scaling.

type Size = { width: number; height: number };

export type Bbox = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type ViewRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function getCoverTransform(viewSize: Size, imageSize: Size) {
  const scale = Math.max(
    viewSize.width / imageSize.width,
    viewSize.height / imageSize.height,
  );
  const displayedWidth = imageSize.width * scale;
  const displayedHeight = imageSize.height * scale;

  return {
    scale,
    offsetX: (viewSize.width - displayedWidth) / 2,
    offsetY: (viewSize.height - displayedHeight) / 2,
  };
}

export function viewPointToImagePoint(
  tapX: number,
  tapY: number,
  viewSize: Size,
  imageSize: Size,
): { x: number; y: number } {
  const { scale, offsetX, offsetY } = getCoverTransform(viewSize, imageSize);

  return {
    x: (tapX - offsetX) / scale,
    y: (tapY - offsetY) / scale,
  };
}

export function imageBboxToViewRect(
  bbox: Bbox,
  viewSize: Size,
  imageSize: Size,
): ViewRect {
  const { scale, offsetX, offsetY } = getCoverTransform(viewSize, imageSize);

  return {
    left: offsetX + bbox.x1 * scale,
    top: offsetY + bbox.y1 * scale,
    width: (bbox.x2 - bbox.x1) * scale,
    height: (bbox.y2 - bbox.y1) * scale,
  };
}
