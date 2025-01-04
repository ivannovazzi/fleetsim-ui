import useData from "@/DataProvider/useData";
import client from "@/utils/client";
import { useEffect } from "react";

export function useRoads() {
  const { roads, setRoads } = useData();

  useEffect(() => {
    client.getRoads().then((response) => {
      setRoads(response.data.filter((road) => road.name !== ""));
    });
  }, [setRoads]);

  return { roads };
}
