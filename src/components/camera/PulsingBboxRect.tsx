import Animated from 'react-native-reanimated';
import { cameraStyles } from '@/components/camera/cameraStyles';
import type { BboxRect } from '@/components/camera/ObjectSpriteOverlay';
import { useBboxPulse } from '@/hooks/useBboxPulse';
import type { ObjectTrackingPhase } from '@/hooks/useObjectTapTracking';

type Props = {
  rect: BboxRect;
  phase?: ObjectTrackingPhase;
};

export default function PulsingBboxRect({ rect, phase = 'tracking' }: Props) {
  const animatedStyle = useBboxPulse(true, phase);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        cameraStyles.trackingBbox,
        {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
        animatedStyle,
      ]}
    />
  );
}
