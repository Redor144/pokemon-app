import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useIsFocused } from "expo-router";
import {
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import type { CameraFacing } from "@/types/camera";

export function useCameraPreviewState(facing: CameraFacing) {
  const isFocused = useIsFocused();
  const [appState, setAppState] = useState(AppState.currentState);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(facing);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", setAppState);
    return () => subscription.remove();
  }, []);

  const isActive = isFocused && appState === "active";

  return { isActive, hasPermission, requestPermission, device };
}
