import useData from "@/DataProvider/useData";
import { Route } from "@/types";
import client from "@/utils/client";
import { useEffect } from "react";

export function useRoutes() {
  const { routes, setRoutes } = useData();

  useEffect(() => {
    client.getRoutes().then((routes) => {
      const routeMap = new Map<string, Route>();
      for (const route of routes.data) {
        routeMap.set(route.vehicleId, route.route);
      }
      setRoutes(routeMap);
    });
    client.onRoute((vehicleRoute) => {      
      setRoutes((prev) => {
        const updated = new Map<string, Route>(prev);
        updated.set(vehicleRoute.vehicleId, vehicleRoute.route);
        return updated;
      });
    });
  }, [setRoutes]);

  return routes;
}
