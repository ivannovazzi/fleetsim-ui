import { useEffect, useState } from "react";
import { Polyline } from "../components/Polyline";
import { Route } from "@/types";
import { useRoutes } from "@/hooks/useRoutes";

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
      {selectedRoute && (
        <Polyline
          coordinates={selectedRoute.edges.map((edge) => edge.start.coordinates)}
          key={`${selected}--selected`}
          color={"#39f"}
        />
      )}
      {hoveredRoute && (
        <Polyline
          coordinates={hoveredRoute.edges.map((edge) => edge.start.coordinates)}
          key={`${hovered}--hovered`}
          color={"#f93"}
        />
      )}
    </>
  );
}
