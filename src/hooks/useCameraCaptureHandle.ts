import { useImperativeHandle } from "react";
import { Platform } from "react-native";
import { usePhotoOutput } from "react-native-vision-camera";
import { toFileUri } from "@/components/camera/cameraUtils";
import type { CameraPreviewRef } from "@/types/camera";

type PhotoOutputOptions = {
  containerFormat?: "jpeg";
};

type Options = {
  ref: React.ForwardedRef<CameraPreviewRef>;
  processCapturedUri: (uri: string) => Promise<string>;
  photoOptions?: PhotoOutputOptions;
  onBeforeCapture?: () => void;
  onAfterCapture?: () => void;
};

export function useCameraCaptureHandle({
  ref,
  processCapturedUri,
  photoOptions,
  onBeforeCapture,
  onAfterCapture,
}: Options) {
  const photoOutput = usePhotoOutput(photoOptions);

  useImperativeHandle(
    ref,
    () => ({
      captureForSave: async () => {
        onBeforeCapture?.();

        try {
          if (Platform.OS === "android") {
            const { filePath } = await photoOutput.capturePhotoToFile(
              { flashMode: "off" },
              {},
            );
            return processCapturedUri(toFileUri(filePath));
          }

          const photo = await photoOutput.capturePhoto(
            { flashMode: "off" },
            {},
          );

          try {
            const filePath = await photo.saveToTemporaryFileAsync();
            return processCapturedUri(toFileUri(filePath));
          } finally {
            photo.dispose();
          }
        } finally {
          onAfterCapture?.();
        }
      },
    }),
    [onAfterCapture, onBeforeCapture, photoOutput, processCapturedUri],
  );

  return photoOutput;
}
