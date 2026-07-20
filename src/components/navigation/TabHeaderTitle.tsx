import { View, Text, StyleSheet } from "react-native";
import { spacing, typography } from "@/constants/theme";

type Props = {
  title: string;
  subtitle?: string;
};

export function TabHeaderTitle({ title, subtitle }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.textBlock}>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  textBlock: {
    flexShrink: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.screenTitle,
  },
  subtitle: {
    ...typography.caption,
    marginTop: 1,
    textTransform: "uppercase",
  },
});
