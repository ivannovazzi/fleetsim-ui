import { useMapContext } from "@/components/Map/hooks";
import { usePois } from "@/hooks/usePois";
import POIMarker from "./POI/POI";
import { POI } from "@/types";

/** Returns the Euclidean distance in pixels between two points. */
function distancePx(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}


interface POIMarkerProps {
  visible: boolean;
  onClick: (poi: POI) => void;
}

export default function POIs({ visible, onClick }: POIMarkerProps) {
  const { pois } = usePois();
  const { getBoundingBox, projection, transform } = useMapContext();

  if (!visible || !projection || !transform) return null;

  const [[west, north], [east, south]] = getBoundingBox();

  const inBoundsPois = pois.filter(
    ({ coordinates: [lat, lng] }) =>
      lat >= south && lat <= north && lng >= west && lng <= east
  );

  const minPxDistance = 120;

  const placedPois: Array<{
    poi: typeof inBoundsPois[number];
    px: number;
    py: number;
  }> = [];

  for (const poi of inBoundsPois) {
    const [lat, lng] = poi.coordinates;    
    const projected = projection([lng, lat]);
    
    if (!projected) continue;    
    const [px, py] = transform.apply(projected);
    
    const tooClose = placedPois.some(({ px: x2, py: y2 }) => {
      return distancePx(px, py, x2, y2) < minPxDistance;
    });
    if (!tooClose) {
      placedPois.push({ poi, px, py });
    }
  }

  return (
    <>
      {placedPois.map(({ poi }) => (
        <POIMarker key={poi.id} poi={poi} onClick={() => onClick(poi)}/>
      ))}
    </>
  );
}