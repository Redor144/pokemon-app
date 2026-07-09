import { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import {
  Camera as FaceDetectionCamera,
  type Face,
} from 'react-native-vision-camera-face-detector';
import FeatureCardPlaceholder from '@/components/ui/FeatureCardPlaceholder';
import FaceOverlay from '@/components/face-overlay/FaceOverlay';
import type { DetectedFace, FaceOverlayRef } from '@/components/face-overlay/faceOverlayTypes';
import { cameraStyles } from '@/components/camera/cameraStyles';
import { useCameraPreviewState } from '@/hooks/useCameraPreviewState';
import type { CameraFacing } from '@/types/camera';
import type { PokemonListItem } from '@/types/pokemon';

const CAMERA_PERMISSION_REQUIRED_TITLE = 'Camera Permission Required';
const LOADING_CAMERA_TITLE = 'Loading Camera…';
const GRANT_PERMISSION_LABEL = 'Grant permission';
const FACE_UPDATE_INTERVAL_MS = 200;

type Props = {
  facing: CameraFacing;
  overlayPokemon: PokemonListItem | null;
};

export default function FaceDetectionCameraPreview({ facing, overlayPokemon }: Props) {
  const { isActive, hasPermission, requestPermission, device } = useCameraPreviewState(facing);
  const [previewLayout, setPreviewLayout] = useState({ width: 0, height: 0 });
  const faceOverlayRef = useRef<FaceOverlayRef>(null);
  const lastUpdate = useRef(0);

  const handlePreviewLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPreviewLayout((current) =>
      current.width === width && current.height === height ? current : { width, height },
    );
  }, []);

  const handleFacesDetected = useCallback((detectedFaces: Face[]) => {
    const now = Date.now();
    if (now - lastUpdate.current < FACE_UPDATE_INTERVAL_MS) return;
    lastUpdate.current = now;

    const faces: DetectedFace[] = detectedFaces.map((face) => ({
      bounds: {
        x: face.bounds.x,
        y: face.bounds.y,
        width: face.bounds.width,
        height: face.bounds.height,
      },
      landmarks: face.landmarks
        ? {
            LEFT_EYE: face.landmarks.LEFT_EYE,
            RIGHT_EYE: face.landmarks.RIGHT_EYE,
            NOSE_BASE: face.landmarks.NOSE_BASE,
          }
        : undefined,
      rollAngle: face.rollAngle,
    }));
    faceOverlayRef.current?.updateFaces(faces);
  }, []);

  const handleFaceDetectionError = useCallback((error: Error) => {
    console.error(error);
  }, []);

  if (!hasPermission) {
    return (
      <FeatureCardPlaceholder
        title={CAMERA_PERMISSION_REQUIRED_TITLE}
        actionLabel={GRANT_PERMISSION_LABEL}
        onAction={() => void requestPermission()}
      />
    );
  }

  if (!device) {
    return <FeatureCardPlaceholder title={LOADING_CAMERA_TITLE} loading />;
  }

  const hasPreviewLayout = previewLayout.width > 0 && previewLayout.height > 0;

  return (
    <View style={cameraStyles.previewContainer} onLayout={handlePreviewLayout}>
      <FaceDetectionCamera
        style={cameraStyles.cameraView}
        device={device}
        isActive={isActive}
        performanceMode="fast"
        outputResolution="preview"
        cameraFacing={facing}
        autoMode
        windowWidth={hasPreviewLayout ? previewLayout.width : 1}
        windowHeight={hasPreviewLayout ? previewLayout.height : 1}
        runLandmarks
        trackingEnabled={false}
        minFaceSize={0.15}
        onFacesDetected={handleFacesDetected}
        onError={handleFaceDetectionError}
      />
      <FaceOverlay ref={faceOverlayRef} pokemon={overlayPokemon} />
    </View>
  );
}
