import { forwardRef, useCallback, useRef } from "react";
import { Pressable, View } from "react-native";
import {
  isAvailable,
  models,
  useObjectDetection,
} from "react-native-executorch";
import { Camera } from "react-native-vision-camera";
import FeatureCardPlaceholder from "@/components/ui/FeatureCardPlaceholder";
import CameraPreviewGate from "@/components/camera/CameraPreviewGate";
import ObjectDetectionConfirmSheet from "@/components/camera/ObjectDetectionConfirmSheet";
import ObjectTrackingLostSheet from "@/components/camera/ObjectTrackingLostSheet";
import ObjectTrackingBbox from "@/components/camera/ObjectTrackingBbox";
import PhotoOverlayCompositor, {
  type PhotoOverlayCompositorRef,
} from "@/components/camera/PhotoOverlayCompositor";
import SelectionHint from "@/components/ui/SelectionHint";
import { cameraStyles } from "@/components/camera/cameraStyles";
import { useCameraCaptureHandle } from "@/hooks/useCameraCaptureHandle";
import { useCameraPreviewState } from "@/hooks/useCameraPreviewState";
import { useObjectTapTracking } from "@/hooks/useObjectTapTracking";
import type { CameraPreviewRef } from "@/types/camera";
import type { PokemonListItem } from "@/types/pokemon";

const LOADING_MODEL_TITLE = "Loading Object Detection Model…";
const OBJECT_DETECTION_HINT = "Tap on an object to detect";

type Props = {
  overlayPokemon: PokemonListItem | null;
};

const PlainCameraPreview = forwardRef<CameraPreviewRef, Props>(
  function PlainCameraPreview({ overlayPokemon }, ref) {
    const { isActive, hasPermission, requestPermission, device } =
      useCameraPreviewState("back");
    const objectDetection = useObjectDetection({
      model: models.object_detection.ssdlite_320_mobilenet_v3_large(),
      preventLoad: !isAvailable,
    });
    const compositorRef = useRef<PhotoOverlayCompositorRef>(null);

    const {
      frameOutput,
      handlePreviewLayout,
      handleTap,
      bboxRect,
      getTrackedViewRect,
      previewLayout,
      phase,
      pendingDetection,
      proposalPreview,
      lostLabel,
      confirmTracking,
      dismissProposal,
      dismissLost,
      pauseFrameProcessing,
      resumeFrameProcessing,
    } = useObjectTapTracking({
      runOnFrame: objectDetection.runOnFrame,
      isModelReady: objectDetection.isReady,
    });

    const processCapturedUri = useCallback(
      async (uri: string) => {
        const trackedRect = getTrackedViewRect();

        if (
          !overlayPokemon ||
          !trackedRect ||
          previewLayout.width === 0 ||
          previewLayout.height === 0
        ) {
          return uri;
        }

        if (!compositorRef.current) {
          throw new Error("Photo compositor is not ready.");
        }

        return compositorRef.current.composite({
          photoUri: uri,
          pokemon: overlayPokemon,
          bboxRect: trackedRect,
          size: previewLayout,
        });
      },
      [getTrackedViewRect, overlayPokemon, previewLayout],
    );

    const photoOutput = useCameraCaptureHandle({
      ref,
      processCapturedUri,
      photoOptions: { containerFormat: "jpeg" },
      onBeforeCapture: pauseFrameProcessing,
      onAfterCapture: resumeFrameProcessing,
    });

    const canTap = phase === "idle" || phase === "tracking";
    const showSelectionHint = phase === "idle";

    return (
      <CameraPreviewGate
        hasPermission={hasPermission}
        requestPermission={requestPermission}
        device={device}
      >
        {!objectDetection.isReady ? (
          <FeatureCardPlaceholder
            title={LOADING_MODEL_TITLE}
            caption={
              objectDetection.downloadProgress > 0
                ? `${Math.round(objectDetection.downloadProgress * 100)}% downloaded`
                : undefined
            }
            loading
          />
        ) : objectDetection.error ? (
          <FeatureCardPlaceholder
            title="Object Detection Failed"
            caption={objectDetection.error.message}
          />
        ) : (
          <View
            style={cameraStyles.previewContainer}
            onLayout={handlePreviewLayout}
          >
            {showSelectionHint && (
              <SelectionHint text={OBJECT_DETECTION_HINT} />
            )}
            <Pressable
              style={cameraStyles.cameraView}
              onPress={(e) => {
                if (!canTap) {
                  return;
                }

                const { locationX, locationY } = e.nativeEvent;
                handleTap(locationX, locationY);
              }}
            >
              <Camera
                style={cameraStyles.cameraView}
                device={device!}
                isActive={isActive}
                orientationSource="device"
                outputs={[photoOutput, frameOutput]}
              />
            </Pressable>
            <ObjectTrackingBbox
              rect={bboxRect}
              pokemon={overlayPokemon}
              phase={phase}
            />
            <ObjectDetectionConfirmSheet
              isOpen={phase === "proposal"}
              detection={pendingDetection}
              preview={proposalPreview}
              onAccept={confirmTracking}
              onDismiss={dismissProposal}
            />
            <ObjectTrackingLostSheet
              isOpen={phase === "lost"}
              label={lostLabel}
              onDismiss={dismissLost}
            />
          </View>
        )}
        <PhotoOverlayCompositor ref={compositorRef} />
      </CameraPreviewGate>
    );
  },
);

export default PlainCameraPreview;
