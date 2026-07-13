import { forwardRef, memo } from 'react';
import PlainCameraPreview from '@/components/camera/PlainCameraPreview';
import FaceDetectionCameraPreview from '@/components/camera/FaceDetectionCameraPreview';
import type { CameraFacing, CameraPreviewRef } from '@/types/camera';
import type { PokemonListItem } from '@/types/pokemon';

type Props = {
  facing: CameraFacing;
  enableFaceDetection: boolean;
  overlayPokemon: PokemonListItem | null;
};

const CameraPreview = memo(
  forwardRef<CameraPreviewRef, Props>(function CameraPreview(
  { facing, enableFaceDetection, overlayPokemon },
  ref,
) {
  if (enableFaceDetection) {
    return (
      <FaceDetectionCameraPreview
        ref={ref}
        facing={facing}
        overlayPokemon={overlayPokemon}
      />
    );
  }

  return <PlainCameraPreview ref={ref} overlayPokemon={overlayPokemon} />;
  }),
);

export default CameraPreview;