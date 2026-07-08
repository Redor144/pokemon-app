import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import FeatureCardPlaceholder from '@/components/FeatureCardPlaceholder';
import { commonStyles } from '@/styles/common';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { Camera, Images, SwitchCamera } from 'lucide-react-native';

const CAMERA_PERMISSION_REQUIRED_TITLE = 'Camera Permission Required';
const LOADING_CAMERA_TITLE = 'Loading Camera…';
const CAMERA_UNAVAILABLE_TITLE = 'Camera Unavailable';
const GRANT_PERMISSION_LABEL = 'Grant permission';
const FACE_DETECTION_LABEL = 'Face Detection';
const OBJECT_DETECT_LABEL = 'Object Detect';
const FAILED_TO_LOAD_CAMERA_MODULE = 'Failed to load camera module';
const SWITCH_CAMERA_ACCESSIBILITY_LABEL = 'Switch camera';
const CAPTURE_PHOTO_ACCESSIBILITY_LABEL = 'Capture photo';
const CHOOSE_FROM_GALLERY_ACCESSIBILITY_LABEL = 'Choose from gallery';

type DetectionMode = 'face' | 'object';
type VisionCameraModule = typeof import('react-native-vision-camera');

function VisionCameraPreview({ module, facing }: { module: VisionCameraModule, facing: 'front' | 'back' }) {
  const { Camera, useCameraDevice, useCameraPermission } = module;
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(facing);

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

  return <Camera device={device} isActive={true} style={styles.cameraView} />;
}

export default function CameraScreen() {
  const [mode, setMode] = useState<DetectionMode>('face');
  const [visionCamera, setVisionCamera] = useState<VisionCameraModule | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  const toggleCamera = () => {
    setFacing(facing === 'front' ? 'back' : 'front');
  };

  const loadVisionCamera = useCallback(() => {
    setLoadError(null);
    setVisionCamera(null);
    import('react-native-vision-camera')
      .then(setVisionCamera)
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : FAILED_TO_LOAD_CAMERA_MODULE;
        setLoadError(message);
      });
  }, []);

  useEffect(() => {
    loadVisionCamera();
  }, [loadVisionCamera]);

  return (
    <View style={commonStyles.screen}>
      <View style={styles.segmentedControl}>
        <Pressable
          style={[styles.segment, mode === 'face' && styles.segmentActive]}
          onPress={() => setMode('face')}
          accessibilityRole="button"
          accessibilityState={{ selected: mode === 'face' }}
        >
          <Text style={[styles.segmentText, mode === 'face' && styles.segmentTextActive]}>
            {FACE_DETECTION_LABEL}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.segment, mode === 'object' && styles.segmentActive]}
          onPress={() => setMode('object')}
          accessibilityRole="button"
          accessibilityState={{ selected: mode === 'object' }}
        >
          <Text style={[styles.segmentText, mode === 'object' && styles.segmentTextActive]}>
            {OBJECT_DETECT_LABEL}
          </Text>
        </Pressable>
      </View>
      <View style={styles.cameraCard}>
        {loadError ? (
          <FeatureCardPlaceholder
            title={CAMERA_UNAVAILABLE_TITLE}
            onAction={loadVisionCamera}
          />
        ) : !visionCamera ? (
          <FeatureCardPlaceholder loading />
        ) : (
          <VisionCameraPreview module={visionCamera} facing={facing} />
        )}
      </View>
      <View style={styles.cameraActionControls}>
        <View style={styles.cameraActionColumn}>
          <Pressable
            onPress={toggleCamera}
            style={styles.sideActionButton}
            accessibilityRole="button"
            accessibilityLabel={SWITCH_CAMERA_ACCESSIBILITY_LABEL}
          >
            <SwitchCamera size={22} color={colors.foreground} />
          </Pressable>
        </View>

        <View style={styles.cameraActionColumn}>
          <Pressable
            style={styles.shutterButton}
            accessibilityRole="button"
            accessibilityLabel={CAPTURE_PHOTO_ACCESSIBILITY_LABEL}
          >
            <View style={styles.shutterInnerRing} pointerEvents="none" />
            <Camera size={28} color={colors.primaryForeground} strokeWidth={2.25} />
          </Pressable>
        </View>

        <View style={styles.cameraActionColumn}>
          <Pressable
            style={styles.sideActionButton}
            accessibilityRole="button"
            accessibilityLabel={CHOOSE_FROM_GALLERY_ACCESSIBILITY_LABEL}
          >
            <Images size={22} color={colors.foreground} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
    padding: spacing.xs,
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontFamily: fonts.nunitoBold,
    fontSize: 14,
    color: colors.mutedForeground,
  },
  segmentTextActive: {
    color: colors.primaryForeground,
  },
  cameraCard: {
    flex: 1,
    backgroundColor: colors.muted,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  cameraView: {
    flex: 1,
  },
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
});
