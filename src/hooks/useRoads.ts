import { ClientDataContext } from "@/context";
import client from "@/utils/client";
import { useContext, useEffect } from "react";

export function useRoads() {
  const {roads, setRoads} = useContext(ClientDataContext);
  
  useEffect(() => {
    client.getRoads().then((response) => {
      setRoads(response.data);
    });
  }, [setRoads]);

  return { roads };
}