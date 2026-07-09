import { StyleSheet } from 'react-native';
import { colors, fonts, radius, spacing, typography } from '@/constants/theme';

export const favoriteStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderColor: colors.border,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: spacing.xl,
    marginTop: spacing.xl,
    marginHorizontal: spacing.md,
  },
  emptyTitle: {
    ...typography.heading,
    fontFamily: fonts.nunitoBold,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptyCaption: {
    ...typography.caption,
    marginTop: spacing.sm,
    textAlign: 'center',
    maxWidth: 260,
  },
});
