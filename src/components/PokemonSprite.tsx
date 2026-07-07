import { memo } from 'react';
import { StyleSheet, View, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { ImageOff } from 'lucide-react-native';
import { colors, radius } from '@/constants/theme';

type Props = {
  imageUrl: string;
  size: number;
  style?: StyleProp<ImageStyle & ViewStyle>;
  onLoad?: () => void;
};

function PokemonSprite({ imageUrl, size, style, onLoad }: Props) {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[{ width: size, height: size }, style]}
        contentFit="contain"
        onLoad={onLoad}
        onLoadEnd={onLoad}
      />
    );
  }

  const iconSize = Math.round(size * 0.4);

  return (
    <View style={[styles.placeholder, { width: size, height: size }, style]}>
      <ImageOff color={colors.mutedForeground} size={iconSize} />
    </View>
  );
}

export default memo(PokemonSprite);

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
