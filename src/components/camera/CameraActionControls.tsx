import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { Camera as CameraIcon, Sparkles, SwitchCamera } from 'lucide-react-native';

const SWITCH_CAMERA_ACCESSIBILITY_LABEL = 'Switch camera';
const CAPTURE_PHOTO_ACCESSIBILITY_LABEL = 'Capture photo';
const CHOOSE_POKEMON_ACCESSIBILITY_LABEL = 'Choose Pokémon';

type Props = {
  isFaceMode: boolean;
  isCapturing: boolean;
  onToggleCamera: () => void;
  onChoosePokemon: () => void;
  onCapture: () => void;
};

export default function CameraActionControls({
  isFaceMode,
  isCapturing = false,
  onToggleCamera,
  onChoosePokemon,
  onCapture,
}: Props) {
  return (
    <View style={styles.cameraActionControls}>
      <View style={styles.cameraActionColumn}>
        <Pressable
          onPress={onToggleCamera}
          style={styles.sideActionButton}
          accessibilityRole="button"
          accessibilityLabel={SWITCH_CAMERA_ACCESSIBILITY_LABEL}
        >
          <SwitchCamera size={22} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={styles.cameraActionColumn}>
      <Pressable
        style={[styles.shutterButton, isCapturing && styles.shutterButtonDisabled]}
        onPress={onCapture}
        disabled={isCapturing}
        accessibilityRole="button"
        accessibilityLabel={CAPTURE_PHOTO_ACCESSIBILITY_LABEL}
        accessibilityState={{ disabled: isCapturing }}
      >
          <View style={styles.shutterInnerRing} pointerEvents="none" />
          <CameraIcon size={28} color={colors.primaryForeground} strokeWidth={2.25} />
        </Pressable>
      </View>

      <View style={styles.cameraActionColumn}>
        <Pressable
          style={[styles.sideActionButton, !isFaceMode && styles.sideActionButtonDisabled]}
          onPress={onChoosePokemon}
          disabled={!isFaceMode}
          accessibilityRole="button"
          accessibilityLabel={CHOOSE_POKEMON_ACCESSIBILITY_LABEL}
          accessibilityState={{ disabled: !isFaceMode }}
        >
          <Sparkles size={22} color={colors.foreground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraActionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  cameraActionColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideActionButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.controlBackground,
    borderWidth: 1,
    borderColor: colors.controlBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideActionButtonDisabled: {
    opacity: 0.45,
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10,
  },
  shutterInnerRing: {
    ...StyleSheet.absoluteFill,
    margin: 5,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.controlRing,
  },
  shutterButtonDisabled: {
    opacity: 0.45,
  },
});
