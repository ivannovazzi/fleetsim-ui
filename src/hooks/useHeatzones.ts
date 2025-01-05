import useData from "@/data/useData";
import client from "@/utils/client";
import { useEffect } from "react";

export function useHeatzones() {
  const { heatzones, setHeatzones } = useData();

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
