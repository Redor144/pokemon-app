import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import PulsingBboxRect from '@/components/camera/PulsingBboxRect';
import { imageBboxToViewRect, type Bbox } from '@/components/camera/previewCoords';
import { colors, radius, spacing } from '@/constants/theme';

type Size = { width: number; height: number };

type Props = {
  uri: string;
  frameSize: Size;
  bbox: Bbox;
};

export default function ObjectDetectionPreview({ uri, frameSize, bbox }: Props) {
  const [layout, setLayout] = useState<Size>({ width: 0, height: 0 });
  const bboxRect =
    layout.width > 0 && layout.height > 0
      ? imageBboxToViewRect(bbox, layout, frameSize)
      : null;

  return (
    <View
      style={[styles.container, { aspectRatio: frameSize.width / frameSize.height }]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
      }}
    >
      <Image
        source={{ uri }}
        style={[StyleSheet.absoluteFill, styles.image]}
        contentFit="cover"
      />
      {bboxRect && <PulsingBboxRect rect={bboxRect} phase="scanning" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.muted,
  },
  image: {
    transform: [{ scaleY: -1 }, { scaleX: -1 }],
  },
});
