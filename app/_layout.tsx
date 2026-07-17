import "react-native-gesture-handler";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetProvider } from "@swmansion/react-native-bottom-sheet";
import { initExecutorch } from "react-native-executorch";
import { ExpoResourceFetcher } from "react-native-executorch-expo-resource-fetcher";
import { FavoritePokemonProvider } from "@/contexts/FavoritePokemonContext";

initExecutorch({ resourceFetcher: ExpoResourceFetcher });

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritePokemonProvider>
        <BottomSheetProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </BottomSheetProvider>
      </FavoritePokemonProvider>
    </QueryClientProvider>
  );
}
