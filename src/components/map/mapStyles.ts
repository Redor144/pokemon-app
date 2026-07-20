import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/constants/theme";

export const mapStyles = StyleSheet.create({
  mapCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xl,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.card,
  },
});
