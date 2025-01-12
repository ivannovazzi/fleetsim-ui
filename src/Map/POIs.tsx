import { useMapContext } from "@/components/Map/hooks";
import { usePois } from "@/hooks/usePois";
import POIMarker from "./POI";

export default function POIs({ visible }: { visible: boolean }) {
  const { pois } = usePois();
  const { getBoundingBox } = useMapContext(); // Assume map controls provide bounding box
  if (!visible) return null;

  const bbox = getBoundingBox();
  const inBoundsPois = pois.filter((poi) => {
    const [lat, lng] = poi.coordinates;

    const north = bbox[0][1];
    const south = bbox[1][1];
    const east = bbox[1][0];
    const west = bbox[0][0];
    return lat >= south && lat <= north && lng >= west && lng <= east;
  });

  const limitedPois = inBoundsPois.slice(0, 30);

  return limitedPois.map((poi) => (
    <POIMarker key={poi.id} poi={poi} />
  ));
}
