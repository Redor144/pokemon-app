import type { LucideIcon } from 'lucide-react-native';
import type { ColorValue } from 'react-native';
import { TabBarNavButton } from '@/components/TabBarNavButton';

export function tabBarNavOptions(label: string, icon: LucideIcon, flareId: string) {
  return {
    title: label,
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
      />
    ),
  };
}
