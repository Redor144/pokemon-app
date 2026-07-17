import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import ViewShot, { type ViewShotRef } from "react-native-view-shot";
import ObjectSpriteOverlay, {
  type BboxRect,
} from "@/components/camera/ObjectSpriteOverlay";
import FaceOverlay from "@/components/face-overlay/FaceOverlay";
import type { DetectedFace } from "@/components/face-overlay/faceOverlayTypes";
import { mirrorFacesHorizontally } from "@/components/face-overlay/mirrorFacesHorizontally";
import type { PokemonListItem } from "@/types/pokemon";

type CompositeParams = {
  photoUri: string;
  pokemon: PokemonListItem;
  size: { width: number; height: number };
  faces?: DetectedFace[];
  bboxRect?: BboxRect;
  mirrorSprites?: boolean;
};

export type PhotoOverlayCompositorRef = {
  composite: (params: CompositeParams) => Promise<string>;
};

const PhotoOverlayCompositor = forwardRef<PhotoOverlayCompositorRef>(
  function PhotoOverlayCompositor(_, ref) {
    const viewShotRef = useRef<ViewShotRef>(null);
    const [compositing, setCompositing] = useState<CompositeParams | null>(
      null,
    );
    const resolveRef = useRef<((uri: string) => void) | null>(null);
    const rejectRef = useRef<((error: Error) => void) | null>(null);
    const photoLoadedRef = useRef(false);
    const spritesReadyRef = useRef(false);

    const resetComposite = useCallback(() => {
      resolveRef.current = null;
      rejectRef.current = null;
      photoLoadedRef.current = false;
      spritesReadyRef.current = false;
      setCompositing(null);
    }, []);

    const finishComposite = useCallback(
      async (success: boolean, error?: Error) => {
        if (!success) {
          rejectRef.current?.(error ?? new Error("Capture failed"));
          resetComposite();
          return;
        }

        if (!viewShotRef.current) {
          rejectRef.current?.(new Error("Compositor is not ready."));
          resetComposite();
          return;
        }

        try {
          const uri = await viewShotRef.current.capture();
          resolveRef.current?.(uri);
        } catch (captureError) {
          rejectRef.current?.(
            captureError instanceof Error
              ? captureError
              : new Error("Capture failed"),
          );
        } finally {
          resetComposite();
        }
      },
      [],
    );

    const tryCapture = useCallback(() => {
      if (!photoLoadedRef.current || !spritesReadyRef.current) return;
      void finishComposite(true);
    }, [finishComposite]);

    useImperativeHandle(
      ref,
      () => ({
        composite: (params) =>
          new Promise<string>((resolve, reject) => {
            photoLoadedRef.current = false;
            spritesReadyRef.current = false;
            resolveRef.current = resolve;
            rejectRef.current = reject;
            setCompositing(params);
          }),
      }),
      [],
    );

    const handlePhotoLoad = useCallback(() => {
      photoLoadedRef.current = true;
      tryCapture();
    }, [tryCapture]);

    const handleSpritesReady = useCallback(() => {
      spritesReadyRef.current = true;
      tryCapture();
    }, [tryCapture]);

    if (!compositing) return null;

    const { photoUri, faces, bboxRect, pokemon, size, mirrorSprites } =
      compositing;
    const compositeFaces =
      faces && mirrorSprites
        ? mirrorFacesHorizontally(faces, size.width)
        : faces;

    return (
      <View
        style={[styles.offscreen, { width: size.width, height: size.height }]}
        pointerEvents="none"
      >
        <ViewShot
          ref={viewShotRef}
          style={{ width: size.width, height: size.height }}
          options={{ format: "jpg", quality: 0.9 }}
        >
          <Image
            source={{ uri: photoUri }}
            style={{ width: size.width, height: size.height }}
            contentFit="cover"
            onLoad={handlePhotoLoad}
          />
          {bboxRect ? (
            <ObjectSpriteOverlay
              rect={bboxRect}
              pokemon={pokemon}
              onSpriteReady={handleSpritesReady}
            />
          ) : (
            <FaceOverlay
              pokemon={pokemon}
              faces={compositeFaces ?? []}
              mirrorSprites={mirrorSprites}
              onSpritesReady={handleSpritesReady}
            />
          )}
        </ViewShot>
      </View>
    );
  },
);

export default PhotoOverlayCompositor;

const styles = StyleSheet.create({
  offscreen: {
    position: "absolute",
    left: -9999,
    top: 0,
    opacity: 0,
  },
});
