import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

export const cameraStyles = StyleSheet.create({
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
});
