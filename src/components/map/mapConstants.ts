import type { Region } from "react-native-maps";

export const MAP_LOAD_TIMEOUT_MS = 8000;

export const CRACOW_REGION: Region = {
  latitude: 50.0647,
  longitude: 19.945,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export type MapLoadState = "loading" | "ready" | "unavailable";

export type MapPressEvent = {
  nativeEvent: { coordinate: { latitude: number; longitude: number } };
};
