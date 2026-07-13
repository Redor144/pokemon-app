import { forwardRef, useCallback, useRef } from 'react';
import { Platform, View } from 'react-native';
import {
  Camera as FaceDetectionCamera,
  type Face,
} from 'react-native-vision-camera-face-detector';
import FaceOverlay from '@/components/face-overlay/FaceOverlay';
import type { FaceOverlayRef } from '@/components/face-overlay/faceOverlayTypes';
import { mapDetectorFaces } from '@/components/face-overlay/mapDetectorFace';
import { mirrorFacesHorizontally } from '@/components/face-overlay/mirrorFacesHorizontally';
import CameraPreviewGate from '@/components/camera/CameraPreviewGate';
import PhotoOverlayCompositor, {
  type PhotoOverlayCompositorRef,
} from '@/components/camera/PhotoOverlayCompositor';
import { cameraStyles } from '@/components/camera/cameraStyles';
import { useCameraCaptureHandle } from '@/hooks/useCameraCaptureHandle';
import { useCameraPreviewState } from '@/hooks/useCameraPreviewState';
import { usePreviewLayout } from '@/hooks/usePreviewLayout';
import type { CameraFacing, CameraPreviewRef } from '@/types/camera';
import type { PokemonListItem } from '@/types/pokemon';

const FACE_UPDATE_INTERVAL_MS = 200;

type Props = {
  facing: CameraFacing;
  overlayPokemon: PokemonListItem | null;
};

const FaceDetectionCameraPreview = forwardRef<CameraPreviewRef, Props>(
  function FaceDetectionCameraPreview({ facing, overlayPokemon }, ref) {
    const { isActive, hasPermission, requestPermission, device } = useCameraPreviewState(facing);
    const { previewLayout, handlePreviewLayout } = usePreviewLayout();
    const faceOverlayRef = useRef<FaceOverlayRef>(null);
    const compositorRef = useRef<PhotoOverlayCompositorRef>(null);
    const lastUpdate = useRef(0);

    const processCapturedUri = useCallback(
      async (photoUri: string) => {
        const faces = faceOverlayRef.current?.getFaces() ?? [];

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
          mirrorSprites: Platform.OS === 'ios' && facing === 'front',
        });
      },
      [facing, overlayPokemon, previewLayout],
    );

    const photoOutput = useCameraCaptureHandle({
      ref,
      processCapturedUri,
      photoOptions: { containerFormat: 'jpeg' },
    });

    const handleFacesDetected = useCallback(
      (detectedFaces: Face[]) => {
        if (previewLayout.width === 0 || previewLayout.height === 0) {
          return;
        }

        const now = Date.now();
        if (now - lastUpdate.current < FACE_UPDATE_INTERVAL_MS) return;
        lastUpdate.current = now;

        let displayFaces = mapDetectorFaces(detectedFaces);
        if (Platform.OS === 'ios' && facing === 'back') {
          displayFaces = mirrorFacesHorizontally(displayFaces, previewLayout.width);
        }
        faceOverlayRef.current?.updateFaces(displayFaces);
      },
      [facing, previewLayout.height, previewLayout.width],
    );

    const handleFaceDetectionError = useCallback((error: Error) => {
      console.error(error);
    }, []);

    return (
      <CameraPreviewGate
        hasPermission={hasPermission}
        requestPermission={requestPermission}
        device={device}
      >
        <View style={cameraStyles.previewContainer} onLayout={handlePreviewLayout}>
          <FaceDetectionCamera
            style={cameraStyles.cameraView}
            device={device!}
            isActive={isActive}
            performanceMode="fast"
            outputResolution="preview"
            cameraFacing={facing}
            autoMode
            windowWidth={Math.max(previewLayout.width, 1)}
            windowHeight={Math.max(previewLayout.height, 1)}
            trackingEnabled={false}
            minFaceSize={0.15}
            outputs={[photoOutput]}
            onFacesDetected={handleFacesDetected}
            onError={handleFaceDetectionError}
          />
          <FaceOverlay ref={faceOverlayRef} pokemon={overlayPokemon} />
        </View>
        <PhotoOverlayCompositor ref={compositorRef} />
      </CameraPreviewGate>
    );
  },
);

export default FaceDetectionCameraPreview;
