import { StyleSheet } from "react-native";
import { colors, fonts, spacing, typography } from "@/constants/theme";

export const SPRITE_SIZE = 180;
export const GLOW_SIZE = 260;
export const MAX_STAT = 255;

export const pokemonDetailStyles = StyleSheet.create({
  id: {
    ...typography.pokemonId,
    alignSelf: "flex-start",
  },
  name: {
    ...typography.pokemonNameLarge,
    textTransform: "capitalize",
    textAlign: "center",
  },
  typeRow: {
    justifyContent: "center",
    gap: spacing.md,
  },
  stats: {
    width: "100%",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statLabel: {
    width: 72,
    ...typography.mono,
    fontSize: 12,
    lineHeight: 16,
  },
  statValue: {
    width: 32,
    textAlign: "right",
    fontFamily: fonts.dmMonoMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.stat,
  },
  actionButton: {
    marginTop: spacing.sm,
  },
  destructiveButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.secondary,
  },
  destructiveButtonText: {
    color: colors.destructiveForeground,
  },
  spriteHero: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: SPRITE_SIZE + spacing.lg,
    marginVertical: spacing.sm,
  },
  spriteGlow: {
    position: "absolute",
  },
});
