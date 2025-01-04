import { useEffect, useState } from "react";
import { Route } from "@/types";
import { useRoutes } from "@/hooks/useRoutes";
import { Polyline } from "@/components/Map/components/Polyline";
import { invertLatLng } from "@/utils/utils";

interface RouteLineProps {
  route: Route;
  color: string;
}

import Label from "@/components/Map/components/Label";

function RouteLine({ route, color }: RouteLineProps) {
  const distance = `${route.distance.toFixed(1)} km`;
  const coordinates = route.edges
    .map((edge) => edge.start.coordinates)
    .map(invertLatLng);
  return (
    <>
      <Polyline coordinates={coordinates} color={color} />
      <Label label={distance} coordinates={coordinates} color={color} />
    </>
  );
}
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
        <RouteLine
          route={hoveredRoute}
          key={`${hovered}--hovered`}
          color={"#f93"}
        />
      )}
      {selectedRoute && (
        <RouteLine
          route={selectedRoute}
          key={`${selected}--selected`}
          color={"#39f"}
        />
      )}
    </>
  );
}
