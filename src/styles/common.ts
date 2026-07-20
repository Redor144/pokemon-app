import { StyleSheet } from "react-native";
import { colors, fonts, radius, spacing, typography } from "../constants/theme";

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading,
    textTransform: "capitalize",
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  listContent: {
    padding: spacing.md,
  },
  footerCaption: {
    ...typography.caption,
    textAlign: "center",
    margin: spacing.lg,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  typeText: {
    fontFamily: fonts.nunitoBold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  progressTrack: {
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressTrackSm: {
    height: 4,
  },
  progressTrackMd: {
    height: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.stat,
    borderRadius: radius.full,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  primaryButtonText: {
    fontFamily: fonts.nunitoBold,
    fontSize: 16,
    color: colors.primaryForeground,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  sheetSurface: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  sheetContent: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
});
