import { Tabs } from 'expo-router';
import { colors } from '@/constants/theme';
import { tabBarNavOptions } from '@/components/tabBarOptions';
import { List, Heart, Camera, Map } from 'lucide-react-native';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';


const FAVORITE_LABEL = 'Favorite';
const FAVORITE_TITLE = 'Favorite Pokémon';
const FAVORITE_SUBTITLE = 'My collection';

const POKEDEX_LABEL = 'Pokédex';
const POKEDEX_TITLE = 'Pokédex';
const POKEDEX_SUBTITLE = 'Gotta catch \'em all';

const CAMERA_LABEL = 'Camera';
const CAMERA_TITLE = 'AR Pokémon Cam';
const CAMERA_SUBTITLE = 'Vision camera';

const MAP_LABEL = 'Map';
const MAP_TITLE = 'Map';
const MAP_SUBTITLE = 'Pokémon World';

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
        freezeOnBlur: true,
        lazy: true,
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={tabBarNavOptions(FAVORITE_LABEL, Heart,
          { title: FAVORITE_TITLE, subtitle: FAVORITE_SUBTITLE, icon: Heart },
          { filled: true }
        )}
      />
      <Tabs.Screen
        name="pokemon-list"
        options={tabBarNavOptions(POKEDEX_LABEL, List, { title: POKEDEX_TITLE, subtitle: POKEDEX_SUBTITLE, },
        )}
      />
      <Tabs.Screen
        name="camera"
        options={tabBarNavOptions(CAMERA_LABEL, Camera, { title: CAMERA_TITLE, subtitle: CAMERA_SUBTITLE },
        )}
      />
      <Tabs.Screen
        name="map"
        options={tabBarNavOptions(MAP_LABEL, Map, { title: MAP_TITLE, subtitle: MAP_SUBTITLE },
        )}
      />
    </Tabs>
  );
}