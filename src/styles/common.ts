import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading,
    textTransform: 'capitalize',
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});