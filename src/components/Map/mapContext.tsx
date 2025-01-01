import { createContext, useContext } from "react";

export interface MapContextValue {
  projection: d3.GeoProjection | null;
  transform: d3.ZoomTransform | null;
}
export const MapContext = createContext<MapContextValue>({
  projection: null,
  transform: null,
});

interface Props {
  projection: d3.GeoProjection | null;
  transform: d3.ZoomTransform | null;
  children: React.ReactNode;
}

export const MapContextProvider: React.FC<Props> = ({
  projection,
  transform,
  children,
}) => (
  <MapContext.Provider value={{ projection, transform }}>
    {children}
  </MapContext.Provider>
);

export function useMapContext() {
  return useContext(MapContext);
}
