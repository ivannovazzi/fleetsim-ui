import { ClientDataContext } from "@/context";
import client from "@/utils/client";
import { useContext, useEffect } from "react";

export function useHeatzones() {
  const { heatzones, setHeatzones } = useContext(ClientDataContext);

  useEffect(() => {
    client.getHeatzones().then((heatzonesData) => {
      setHeatzones(heatzonesData.data);
    });
    client.onHeatzones((heatzones) => {      
      setHeatzones(heatzones);        
    });
  }, [setHeatzones]);

  return heatzones;
}
