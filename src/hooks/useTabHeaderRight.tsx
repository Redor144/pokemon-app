import { useCallback, useLayoutEffect, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";

type Options = {
  remountOnFocus?: boolean;
};

export function useTabHeaderRight(
  render: ((remountKey: number) => ReactNode) | null | undefined,
  { remountOnFocus = false }: Options = {},
) {
  const navigation = useNavigation();
  const [remountKey, setRemountKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (remountOnFocus && Platform.OS === "android") {
        setRemountKey((key) => key + 1);
      }
    }, [remountOnFocus]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: render ? () => render(remountKey) : undefined,
    });
  }, [navigation, render, remountKey]);
}
