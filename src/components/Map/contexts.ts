import { createContext } from "react";
import { MapContextValue, MapControlsContextValue } from "./types";

export const MapContext = createContext<MapContextValue>({
  projection: null,
  transform: null,
});

export const MapControlsContext = createContext<MapControlsContextValue>({
  zoomIn: () => {},
  zoomOut: () => {},
  panTo: () => {},
  setZoom: () => {},
});
