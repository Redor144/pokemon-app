import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabHeaderTitle } from "@/components/navigation/TabHeaderTitle";
import { colors, spacing } from "@/constants/theme";

export type TabScreenHeaderOptions = {
  headerRight?: (props: {
    tintColor?: string;
    canGoBack: boolean;
  }) => ReactNode;
};

type Props = {
  title: string;
  subtitle?: string;
  options: TabScreenHeaderOptions;
};

export function TabScreenHeader({ title, subtitle, options }: Props) {
  const insets = useSafeAreaInsets();
  const headerRight = options.headerRight?.({
    tintColor: colors.primary,
    canGoBack: false,
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.titleContainer}>
          <TabHeaderTitle title={title} subtitle={subtitle} />
        </View>
        {headerRight}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
});
