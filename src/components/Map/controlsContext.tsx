import { createContext, useCallback } from "react";
import * as d3 from "d3";
import { setMapControlsRef } from "./controls";

export interface MapControlsContextValue {
  zoomIn: () => void;
  zoomOut: () => void;
  panTo: (lng: number, lat: number) => void;
  setBounds: () => void;
}

export const MapControlsContext = createContext<MapControlsContextValue>({
  zoomIn: () => {},
  zoomOut: () => {},
  panTo: () => {},
  setBounds: () => {},
});

interface Props {
  svgRef: SVGSVGElement | null;
  zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown> | null;
  projection: d3.GeoProjection | null;
  children: React.ReactNode;
}

export function MapControlsProvider({
  svgRef,
  zoomBehavior,
  projection,
  children
}: Props) {
  const zoomIn = useCallback(() => {
    if (!svgRef || !zoomBehavior) return;
    d3.select(svgRef).transition().call(zoomBehavior.scaleBy, 1.3);
  }, [svgRef, zoomBehavior]);

  const zoomOut = useCallback(() => {
    if (!svgRef || !zoomBehavior) return;
    d3.select(svgRef).transition().call(zoomBehavior.scaleBy, 1 / 1.3);
  }, [svgRef, zoomBehavior]);

  const panTo = useCallback(
    (lng: number, lat: number) => {
      if (!projection || !svgRef || !zoomBehavior) return;
      const [x, y] = projection([lng, lat]) ?? [0, 0];
      d3.select(svgRef).transition().call(zoomBehavior.translateTo, x, y);
    },
    [projection, svgRef, zoomBehavior]
  );

  const setBounds = useCallback(() => {
    // Custom bounding logic
  }, []);

  const value: MapControlsContextValue = {
    zoomIn,
    zoomOut,
    panTo,
    setBounds
  };

  // Register controls in store
  setMapControlsRef(value);

  return (
    <MapControlsContext.Provider value={value}>
      {children}
    </MapControlsContext.Provider>
  );
}