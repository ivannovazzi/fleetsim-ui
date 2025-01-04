import useData from "@/DataProvider/useData";
import client from "@/utils/client";
import { useEffect } from "react";

export function useNetwork() {
  const {network, setNetwork} = useData();
  
  useEffect(() => {
    client.getNetwork().then((response) => {
      setNetwork(response.data);
    });
  }, [setNetwork]);

  return network;
}