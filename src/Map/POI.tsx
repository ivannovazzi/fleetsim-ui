import { Marker } from "@/components/Map/components/Marker";
import { POI } from "@/types";

function getFillByType(type: string) {
  if (type === "shop") {
    return "#FF0000";
  }
  if (type === "leisure") {
    return "#00FF00";
  }
  if (type === "craft") {
    return "#0000FF";
  }
  if (type === "office") {
    return "#FFFF00";
  }
}

export default function POIMarker({ poi }: { poi: POI }) {
  return (
    <Marker key={poi.id} position={[poi.coordinates[1], poi.coordinates[0]]}>
      <rect
        x="-2"
        y="-2"
        width="4"
        height="4"
        rx="1"
        ry="1"
        fill={getFillByType(poi.type)}
        fillOpacity="0.6"
        stroke="#fff"
        strokeWidth={0.3}
      />
    </Marker>
  );
}
