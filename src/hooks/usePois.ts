import useData from "@/data/useData";
import client from "@/utils/client";
import { useEffect } from "react";

export function usePois() {
  const { pois, setPOIs } = useData();

  useEffect(() => {
    client.getPois().then((response) => {
      setPOIs(response.data);
    });
  }, [setPOIs]);

  return { pois };
}
