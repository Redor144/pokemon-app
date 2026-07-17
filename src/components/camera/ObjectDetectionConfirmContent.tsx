import { Pressable, StyleSheet, Text } from "react-native";
import type { Detection } from "react-native-executorch";
import {
  formatDetectionConfidence,
  formatDetectionLabel,
} from "@/components/camera/formatDetection";
import ObjectDetectionPreview from "@/components/camera/ObjectDetectionPreview";
import { colors, fonts, spacing, typography } from "@/constants/theme";
import { commonStyles } from "@/styles/common";
import type { ProposalPreview } from "@/hooks/useObjectTapTracking";

const NO_OBJECT_TITLE = "No object detected";
const ACCEPT_AND_TRACE_LABEL = "Accept and trace";
const DISMISS_LABEL = "Dismiss";

type Props = {
  detection: Detection | null;
  preview: ProposalPreview | null;
  onAccept: () => void;
  onDismiss: () => void;
};

export default function ObjectDetectionConfirmContent({
  detection,
  preview,
  onAccept,
  onDismiss,
}: Props) {
  const hasDetection = detection !== null;

  return (
    <>
      {hasDetection && preview && (
        <ObjectDetectionPreview
          uri={preview.uri}
          frameSize={preview.frameSize}
          bbox={preview.bbox}
        />
      )}

      <Text style={styles.title}>
        {hasDetection
          ? formatDetectionLabel(String(detection.label))
          : NO_OBJECT_TITLE}
      </Text>

      {hasDetection && (
        <Text style={styles.subtitle}>
          {formatDetectionConfidence(detection.score)}
        </Text>
      )}

      {hasDetection && (
        <Pressable
          style={({ pressed }) => [
            commonStyles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onAccept}
        >
          <Text style={commonStyles.primaryButtonText}>
            {ACCEPT_AND_TRACE_LABEL}
          </Text>
        </Pressable>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.dismissButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onDismiss}
      >
        <Text style={styles.dismissButtonText}>{DISMISS_LABEL}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    textAlign: "center",
  },
  subtitle: {
    ...typography.caption,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  dismissButton: {
    width: "100%",
    borderRadius: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    marginTop: spacing.sm,
  },
  dismissButtonText: {
    fontFamily: fonts.nunitoBold,
    fontSize: 16,
    color: colors.destructive,
  },
});
