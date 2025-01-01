import { useHeatzones } from "@/hooks/useHeatzones";
import React, { useMemo } from "react";
import { useMapContext } from "@/components/Map/mapContext";

function PoligonToPath(coordinates: [number, number][]) {
  return (
    coordinates
      .map(([x, y], i) => {
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ") + " Z"
  );
}

interface PolygonProps {
  coordinates: [number, number][];
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export const Polygon: React.FC<PolygonProps> = ({
  coordinates,
  fill = "none",
  fillOpacity = 1,
  stroke = "#000",
  strokeWidth = 1,
  opacity = 1,
}) => {
  const { projection } = useMapContext();

  const projected = useMemo(() => {
    if (!projection) return "";

    const projectedPoints = coordinates
      .map((coord) => projection(coord))
      .filter((point) => point !== null) as [number, number][];

    if (projectedPoints.length === 0) return "";

    return projectedPoints;
  }, [coordinates, projection]);

  if (!projected) return null;

  return (
    <path
      d={PoligonToPath(projected)}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
    />
  );
};

export default function Heatzones({ visible }: { visible: boolean }) {
  const heatzones = useHeatzones();
  if (!visible) return null;
  return heatzones.map((heatzone) => {
    return (
      <Polygon
        key={heatzone.properties.id}
        coordinates={heatzone.geometry.coordinates}
        fill="#f00"
        fillOpacity={0.2}
        stroke="#ff000099"
        opacity={heatzone.properties.intensity}
      />
    );
  });
}
