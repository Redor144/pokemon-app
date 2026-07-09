import { Camera } from 'react-native-vision-camera';
import FeatureCardPlaceholder from '@/components/ui/FeatureCardPlaceholder';
import { useCameraPreviewState } from '@/hooks/useCameraPreviewState';
import type { CameraFacing } from '@/types/camera';
import { cameraStyles } from '@/components/camera/cameraStyles';

const CAMERA_PERMISSION_REQUIRED_TITLE = 'Camera Permission Required';
const LOADING_CAMERA_TITLE = 'Loading Camera…';
const GRANT_PERMISSION_LABEL = 'Grant permission';

type Props = {
  facing: CameraFacing;
};

export default function PlainCameraPreview({ facing }: Props) {
  const { isActive, hasPermission, requestPermission, device } = useCameraPreviewState(facing);

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

  return <Camera style={cameraStyles.cameraView} device={device} isActive={isActive} />;
}
