import { useEffect, useState } from "react";
import { Route } from "@/types";
import { useRoutes } from "@/hooks/useRoutes";
import { Polyline } from "@/components/Map/components/Polyline";
import { invertLatLng } from "@/utils/utils";

interface RouteProps {
  selected?: string;
  hovered?: string;
}

export default function RouteMap({ selected, hovered }: RouteProps) {
  const routes = useRoutes();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<Route | null>(null);
  useEffect(() => {
    if (routes.size > 0) {
      if (selected) setSelectedRoute(routes.get(selected)!);
      else setSelectedRoute(null);
    }
  }, [routes, selected]);

  useEffect(() => {
    if (routes.size > 0) {
      if (hovered) setHoveredRoute(routes.get(hovered)!);
      else setHoveredRoute(null);
    }
  }, [routes, hovered]);


  return (
    <>
      {hoveredRoute && (
        <Polyline
          coordinates={hoveredRoute.edges.map((edge) => invertLatLng(edge.start.coordinates))}
          key={`${hovered}--hovered`}
          color={"#f93"}
        />
      )}
      {selectedRoute && (
        <Polyline
          coordinates={selectedRoute.edges.map((edge) => invertLatLng(edge.start.coordinates))}
          key={`${selected}--selected`}
          color={"#39f"}
        />
      )}      
    </>
  );
}
