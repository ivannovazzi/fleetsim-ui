import useData from "@/data/useData";
import { Route } from "@/types";
import client from "@/utils/client";
import { useEffect } from "react";

export function useDirections() {
  const { directions, setDirections } = useData();

  useEffect(() => {
    client.getDirections().then((directions) => {
      const directionMap = new Map<string, Route>();
      for (const direction of directions.data) {
        directionMap.set(direction.vehicleId, direction.route);
      }
      setDirections(directionMap);
    });
    client.onDirection((direction) => {      
      setDirections((prev) => {
        const updated = new Map<string, Route>(prev);
        updated.set(direction.vehicleId, direction.route);
        return updated;
      });
    });
  }, [setDirections]);

  return directions;
}
