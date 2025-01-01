import { useMapControls } from "@/components/Map/controls";
import { Vehicle } from "@/types";
import { useEffect } from "react";

export default function useTracking(
  vehicles: Vehicle[],
  selected: string | undefined,
  duration: number = 0
) {
  const { panTo, setZoom } = useMapControls();
  const vehicle = vehicles.find((v) => v.id === selected);
  const [lng, lat] = vehicle?.position || [null, null];

  useEffect(() => {    
    if (lng! && lat!)
      panTo(lng, lat, { duration });
  }, [lng, lat, duration, panTo]);

  useEffect(() => {
    if (selected) {
      setZoom(15);
    }
  }, [selected, setZoom]);
}
