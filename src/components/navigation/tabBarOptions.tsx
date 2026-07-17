import type { LucideIcon } from "lucide-react-native";
import { View, StyleSheet, type ColorValue } from "react-native";
import { TabBarNavButton } from "@/components/navigation/TabBarNavButton";
import {
  TabScreenHeader,
  type TabScreenHeaderOptions,
} from "@/components/navigation/TabScreenHeader";
import { colors, spacing } from "@/constants/theme";
import AnimatedTextView from "animated-text";

const HEADER_ICON_SIZE = 18;
const CIRCLE_SIZE = 36;

type TabHeaderIconVariant = "primary" | "secondary";

type TabHeaderConfig = {
  title: string;
  subtitle: string;
};

const headerIconCircle = {
  primary: {
    color: colors.primary,
    background: colors.border,
    border: colors.primary,
  },
  secondary: {
    color: colors.secondary,
    background: colors.secondaryBorder,
    border: colors.secondary,
  },
} as const;

export function TabHeaderIcon({
  icon: Icon,
  filled,
  variant = "primary",
}: {
  icon: LucideIcon;
  filled: boolean;
  variant?: TabHeaderIconVariant;
}) {
  const circle = headerIconCircle[variant];

  return (
    <View style={styles.headerIcon}>
      <View
        style={[
          styles.circle,
          {
            borderColor: circle.border,
            backgroundColor: circle.background,
          },
        ]}
      >
        <Icon
          size={HEADER_ICON_SIZE}
          color={circle.color}
          fill={filled ? circle.color : undefined}
        />
      </View>
    </View>
  );
}

export function TabHeaderCounter({
  value,
  remountKey = 0,
}: {
  value: number;
  remountKey?: number;
}) {
  return (
    <View style={styles.counterWrap}>
      <AnimatedTextView
        key={remountKey}
        value={value}
        color={colors.primary}
        style={styles.counterText}
      />
    </View>
  );
}

export function tabBarNavOptions(
  label: string,
  icon: LucideIcon,
  header: TabHeaderConfig,
  options?: { filled?: boolean },
) {
  return {
    title: header.title,
    header: (props: { options: TabScreenHeaderOptions }) => (
      <TabScreenHeader
        title={header.title}
        subtitle={header.subtitle}
        options={props.options}
      />
    ),
    tabBarIcon: ({
      focused,
      color,
    }: {
      focused: boolean;
      color: ColorValue;
      size: number;
    }) => (
      <TabBarNavButton
        label={label}
        icon={icon}
        focused={focused}
        color={color}
        filled={options?.filled ?? false}
      />
    ),
  };
}

const styles = StyleSheet.create({
  headerIcon: {
    marginRight: spacing.lg,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  counterWrap: {
    flexShrink: 0,
    minWidth: 120,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: {
    minWidth: 80,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});
