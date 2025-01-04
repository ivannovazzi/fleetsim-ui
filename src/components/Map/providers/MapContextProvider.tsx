import { MapContext } from "./contexts";

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
