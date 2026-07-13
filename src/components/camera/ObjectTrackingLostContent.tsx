import { Pressable, StyleSheet, Text } from 'react-native';
import { formatDetectionLabel } from '@/components/camera/formatDetection';
import { colors, spacing, typography } from '@/constants/theme';
import { commonStyles } from '@/styles/common';

const LOST_OBJECT_TITLE = 'Object lost';
const LOST_OBJECT_MESSAGE =
  'We lost track of the object. Try moving the camera more slowly, or tap an object to select it again.';
const DISMISS_LABEL = 'Got it';

type Props = {
  label: string | null;
  onDismiss: () => void;
};

export default function ObjectTrackingLostContent({ label, onDismiss }: Props) {
  return (
    <>
      <Text style={styles.title}>{LOST_OBJECT_TITLE}</Text>

      {label && (
        <Text style={styles.subtitle}>Lost: {formatDetectionLabel(label)}</Text>
      )}

      <Text style={styles.message}>{LOST_OBJECT_MESSAGE}</Text>

      <Pressable
        style={({ pressed }) => [commonStyles.primaryButton, pressed && styles.buttonPressed]}
        onPress={onDismiss}
      >
        <Text style={commonStyles.primaryButtonText}>{DISMISS_LABEL}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
    color: colors.destructive,
  },
  message: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    color: colors.mutedForeground,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
