import { ClientDataContext } from "@/context";
import client from "@/utils/client";
import { useContext, useEffect } from "react";

export function useNetwork() {
  const {network, setNetwork} = useContext(ClientDataContext);
  
  useEffect(() => {
    client.getNetwork().then((response) => {
      setNetwork(response.data);
    });
  }, [setNetwork]);

  return network;
}