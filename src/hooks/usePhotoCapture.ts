import { Asset, requestPermissionsAsync } from 'expo-media-library';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { CameraPreviewRef } from '@/types/camera';

type Params = {
  cameraRef: React.RefObject<CameraPreviewRef | null>;
};

export function usePhotoCapture({ cameraRef }: Params) {
  const [isCapturing, setIsCapturing] = useState(false);

  const capturePhoto = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);

    try {
      const uri = await cameraRef.current.captureForSave();

      const { status } = await requestPermissionsAsync(true);
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Allow photo library access to save photos.');
        return;
      }

      await Asset.create(uri.startsWith('file://') ? uri : `file://${uri}`);
      Alert.alert('Saved', 'Photo saved to your library.');
    } catch (error) {
      console.error(error);
      Alert.alert('Capture failed', 'Could not save the photo. Try again.');
    } finally {
      setIsCapturing(false);
    }
  }, [cameraRef, isCapturing]);

  return { capturePhoto, isCapturing };
}
