import { useRef, useState } from 'react';
import { View } from 'react-native';
import CameraActionControls from '@/components/camera/CameraActionControls';
import CameraModeSelector from '@/components/camera/CameraModeSelector';
import CameraPreview from '@/components/camera/CameraPreview';
import { cameraStyles } from '@/components/camera/cameraStyles';
import PokemonPickerSheet, {
  type PokemonPickerSheetRef,
} from '@/components/pokemon-picker/PokemonPickerSheet';
import { usePhotoCapture } from '@/hooks/usePhotoCapture';
import { commonStyles } from '@/styles/common';
import type { CameraFacing, CameraPreviewRef, DetectionMode } from '@/types/camera';
import type { PokemonListItem } from '@/types/pokemon';

export default function CameraScreen() {
  const [mode, setMode] = useState<DetectionMode>('face');
  const [facing, setFacing] = useState<CameraFacing>('back');
  const [overlayPokemon, setOverlayPokemon] = useState<PokemonListItem | null>(null);
  const pickerSheetRef = useRef<PokemonPickerSheetRef>(null);
  const cameraRef = useRef<CameraPreviewRef>(null);
  const { capturePhoto, isCapturing } = usePhotoCapture({ cameraRef });

  return (
    <View style={commonStyles.screen}>
      <CameraModeSelector mode={mode} onModeChange={setMode} />
      <View style={cameraStyles.cameraCard}>
        <CameraPreview
          ref={cameraRef}
          facing={facing}
          enableFaceDetection={mode === 'face'}
          overlayPokemon={overlayPokemon}
        />
      </View>
      <CameraActionControls
        isFaceMode={mode === 'face'}
        isCapturing={isCapturing}
        onCapture={() => void capturePhoto()}
        onToggleCamera={() => setFacing((current) => (current === 'front' ? 'back' : 'front'))}
        onChoosePokemon={() => pickerSheetRef.current?.open()}
      />
      <PokemonPickerSheet
        ref={pickerSheetRef}
        selectedId={overlayPokemon?.id}
        onSelect={setOverlayPokemon}
      />
    </View>
  );
}