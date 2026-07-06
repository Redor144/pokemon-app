import type { LucideIcon } from 'lucide-react-native';
import { View, StyleSheet, type ColorValue } from 'react-native';
import { TabBarNavButton } from '@/components/TabBarNavButton';
import { TabHeaderTitle } from '@/components/TabHeaderTitle';
import { colors, spacing } from '@/constants/theme';

const HEADER_ICON_SIZE = 18;
const CIRCLE_SIZE = 36;

type TabHeaderIconVariant = 'primary' | 'secondary';

type TabHeaderConfig = {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconFilled?: boolean;
  iconVariant?: TabHeaderIconVariant;
  showIcon?: boolean;
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
  variant = 'primary',
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
          fill={filled ? circle.color : 'transparent'}
        />
      </View>
    </View>
  );
}

export function tabBarNavOptions(
  label: string,
  icon: LucideIcon,
  flareId: string,
  options?: { filled?: boolean; header?: TabHeaderConfig },
) {
  const headerTitle = options?.header?.title ?? label;
  const headerIcon = options?.header?.icon ?? icon;
  const headerIconFilled = options?.header?.iconFilled ?? options?.filled ?? false;
  const headerIconVariant =
    options?.header?.iconVariant ?? (headerIconFilled ? 'secondary' : 'primary');
  const showHeaderIcon = options?.header?.showIcon ?? true;

  return {
    title: headerTitle,
    headerTitle: () => (
      <TabHeaderTitle
        title={headerTitle}
        subtitle={options?.header?.subtitle}
      />
    ),
    headerRight: showHeaderIcon ? () => (
      <TabHeaderIcon
        icon={headerIcon}
        filled={headerIconFilled}
        variant={headerIconVariant}
      />
    ) :undefined,
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
        flareId={flareId}
        filled={options?.filled ?? false}
      />
    ),
  };
}

const styles = StyleSheet.create({
  headerIcon: {
    marginRight: spacing.lg,
    paddingBottom: spacing.lg,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
