import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, spacing } from "@/constants/theme";

type Props = {
  text: string;
};

export default function SelectionHint({ text }: Props) {
  return (
    <View style={styles.selectionHint} pointerEvents="none">
      <Text style={styles.selectionHintText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selectionHint: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    zIndex: 1,
  },
  selectionHintText: {
    fontFamily: fonts.nunitoBold,
    fontSize: 13,
    color: colors.foreground,
    textAlign: "center",
  },
});
