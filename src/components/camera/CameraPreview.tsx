import PlainCameraPreview from '@/components/camera/PlainCameraPreview';
import FaceDetectionCameraPreview from '@/components/camera/FaceDetectionCameraPreview';
import type { CameraFacing } from '@/types/camera';
import type { PokemonListItem } from '@/types/pokemon';

type Props = {
  facing: CameraFacing;
  enableFaceDetection: boolean;
  overlayPokemon: PokemonListItem | null;
};

export default function CameraPreview({
  facing,
  enableFaceDetection,
  overlayPokemon,
}: Props) {
  if (enableFaceDetection) {
    return (
      <FaceDetectionCameraPreview facing={facing} overlayPokemon={overlayPokemon} />
    );
  }

  return <PlainCameraPreview facing={facing} />;
}
