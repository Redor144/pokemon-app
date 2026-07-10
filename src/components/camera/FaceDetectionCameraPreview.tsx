import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, View } from 'react-native';
import { usePhotoOutput } from 'react-native-vision-camera';
import {
  Camera as FaceDetectionCamera,
  type Face,
} from 'react-native-vision-camera-face-detector';
import FeatureCardPlaceholder from '@/components/ui/FeatureCardPlaceholder';
import FaceOverlay from '@/components/face-overlay/FaceOverlay';
import PhotoOverlayCompositor, {
  type PhotoOverlayCompositorRef,
} from '@/components/camera/PhotoOverlayCompositor';
import type { DetectedFace, FaceOverlayRef } from '@/components/face-overlay/faceOverlayTypes';
import { cameraStyles } from '@/components/camera/cameraStyles';
import { useCameraPreviewState } from '@/hooks/useCameraPreviewState';
import type { CameraFacing, CameraPreviewRef } from '@/types/camera';
import type { PokemonListItem } from '@/types/pokemon';

const CAMERA_PERMISSION_REQUIRED_TITLE = 'Camera Permission Required';
const LOADING_CAMERA_TITLE = 'Loading Camera…';
const GRANT_PERMISSION_LABEL = 'Grant permission';
const FACE_UPDATE_INTERVAL_MS = 200;

function toFileUri(path: string) {
  return path.startsWith('file://') ? path : `file://${path}`;
}

function mirrorFacesX(faces: DetectedFace[], width: number): DetectedFace[] {
  return faces.map((face) => ({
    bounds: { ...face.bounds, x: width - face.bounds.x - face.bounds.width },
    landmarks: face.landmarks && {
      LEFT_EYE: face.landmarks.LEFT_EYE && {
        x: width - face.landmarks.LEFT_EYE.x,
        y: face.landmarks.LEFT_EYE.y,
      },
      RIGHT_EYE: face.landmarks.RIGHT_EYE && {
        x: width - face.landmarks.RIGHT_EYE.x,
        y: face.landmarks.RIGHT_EYE.y,
      },
      NOSE_BASE: face.landmarks.NOSE_BASE && {
        x: width - face.landmarks.NOSE_BASE.x,
        y: face.landmarks.NOSE_BASE.y,
      },
    },
    rollAngle: face.rollAngle == null ? face.rollAngle : -face.rollAngle,
  }));
}

type Props = {
  facing: CameraFacing;
  overlayPokemon: PokemonListItem | null;
};

const FaceDetectionCameraPreview = forwardRef<CameraPreviewRef, Props>(
  function FaceDetectionCameraPreview({ facing, overlayPokemon }, ref) {
    const { isActive, hasPermission, requestPermission, device } = useCameraPreviewState(facing);
    const [previewLayout, setPreviewLayout] = useState({ width: 0, height: 0 });
    const faceOverlayRef = useRef<FaceOverlayRef>(null);
    const compositorRef = useRef<PhotoOverlayCompositorRef>(null);
    const rawFacesRef = useRef<DetectedFace[]>([]);
    const photoOutput = usePhotoOutput();
    const lastUpdate = useRef(0);

    useImperativeHandle(
      ref,
      () => ({
        captureForSave: async () => {
          const { filePath } = await photoOutput.capturePhotoToFile({ flashMode: 'off' }, {});
          const photoUri = toFileUri(filePath);
          const { width } = previewLayout;
          const faces =
            Platform.OS === 'ios' && width > 0
              ? mirrorFacesX(rawFacesRef.current, width)
              : rawFacesRef.current;

          if (
            !overlayPokemon ||
            faces.length === 0 ||
            previewLayout.width === 0 ||
            previewLayout.height === 0
          ) {
            return photoUri;
          }

          if (!compositorRef.current) {
            throw new Error('Photo compositor is not ready.');
          }

          return compositorRef.current.composite({
            photoUri,
            faces,
            pokemon: overlayPokemon,
            size: previewLayout,
          });
        },
      }),
      [overlayPokemon, photoOutput, previewLayout],
    );

    const handlePreviewLayout = useCallback((event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setPreviewLayout((current) =>
        current.width === width && current.height === height ? current : { width, height },
      );
    }, []);

    const handleFacesDetected = useCallback(
      (detectedFaces: Face[]) => {
        const now = Date.now();
        if (now - lastUpdate.current < FACE_UPDATE_INTERVAL_MS) return;
        lastUpdate.current = now;

        const rawFaces: DetectedFace[] = detectedFaces.map((face) => ({
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
        rawFacesRef.current = rawFaces;

        const { width } = previewLayout;
        const displayFaces =
          Platform.OS === 'ios' && facing === 'back' && width > 0
            ? mirrorFacesX(rawFaces, width)
            : rawFaces;

        faceOverlayRef.current?.updateFaces(displayFaces);
      },
      [facing, previewLayout],
    );

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
      <>
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
            outputs={[photoOutput]}
            onFacesDetected={handleFacesDetected}
            onError={handleFaceDetectionError}
          />
          <FaceOverlay ref={faceOverlayRef} pokemon={overlayPokemon} />
        </View>
        <PhotoOverlayCompositor ref={compositorRef} />
      </>
    );
  },
);

export default FaceDetectionCameraPreview;
