import { StyleSheet } from 'react-native';
import { OBJECT_TRACKING_BBOX_COLOR } from '@/components/camera/cameraConstants';
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
  trackingBbox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: OBJECT_TRACKING_BBOX_COLOR,
    borderRadius: 8,
    backgroundColor: 'rgba(74, 222, 128, 0.08)',
  },
});
