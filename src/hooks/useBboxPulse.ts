import { useEffect } from 'react';
import {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { BBOX_PULSE } from '@/components/camera/cameraConstants';
import type { ObjectTrackingPhase } from '@/hooks/useObjectTapTracking';

type PulseMode = 'scanning' | 'tracking' | 'idle';

function phaseToPulseMode(phase: ObjectTrackingPhase): PulseMode {
  if (phase === 'scanning') return 'scanning';
  if (phase === 'tracking') return 'tracking';
  return 'idle';
}

export function useBboxPulse(isActive: boolean, phase: ObjectTrackingPhase) {
  const progress = useSharedValue(1);
  const mode = phaseToPulseMode(phase);
  const config = mode === 'scanning' ? BBOX_PULSE.scanning : BBOX_PULSE.tracking;

  useEffect(() => {
    if (!isActive || mode === 'idle') {
      cancelAnimation(progress);
      progress.value = 1;
      return;
    }

    progress.value = withRepeat(
      withTiming(0, {
        duration: config.durationMs,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    return () => {
      cancelAnimation(progress);
      progress.value = 1;
    };
  }, [isActive, mode, config.durationMs, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    if (mode === 'idle') {
      return { opacity: 1, transform: [{ scale: 1 }] };
    }

    return {
      opacity: interpolate(progress.value, [0, 1], [config.minOpacity, config.maxOpacity]),
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [config.minScale, config.maxScale]),
        },
      ],
    };
  });

  return animatedStyle;
}