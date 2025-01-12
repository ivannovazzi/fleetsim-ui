import { Position } from "@/types";
import { MapContext } from "./contexts";

interface Props {
  projection: d3.GeoProjection | null;
  transform: d3.ZoomTransform | null;
  getBoundingBox: () => [Position, Position];
  children: React.ReactNode;
}

export const MapContextProvider: React.FC<Props> = ({
  projection,
  transform,
  getBoundingBox,
  children,
}) => (
  <MapContext.Provider value={{ projection, transform, getBoundingBox }}>
    {children}
  </MapContext.Provider>
);
