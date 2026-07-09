import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  Pressable,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useIsFocused } from 'expo-router';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  Camera as FaceDetectionCamera,
  type Face,
} from 'react-native-vision-camera-face-detector';
import FeatureCardPlaceholder from '@/components/FeatureCardPlaceholder';
import FaceOverlay, { type FaceBounds, type FaceOverlayRef } from '@/components/FaceOverlay';
import PokemonPickerSheet, {
  type PokemonPickerSheetRef,
} from '@/components/PokemonPickerSheet';
import { commonStyles } from '@/styles/common';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import type { PokemonListItem } from '@/types/pokemon';
import { Camera as CameraIcon, Sparkles, SwitchCamera } from 'lucide-react-native';

const CAMERA_PERMISSION_REQUIRED_TITLE = 'Camera Permission Required';
const LOADING_CAMERA_TITLE = 'Loading Camera…';
const GRANT_PERMISSION_LABEL = 'Grant permission';
const FACE_DETECTION_LABEL = 'Face Detection';
const OBJECT_DETECT_LABEL = 'Object Detect';
const SWITCH_CAMERA_ACCESSIBILITY_LABEL = 'Switch camera';
const CAPTURE_PHOTO_ACCESSIBILITY_LABEL = 'Capture photo';
const CHOOSE_POKEMON_ACCESSIBILITY_LABEL = 'Choose Pokémon';

type DetectionMode = 'face' | 'object';
type CameraFacing = 'front' | 'back';

const FACE_UPDATE_INTERVAL_MS = 200;

function useCameraPreviewState(facing: CameraFacing) {
  const isFocused = useIsFocused();
  const [appState, setAppState] = useState(AppState.currentState);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(facing);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState);
    return () => subscription.remove();
  }, []);

  const isActive = isFocused && appState === 'active';

  return { isActive, hasPermission, requestPermission, device };
}

function PlainCameraPreview({ facing }: { facing: CameraFacing }) {
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

  return <Camera style={styles.cameraView} device={device} isActive={isActive} />;
}

function FaceDetectionCameraPreview({
  facing,
  overlayPokemon,
}: {
  facing: CameraFacing;
  overlayPokemon: PokemonListItem | null;
}) {
  const { isActive, hasPermission, requestPermission, device } = useCameraPreviewState(facing);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const faceOverlayRef = useRef<FaceOverlayRef>(null);
  const lastUpdate = useRef(0);

  const handleFacesDetected = useCallback((detectedFaces: Face[]) => {
    const now = Date.now();
    if (now - lastUpdate.current < FACE_UPDATE_INTERVAL_MS) return;
    lastUpdate.current = now;

    const bounds: FaceBounds[] = detectedFaces.map((face) => ({
      x: face.bounds.x,
      y: face.bounds.y,
      width: face.bounds.width,
      height: face.bounds.height,
    }));
    faceOverlayRef.current?.updateFaces(bounds);
  }, []);

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

  return (
    <View style={styles.previewContainer}>
      <FaceDetectionCamera
        style={styles.cameraView}
        device={device}
        isActive={isActive}
        performanceMode="fast"
        outputResolution="preview"
        cameraFacing={facing}
        autoMode
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        trackingEnabled={false}
        minFaceSize={0.15}
        onFacesDetected={handleFacesDetected}
        onError={handleFaceDetectionError}
      />
      <FaceOverlay ref={faceOverlayRef} pokemon={overlayPokemon} />
    </View>
  );
}

function CameraPreview({
  facing,
  enableFaceDetection,
  overlayPokemon,
}: {
  facing: CameraFacing;
  enableFaceDetection: boolean;
  overlayPokemon: PokemonListItem | null;
}) {
  if (enableFaceDetection) {
    return (
      <FaceDetectionCameraPreview facing={facing} overlayPokemon={overlayPokemon} />
    );
  }

  return <PlainCameraPreview facing={facing} />;
}

export default function CameraScreen() {
  const [mode, setMode] = useState<DetectionMode>('face');
  const [facing, setFacing] = useState<CameraFacing>('back');
  const [overlayPokemon, setOverlayPokemon] = useState<PokemonListItem | null>(null);
  const pickerSheetRef = useRef<PokemonPickerSheetRef>(null);

  const toggleCamera = () => {
    setFacing((current) => (current === 'front' ? 'back' : 'front'));
  };

  const isFaceMode = mode === 'face';

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
        <CameraPreview
          facing={facing}
          enableFaceDetection={isFaceMode}
          overlayPokemon={overlayPokemon}
        />
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
            <CameraIcon size={28} color={colors.primaryForeground} strokeWidth={2.25} />
          </Pressable>
        </View>

        <View style={styles.cameraActionColumn}>
          <Pressable
            style={[styles.sideActionButton, !isFaceMode && styles.sideActionButtonDisabled]}
            onPress={() => pickerSheetRef.current?.open()}
            disabled={!isFaceMode}
            accessibilityRole="button"
            accessibilityLabel={CHOOSE_POKEMON_ACCESSIBILITY_LABEL}
            accessibilityState={{ disabled: !isFaceMode }}
          >
            <Sparkles size={22} color={colors.foreground} />
          </Pressable>
        </View>
      </View>

      <PokemonPickerSheet
        ref={pickerSheetRef}
        selectedId={overlayPokemon?.id}
        onSelect={setOverlayPokemon}
      />
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
  previewContainer: {
    flex: 1,
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
});
