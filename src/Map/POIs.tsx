import { useMapContext } from "@/components/Map/hooks";
import { usePois } from "@/hooks/usePois";
import POIMarker from "./POI/POI";
import { POI } from "@/types";
import { isBusStop, isNotBusStop } from "./POI/helpers";
import { GeoProjection, ZoomTransform } from "d3";

/** Returns the Euclidean distance in pixels between two points. */
function distancePx(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function getBySpacing(items: POI[], transform: ZoomTransform, projection: GeoProjection, minPxDistance: number) {
  const placedPois: Array<{
    poi: typeof items[number];
    px: number;
    py: number;
  }> = [];

  for (const poi of items) {
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
  return placedPois;
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

  
  const inBoundsPois = pois.filter(poi => !!poi.name).filter(
    ({ coordinates: [lat, lng] }) =>
      lat >= south && lat <= north && lng >= west && lng <= east
  );
  const busStops = inBoundsPois.filter(isBusStop);
  const notBusStops = inBoundsPois.filter(isNotBusStop);
  
  const placedPois = getBySpacing(notBusStops, transform, projection, 120);
  const placedBusStops = getBySpacing(busStops, transform, projection, 40);

  return (
    <>      
      {placedBusStops.map(({ poi }) => (
        <POIMarker key={poi.id} poi={poi} onClick={() => onClick(poi)} />
      ))}

      {placedPois.map(({ poi }) => (
        <POIMarker key={poi.id} poi={poi} onClick={() => onClick(poi)}/>
      ))}
    </>
  );
}