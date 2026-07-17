import ObjectSpriteOverlay, {
  type BboxRect,
} from "@/components/camera/ObjectSpriteOverlay";
import PulsingBboxRect from "@/components/camera/PulsingBboxRect";
import type { ObjectTrackingPhase } from "@/hooks/useObjectTapTracking";
import type { PokemonListItem } from "@/types/pokemon";

type Props = {
  rect: BboxRect | null;
  pokemon?: PokemonListItem | null;
  phase?: ObjectTrackingPhase;
};

export default function ObjectTrackingBbox({
  rect,
  pokemon,
  phase = "tracking",
}: Props) {
  if (!rect) {
    return null;
  }

  return (
    <>
      <PulsingBboxRect rect={rect} phase={phase} />
      {pokemon ? <ObjectSpriteOverlay rect={rect} pokemon={pokemon} /> : null}
    </>
  );
}
