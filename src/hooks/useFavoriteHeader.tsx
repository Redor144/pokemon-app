import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { TabHeaderIcon } from '@/components/navigation/tabBarOptions';
import type { PokemonListItem } from '@/types/pokemon';

export function useFavoriteHeader(favorite: PokemonListItem | null) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: favorite
        ? () => <TabHeaderIcon icon={Heart} filled variant="secondary" />
        : undefined,
    });
  }, [navigation, favorite]);
}
