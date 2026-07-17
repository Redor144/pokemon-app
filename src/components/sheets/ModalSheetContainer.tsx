import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { ModalBottomSheet } from "@swmansion/react-native-bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/constants/theme";
import { commonStyles } from "@/styles/common";

type Props = {
  index: number;
  onIndexChange: (index: number) => void;
  onSettle?: (index: number) => void;
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export default function ModalSheetContainer({
  index,
  onIndexChange,
  onSettle,
  contentStyle,
  children,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <ModalBottomSheet
      detents={[0, "content"]}
      index={index}
      onIndexChange={onIndexChange}
      onSettle={onSettle}
      scrimColor={colors.overlay}
      surface={
        <View style={[StyleSheet.absoluteFill, commonStyles.sheetSurface]} />
      }
    >
      <View
        style={[
          commonStyles.sheetContent,
          { paddingBottom: insets.bottom + spacing.xl },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </ModalBottomSheet>
  );
}
