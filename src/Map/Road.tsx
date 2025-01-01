import { Road } from "@/types";
import { Polyline } from "@/components/Map/components/Polyline";
import { useEffect } from "react";
import { useMapControls } from "@/components/Map/hooks";

interface RouteProps {
  road: Road;
}

function getBounds(streets: [number, number][]): [[number, number], [number, number]] {
  const bounds = {
    min: { x: Infinity, y: Infinity },
    max: { x: -Infinity, y: -Infinity },
  };
  streets.forEach(([x, y]) => {
    bounds.min.x = Math.min(bounds.min.x, x);
    bounds.min.y = Math.min(bounds.min.y, y);
    bounds.max.x = Math.max(bounds.max.x, x);
    bounds.max.y = Math.max(bounds.max.y, y);
  });
  return [
    [bounds.min.x, bounds.min.y],
    [bounds.max.x, bounds.max.y],
  ];
}

export default function RouteMap({ road }: RouteProps) {  
  const { setBounds } = useMapControls();
  useEffect(() => {
    setBounds(getBounds(road.streets.flat()));    
  }, [road.streets, setBounds]);
  return road.streets.map((street, i) => (
    <Polyline
      coordinates={street}
      key={`street-${i}`}
      color={"#fff"}
    />
  ));
  
}
