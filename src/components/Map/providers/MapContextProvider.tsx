import { Position } from "@/types";
import { MapContext } from "./contexts";

interface Props {
  projection: d3.GeoProjection | null;
  transform: d3.ZoomTransform | null;
  setRef: (node: HTMLDivElement, position: Position) => void;
  getBoundingBox: () => [Position, Position];
  getZoom: () => number;
  children: React.ReactNode;
}

export const MapContextProvider: React.FC<Props> = ({
  projection,
  transform,
  setRef,
  getBoundingBox,
  getZoom,
  children,
}) => (
  <MapContext.Provider value={{ projection, transform, setRef, getBoundingBox, getZoom }}>
    {children}
  </MapContext.Provider>
);
