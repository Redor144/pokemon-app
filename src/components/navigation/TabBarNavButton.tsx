import {
  View,
  Text,
  StyleSheet,
  type ColorValue,
  Animated,
} from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import type { LucideIcon } from "lucide-react-native";
import { colors, typography } from "@/constants/theme";
import { useRef, useEffect } from "react";

const ICON_SIZE = 22;
const FLARE_SIZE = 50;
const DOT_SIZE = 4;

type Props = {
  label: string;
  icon: LucideIcon;
  focused: boolean;
  color: ColorValue;
  filled?: boolean;
};

export function TabBarNavButton({
  label,
  icon: Icon,
  focused,
  color,
  filled = false,
}: Props) {
  const half = FLARE_SIZE / 2;
  const flareId = `flare-${label}`;
  const scale = useRef(new Animated.Value(focused ? 1.1 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.1 : 1,
      useNativeDriver: true,
      friction: 7,
    }).start();
  }, [focused, scale]);

  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>
        {focused ? (
          <Svg
            width={FLARE_SIZE}
            height={FLARE_SIZE}
            style={styles.flare}
            pointerEvents="none"
          >
            <Defs>
              <RadialGradient id={flareId} cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop
                  offset="0%"
                  stopColor={colors.primary}
                  stopOpacity={0.45}
                />
                <Stop
                  offset="55%"
                  stopColor={colors.primary}
                  stopOpacity={0.12}
                />
                <Stop
                  offset="100%"
                  stopColor={colors.primary}
                  stopOpacity={0}
                />
              </RadialGradient>
            </Defs>
            <Circle cx={half} cy={half} r={half} fill={`url(#${flareId})`} />
          </Svg>
        ) : null}
        <Animated.View style={{ transform: [{ scale: scale }] }}>
          <Icon
            color={color}
            size={ICON_SIZE}
            fill={filled ? color : "transparent"}
          />
        </Animated.View>
      </View>

      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>

      <View style={styles.dotSlot}>
        {focused ? <View style={styles.dot} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
    paddingTop: 4,
  },
  iconWrap: {
    width: FLARE_SIZE,
    height: FLARE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  flare: {
    ...StyleSheet.absoluteFill,
  },
  label: {
    ...typography.tabLabel,
    marginTop: 2,
  },
  dotSlot: {
    height: DOT_SIZE + 4,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.primary,
  },
});
