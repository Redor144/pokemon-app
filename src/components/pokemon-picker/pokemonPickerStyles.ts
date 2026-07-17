import { StyleSheet } from "react-native";
import { spacing } from "@/constants/theme";

export const pokemonPickerStyles = StyleSheet.create({
  screenState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenList: {
    flex: 1,
  },
  embeddedContainer: {
    width: "100%",
  },
  embeddedState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  listFooter: {
    margin: spacing.lg,
  },
});
