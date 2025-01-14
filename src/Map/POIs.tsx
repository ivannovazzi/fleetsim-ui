import { useMapContext } from "@/components/Map/hooks";
import { usePois } from "@/hooks/usePois";
import POIMarker from "./POI/POI";
import { Position } from "@/types";

function areCoordinatesNear(
  [lat1, lng1]: Position,
  [lat2, lng2]: Position,
  minDistance = 0.0001
) {
  return (
    Math.abs(lat1 - lat2) < minDistance && Math.abs(lng1 - lng2) < minDistance
  );
}

function distanceToCenter(
  [lat, lng]: Position,
  [centerLat, centerLng]: Position
) {
  return Math.sqrt((lat - centerLat) ** 2 + (lng - centerLng) ** 2);
}

function zoomToDistance(zoom: number) {
  return 0.00002 * 2 ** (14 - zoom);
}

export default function POIs({ visible }: { visible: boolean }) {
  const { pois } = usePois();
  const { getBoundingBox, getZoom } = useMapContext();
  if (!visible) return null;

  const [[west, north], [east, south]] = getBoundingBox();
  const zoom = getZoom();
  const centerLat = (north + south) / 2;
  const centerLng = (west + east) / 2;

  const inBoundsPois = pois.filter(
    ({ coordinates: [lat, lng] }) =>
      lat >= south && lat <= north && lng >= west && lng <= east
  );

  const uniquePois: typeof inBoundsPois = [];

  for (const poi of inBoundsPois) {
    if (
      !uniquePois.some((existing) =>
        areCoordinatesNear(
          existing.coordinates,
          poi.coordinates,
          zoomToDistance(zoom)
        )
      )
    ) {
      uniquePois.push(poi);
    }
  }

  uniquePois.sort(
    (a, b) =>
      distanceToCenter(a.coordinates, [centerLat, centerLng]) -
      distanceToCenter(b.coordinates, [centerLat, centerLng])
  );

  return uniquePois.map((poi) => <POIMarker key={poi.id} poi={poi} />);
}
