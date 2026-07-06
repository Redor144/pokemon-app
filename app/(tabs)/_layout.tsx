import { Tabs } from 'expo-router';
import { colors } from '@/constants/theme';
import { tabBarNavOptions } from '@/components/tabBarOptions';
import { List, Heart, Camera, Map } from 'lucide-react-native';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';

export default function TabsLayout() {
  const [loaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  if (!loaded) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 15,
          paddingBottom: 10,
          height: 80,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTitleAlign: 'left',
        headerTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={tabBarNavOptions('Favorite', Heart, 'favorite', {
          filled: true,
          header: { title: 'Favorite Pokémon', subtitle: 'My collection' },
        })}
      />
      <Tabs.Screen
        name="pokemon-list"
        options={tabBarNavOptions('Pokédex', List, 'pokedex', {
          header: { title: 'Pokédex', subtitle: 'Gotta catch \'em all', showIcon: false },
        })}
      />
      <Tabs.Screen
        name="camera"
        options={tabBarNavOptions('Camera', Camera, 'camera')}
      />
      <Tabs.Screen
        name="map"
        options={tabBarNavOptions('Map', Map, 'map')}
      />
    </Tabs>
  );
}