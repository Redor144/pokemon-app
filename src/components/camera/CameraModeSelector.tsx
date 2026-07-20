import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, spacing } from "@/constants/theme";
import type { DetectionMode } from "@/types/camera";

const FACE_DETECTION_LABEL = "Face Detection";
const OBJECT_DETECT_LABEL = "Object Detect";

type Props = {
  mode: DetectionMode;
  onModeChange: (mode: DetectionMode) => void;
};

export default function CameraModeSelector({ mode, onModeChange }: Props) {
  return (
    <View style={styles.segmentedControl}>
      <Pressable
        style={[styles.segment, mode === "face" && styles.segmentActive]}
        onPress={() => onModeChange("face")}
        accessibilityRole="button"
        accessibilityState={{ selected: mode === "face" }}
      >
        <Text
          style={[
            styles.segmentText,
            mode === "face" && styles.segmentTextActive,
          ]}
        >
          {FACE_DETECTION_LABEL}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.segment, mode === "object" && styles.segmentActive]}
        onPress={() => onModeChange("object")}
        accessibilityRole="button"
        accessibilityState={{ selected: mode === "object" }}
      >
        <Text
          style={[
            styles.segmentText,
            mode === "object" && styles.segmentTextActive,
          ]}
        >
          {OBJECT_DETECT_LABEL}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: "row",
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
    padding: spacing.xs,
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontFamily: fonts.nunitoBold,
    fontSize: 14,
    color: colors.mutedForeground,
  },
  segmentTextActive: {
    color: colors.primaryForeground,
  },
});
