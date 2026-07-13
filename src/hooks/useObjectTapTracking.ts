import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { Detection } from 'react-native-executorch';
import { useFrameOutput, type Frame } from 'react-native-vision-camera';
import { saveFramePreviewAsync } from '@/components/camera/cameraUtils';
import {
  imageBboxToViewRect,
  viewPointToImagePoint,
  type Bbox,
} from '@/components/camera/previewCoords';
import { bboxesAreClose, pickTrackedDetection } from '@/components/camera/objectTracking';
import { TRACK_MISS_LIMIT } from '@/components/camera/cameraConstants';
import { usePreviewLayout } from '@/hooks/usePreviewLayout';

const platformKey = Platform.OS === 'android' ? 'android' : 'ios';
const FRAME_SIZE = 320;
const SCAN_FRAME_STRIDE = { ios: 1, android: 2 } as const;
const TRACK_FRAME_STRIDE = { ios: 2, android: 4 } as const;
const UI_UPDATE_INTERVAL_MS = { ios: 80, android: 120 } as const;

const SCAN_FRAME_LIMIT = 15;

export type ObjectTrackingPhase = 'idle' | 'scanning' | 'proposal' | 'tracking' | 'lost';

export type ProposalPreview = {
  uri: string;
  frameSize: { width: number; height: number };
  bbox: Bbox;
};

type RunOnFrameFn = (
  frame: Frame,
  isFrontCamera: boolean,
  options?: { detectionThreshold?: number },
) => Detection[];

type Options = {
  runOnFrame: RunOnFrameFn | null | undefined;
  isModelReady: boolean;
};

export function useObjectTapTracking({ runOnFrame, isModelReady }: Options) {
  const [frameDetector, setFrameDetector] = useState<{ run: RunOnFrameFn | null }>({ run: null });
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [trackedBbox, setTrackedBbox] = useState<Bbox | null>(null);
  const [phase, setPhase] = useState<ObjectTrackingPhase>('idle');
  const [pendingDetection, setPendingDetection] = useState<Detection | null>(null);
  const [proposalPreview, setProposalPreview] = useState<ProposalPreview | null>(null);
  const [lostLabel, setLostLabel] = useState<string | null>(null);
  const { previewLayout, handlePreviewLayout } = usePreviewLayout();

  const previewLayoutRef = useRef(previewLayout);
  const pendingTapRef = useRef<{ x: number; y: number } | null>(null);
  const trackedBboxRef = useRef<Bbox | null>(null);
  const trackedLabelRef = useRef<string | null>(null);
  const missCountRef = useRef(0);
  const pendingDetectionRef = useRef<Detection | null>(null);
  const phaseRef = useRef<ObjectTrackingPhase>('idle');
  const scanFrameCountRef = useRef(0);
  const lastUiUpdateRef = useRef(0);
  const isProcessingFrames = useSharedValue(false);
  const isScanning = useSharedValue(false);
  const frameCounter = useSharedValue(0);
  const frameStride = useSharedValue(1);

  const setPhaseState = useCallback(
    (nextPhase: ObjectTrackingPhase) => {
      phaseRef.current = nextPhase;
      setPhase(nextPhase);
      isProcessingFrames.value = nextPhase === 'scanning' || nextPhase === 'tracking';
      isScanning.value = nextPhase === 'scanning';
      frameCounter.value = 0;

      if (nextPhase === 'scanning') {
        frameStride.value = SCAN_FRAME_STRIDE[platformKey];
      } else if (nextPhase === 'tracking') {
        frameStride.value = TRACK_FRAME_STRIDE[platformKey];
      }
    },
    [frameCounter, frameStride, isProcessingFrames, isScanning],
  );

  useEffect(() => {
    previewLayoutRef.current = previewLayout;
  }, [previewLayout]);

  useEffect(() => {
    setFrameDetector({ run: (runOnFrame as RunOnFrameFn | null) ?? null });
  }, [runOnFrame]);

  const openProposal = useCallback(
    (detection: Detection | null) => {
      pendingDetectionRef.current = detection;
      setPendingDetection(detection);
      if (!detection) {
        setProposalPreview(null);
      }
      setPhaseState('proposal');
    },
    [setPhaseState],
  );

  const processScanFrame = useCallback(
    async (frame: Frame, detections: Detection[]) => {
      if (phaseRef.current !== 'scanning') {
        frame.dispose();
        return;
      }

      const frameWidth = frame.height;
      const frameHeight = frame.width;

      if (frameSize.width !== frameWidth || frameSize.height !== frameHeight) {
        setFrameSize({ width: frameWidth, height: frameHeight });
      }

      const tap = pendingTapRef.current;
      const imagePoint = tap
        ? viewPointToImagePoint(tap.x, tap.y, previewLayoutRef.current, {
            width: frameWidth,
            height: frameHeight,
          })
        : null;

      const selected = pickTrackedDetection(detections, imagePoint, null);

      if (selected) {
        pendingTapRef.current = null;

        try {
          const uri = await saveFramePreviewAsync(frame);
          setProposalPreview({
            uri,
            frameSize: { width: frameWidth, height: frameHeight },
            bbox: selected.bbox,
          });
        } catch {
          setProposalPreview(null);
        }

        openProposal(selected);
        return;
      }

      frame.dispose();
      scanFrameCountRef.current += 1;

      if (scanFrameCountRef.current >= SCAN_FRAME_LIMIT) {
        pendingTapRef.current = null;
        openProposal(null);
      }
    },
    [frameSize.height, frameSize.width, openProposal],
  );

  const processFrameDetections = useCallback(
    (detections: Detection[], frameWidth: number, frameHeight: number) => {
      const currentPhase = phaseRef.current;

      if (frameSize.width !== frameWidth || frameSize.height !== frameHeight) {
        setFrameSize({ width: frameWidth, height: frameHeight });
      }

      if (currentPhase !== 'tracking') {
        return;
      }

      const selected = pickTrackedDetection(
        detections,
        null,
        trackedBboxRef.current,
        trackedLabelRef.current,
      );

      const now = Date.now();
      const uiInterval = UI_UPDATE_INTERVAL_MS[platformKey];

      if (selected) {
        missCountRef.current = 0;
        const previousBbox = trackedBboxRef.current;
        trackedBboxRef.current = selected.bbox;

        const shouldUpdateUi =
          !previousBbox ||
          !bboxesAreClose(previousBbox, selected.bbox) ||
          now - lastUiUpdateRef.current >= uiInterval;

        if (shouldUpdateUi) {
          lastUiUpdateRef.current = now;
          setTrackedBbox(selected.bbox);
        }

        return;
      }

      missCountRef.current += 1;

      if (missCountRef.current < TRACK_MISS_LIMIT) {
        return;
      }

      setLostLabel(trackedLabelRef.current);
      trackedBboxRef.current = null;
      trackedLabelRef.current = null;
      missCountRef.current = 0;
      setTrackedBbox(null);
      setPhaseState('lost');
    },
    [frameSize.height, frameSize.width, setPhaseState],
  );

  const onFrame = useCallback(
    (frame: Frame) => {
      'worklet';

      if (!frameDetector.run || !isProcessingFrames.value) {
        frame.dispose();
        return;
      }

      frameCounter.value += 1;

      if (frameCounter.value % frameStride.value !== 0) {
        frame.dispose();
        return;
      }

      try {
        const detections = frameDetector.run(frame, false, {
          detectionThreshold: 0.5,
        });

        if (isScanning.value) {
          scheduleOnRN(processScanFrame, frame, detections);
          return;
        }

        // Sensor frames are landscape-native; swap dimensions inline (worklets can't call RN functions).
        scheduleOnRN(processFrameDetections, detections, frame.height, frame.width);
        frame.dispose();
      } catch {
        frame.dispose();
      }
    },
    [
      frameCounter,
      frameDetector,
      frameStride,
      isProcessingFrames,
      isScanning,
      processFrameDetections,
      processScanFrame,
    ],
  );

  const frameOutput = useFrameOutput({
    pixelFormat: 'rgb',
    enablePreviewSizedOutputBuffers: true,
    targetResolution: {
      width: FRAME_SIZE,
      height: FRAME_SIZE,
    },
    dropFramesWhileBusy: true,
    onFrame,
  });

  const startScan = useCallback(
    (locationX: number, locationY: number) => {
      pendingTapRef.current = { x: locationX, y: locationY };
      scanFrameCountRef.current = 0;
      trackedBboxRef.current = null;
      trackedLabelRef.current = null;
      missCountRef.current = 0;
      setTrackedBbox(null);
      setLostLabel(null);
      pendingDetectionRef.current = null;
      setPendingDetection(null);
      setProposalPreview(null);
      setPhaseState('scanning');
    },
    [setPhaseState],
  );

  const handleTap = useCallback(
    (locationX: number, locationY: number) => {
      if (
        !isModelReady ||
        !frameDetector.run ||
        previewLayout.width === 0 ||
        previewLayout.height === 0
      ) {
        return;
      }

      const currentPhase = phaseRef.current;

      if (currentPhase !== 'idle' && currentPhase !== 'tracking') {
        return;
      }

      startScan(locationX, locationY);
    },
    [
      frameDetector.run,
      isModelReady,
      previewLayout.height,
      previewLayout.width,
      startScan,
    ],
  );

  const confirmTracking = useCallback(() => {
    const detection = pendingDetectionRef.current;

    if (!detection) {
      return;
    }

    trackedBboxRef.current = detection.bbox;
    trackedLabelRef.current = String(detection.label);
    missCountRef.current = 0;
    setTrackedBbox(detection.bbox);
    pendingDetectionRef.current = null;
    setPendingDetection(null);
    setProposalPreview(null);
    setPhaseState('tracking');
  }, [setPhaseState]);

  const dismissProposal = useCallback(() => {
    if (phaseRef.current !== 'proposal') {
      return;
    }

    trackedBboxRef.current = null;
    trackedLabelRef.current = null;
    missCountRef.current = 0;
    setTrackedBbox(null);
    setLostLabel(null);
    pendingDetectionRef.current = null;
    setPendingDetection(null);
    setProposalPreview(null);
    pendingTapRef.current = null;
    scanFrameCountRef.current = 0;
    setPhaseState('idle');
  }, [setPhaseState]);

  const dismissLost = useCallback(() => {
    if (phaseRef.current !== 'lost') {
      return;
    }

    trackedBboxRef.current = null;
    trackedLabelRef.current = null;
    missCountRef.current = 0;
    setTrackedBbox(null);
    setLostLabel(null);
    setPhaseState('idle');
  }, [setPhaseState]);

  const pauseFrameProcessing = useCallback(() => {
    isProcessingFrames.value = false;
  }, [isProcessingFrames]);

  const resumeFrameProcessing = useCallback(() => {
    const currentPhase = phaseRef.current;
    isProcessingFrames.value = currentPhase === 'scanning' || currentPhase === 'tracking';
  }, [isProcessingFrames]);

  const bboxRect = useMemo(() => {
    const hasFrameSize = frameSize.width > 0 && frameSize.height > 0;

    if (!trackedBbox || !hasFrameSize || phase !== 'tracking') {
      return null;
    }

    return imageBboxToViewRect(trackedBbox, previewLayout, frameSize);
  }, [frameSize, phase, previewLayout, trackedBbox]);

  const getTrackedViewRect = useCallback(() => {
    if (phaseRef.current !== 'tracking' || !trackedBboxRef.current) {
      return null;
    }

    const layout = previewLayoutRef.current;
    const hasFrameSize = frameSize.width > 0 && frameSize.height > 0;

    if (!hasFrameSize || layout.width === 0 || layout.height === 0) {
      return null;
    }

    return imageBboxToViewRect(trackedBboxRef.current, layout, frameSize);
  }, [frameSize]);

  return {
    frameOutput,
    handlePreviewLayout,
    handleTap,
    bboxRect,
    getTrackedViewRect,
    previewLayout,
    phase,
    pendingDetection,
    proposalPreview,
    lostLabel,
    confirmTracking,
    dismissProposal,
    dismissLost,
    pauseFrameProcessing,
    resumeFrameProcessing,
  };
}
