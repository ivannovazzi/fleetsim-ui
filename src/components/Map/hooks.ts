import { useContext } from "react";
import { controlsRef } from "./controls";
import { MapContext } from "./contexts";

export function useMapControls() {
  return controlsRef;
}

export function useMapContext() {
  return useContext(MapContext);
}
