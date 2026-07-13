import type { ReactNode } from 'react';
import type { CameraDevice } from 'react-native-vision-camera';
import FeatureCardPlaceholder from '@/components/ui/FeatureCardPlaceholder';
import {
  CAMERA_PERMISSION_REQUIRED_TITLE,
  GRANT_PERMISSION_LABEL,
  LOADING_CAMERA_TITLE,
} from '@/components/camera/cameraConstants';

type Props = {
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  device: CameraDevice | undefined;
  children: ReactNode;
};

export default function CameraPreviewGate({
  hasPermission,
  requestPermission,
  device,
  children,
}: Props) {
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

  return children;
}
