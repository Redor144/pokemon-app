import { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import { Camera, usePhotoOutput } from 'react-native-vision-camera';
import FeatureCardPlaceholder from '@/components/ui/FeatureCardPlaceholder';
import { useCameraPreviewState } from '@/hooks/useCameraPreviewState';
import type { CameraFacing, CameraPreviewRef } from '@/types/camera';
import { cameraStyles } from '@/components/camera/cameraStyles';

const CAMERA_PERMISSION_REQUIRED_TITLE = 'Camera Permission Required';
const LOADING_CAMERA_TITLE = 'Loading Camera…';
const GRANT_PERMISSION_LABEL = 'Grant permission';

function toFileUri(path: string) {
  return path.startsWith('file://') ? path : `file://${path}`;
}

type Props = {
  facing: CameraFacing;
};

const PlainCameraPreview = forwardRef<CameraPreviewRef, Props>(function PlainCameraPreview(
  { facing },
  ref,
) {
  const { isActive, hasPermission, requestPermission, device } = useCameraPreviewState(facing);
  const photoOutput = usePhotoOutput();

  useImperativeHandle(
    ref,
    () => ({
      captureForSave: async () => {
        const { filePath } = await photoOutput.capturePhotoToFile({ flashMode: 'off' }, {});
        return toFileUri(filePath);
      },
    }),
    [photoOutput],
  );

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

  return (
    <View style={cameraStyles.previewContainer}>
      <Camera
        style={cameraStyles.cameraView}
        device={device}
        isActive={isActive}
        outputs={[photoOutput]}
      />
    </View>
  );
});

export default PlainCameraPreview;
