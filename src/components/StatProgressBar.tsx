import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, LinearGradient, RoundedRect, vec } from '@shopify/react-native-skia';
import { colors } from '@/constants/theme';

const TRACK_HEIGHT = 6;
const TRACK_RADIUS = TRACK_HEIGHT / 2;

const GRADIENT_COLORS = [colors.primary, colors.stat] as const;

type Props = {
  percent: number;
};

export default function StatProgressBar({ percent }: Props) {
  const [width, setWidth] = useState(0);
  const fillWidth = width * percent;

  return (
    <View
      style={styles.track}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <Canvas style={{ width, height: TRACK_HEIGHT }}>
          <RoundedRect
            x={0}
            y={0}
            width={width}
            height={TRACK_HEIGHT}
            r={TRACK_RADIUS}
            color={colors.muted}
          />
          {fillWidth > 0 && (
            <RoundedRect x={0} y={0} width={fillWidth} height={TRACK_HEIGHT} r={TRACK_RADIUS}>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(width, 0)}
                colors={[...GRADIENT_COLORS]}
              />
            </RoundedRect>
          )}
        </Canvas>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flex: 1,
    height: TRACK_HEIGHT,
  },
});
