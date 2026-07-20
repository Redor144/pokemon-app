import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, fonts, spacing, typography } from "@/constants/theme";
import { commonStyles } from "@/styles/common";

const DEFAULT_ACTION_LABEL = "Retry";

type Props = {
  title?: string;
  caption?: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
};

export default function FeatureCardPlaceholder({
  title,
  caption,
  loading,
  actionLabel = DEFAULT_ACTION_LABEL,
  onAction,
}: Props) {
  const showAction = !loading && onAction !== undefined;

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator color={colors.primary} />}
      {title && <Text style={styles.title}>{title}</Text>}
      {caption && <Text style={styles.caption}>{caption}</Text>}
      {showAction && (
        <Pressable
          style={styles.actionButton}
          onPress={onAction}
          accessibilityRole="button"
        >
          <Text style={commonStyles.primaryButtonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.nunitoBold,
    fontSize: 16,
    color: colors.foreground,
    textAlign: "center",
  },
  caption: {
    ...typography.caption,
    textAlign: "center",
    maxWidth: 260,
  },
  actionButton: {
    ...commonStyles.primaryButton,
    width: "auto",
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
});
