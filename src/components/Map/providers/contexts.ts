import { createContext } from "react";
import { OverlayContextValue, MapContextValue, MapControlsContextValue } from "./types";

export const MapContext = createContext<MapContextValue>({
  projection: null,
  transform: null,
});

export const MapControlsContext = createContext<MapControlsContextValue>({
  zoomIn: () => {},
  zoomOut: () => {},
  panTo: () => {},
  setZoom: () => {},
  setBounds: () => {},
});

export const OverlayContext = createContext<OverlayContextValue>({
  htmlTransform: null,
  mapHTMLElement: null,
});
