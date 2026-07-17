import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { TabHeaderCounter } from '@/components/navigation/tabBarOptions';

export function usePokemonListHeader(count: number) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <TabHeaderCounter value={count} />,
    });
  }, [navigation, count]);
}