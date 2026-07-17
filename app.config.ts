import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "pokemon-app",
  slug: "pokemon-app",
  scheme: "pokemon-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    bundleIdentifier: "com.pokemon.app",
    supportsTablet: true,
    infoPlist: {
      NSCameraUsageDescription:
        "Allow Pokémon App to use the camera for AR detection.",
      NSPhotoLibraryAddUsageDescription:
        "Allow Pokémon App to save photos to the library.",
    },
  },
  android: {
    package: "com.pokemon.app",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    permissions: [
      "android.permission.CAMERA",
      "android.permission.WRITE_EXTERNAL_STORAGE",
    ],
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-dev-client",
    "expo-image",
    [
      "expo-build-properties",
      {
        ios: { newArchEnabled: true, deploymentTarget: "17.0" },
        android: { newArchEnabled: true, minSdkVersion: 26 },
      },
    ],
    [
      "react-native-maps",
      {
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    ],
  ],
};

export default config;
