import { Tabs } from 'expo-router';
import { colors, fonts } from '@/constants/theme';
import { tabBarNavOptions } from '@/components/tabBarOptions';
import { List, Heart, Camera, Map } from 'lucide-react-native';

export default function TabsLayout() {
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
        headerTitleStyle: {
          color: colors.foreground,
          fontFamily: fonts.nunitoSemiBold,
        },
        headerTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={tabBarNavOptions('Favorite', Heart, 'favorite')}
      />
      <Tabs.Screen
        name="pokemon-list"
        options={tabBarNavOptions('Pokédex', List, 'pokedex')}
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