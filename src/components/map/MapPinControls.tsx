import { Pressable, StyleSheet, Text, View } from "react-native";
import { MapPin, Plus, X } from "lucide-react-native";
import SelectionHint from "@/components/ui/SelectionHint";
import { colors, fonts, radius, spacing } from "@/constants/theme";

const SELECTION_HINT = "Tap on the map to place a pin";
const ADD_PIN_LABEL = "Add pin";
const CANCEL_LABEL = "Cancel";
const CANCEL_PIN_PLACEMENT_ACCESSIBILITY_LABEL = "Cancel pin placement";

type Props = {
  isSelectingLocation: boolean;
  pinCount: number;
  onAddPinPress: () => void;
};

export default function MapPinControls({
  isSelectingLocation,
  pinCount,
  onAddPinPress,
}: Props) {
  return (
    <>
      {isSelectingLocation && <SelectionHint text={SELECTION_HINT} />}

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          isSelectingLocation && styles.addButtonActive,
          pressed && styles.addButtonPressed,
        ]}
        onPress={onAddPinPress}
        accessibilityRole="button"
        accessibilityLabel={
          isSelectingLocation
            ? CANCEL_PIN_PLACEMENT_ACCESSIBILITY_LABEL
            : ADD_PIN_LABEL
        }
      >
        {isSelectingLocation ? (
          <X color={colors.primaryForeground} size={22} strokeWidth={2.5} />
        ) : (
          <Plus color={colors.primaryForeground} size={22} strokeWidth={2.5} />
        )}
        <Text style={styles.addButtonText}>
          {isSelectingLocation ? CANCEL_LABEL : ADD_PIN_LABEL}
        </Text>
      </Pressable>

      {pinCount > 0 && (
        <View style={styles.pinCount}>
          <MapPin color={colors.primary} size={14} />
          <Text style={styles.pinCountText}>{pinCount}</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonActive: {
    backgroundColor: colors.destructive,
  },
  addButtonText: {
    fontFamily: fonts.nunitoBold,
    fontSize: 14,
    color: colors.primaryForeground,
  },
  pinCount: {
    position: "absolute",
    left: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  pinCountText: {
    fontFamily: fonts.nunitoBold,
    fontSize: 12,
    color: colors.foreground,
  },
});
