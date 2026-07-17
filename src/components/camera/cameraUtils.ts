import { HybridFrameConverter, type Frame } from "react-native-vision-camera";

export function toFileUri(path: string) {
  return path.startsWith("file://") ? path : `file://${path}`;
}

export async function saveFramePreviewAsync(frame: Frame): Promise<string> {
  try {
    const image = await HybridFrameConverter.convertFrameToImageAsync(frame);

    try {
      const path = await image.saveToTemporaryFileAsync("jpg", 80);
      return toFileUri(path);
    } finally {
      image.dispose();
    }
  } finally {
    frame.dispose();
  }
}
