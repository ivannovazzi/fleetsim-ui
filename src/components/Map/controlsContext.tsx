import { createContext, useCallback } from "react";
import * as d3 from "d3";
import { MapControlsContextValue, PanToOptions, setMapControlsRef } from "./controls";

const MapControlsContext = createContext<MapControlsContextValue>({
  zoomIn: () => {},
  zoomOut: () => {},
  panTo: () => {},
  setZoom: () => {},
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
    (lng: number, lat: number, options: PanToOptions) => {
      if (!projection || !svgRef || !zoomBehavior) return;
      const [x, y] = projection([lng, lat]) ?? [0, 0];
      const transition = d3.select(svgRef).transition().ease(d3.easeLinear);
      if (options?.duration) {
        transition.duration(options.duration);
      }
      transition.call(zoomBehavior.translateTo, x, y);
    },
    [projection, svgRef, zoomBehavior]
  );

  const setZoom = useCallback(
    (zoom: number) => {
      if (!svgRef || !zoomBehavior) return;
      d3.select(svgRef).transition().call(zoomBehavior.scaleTo, zoom);
    },
    [svgRef, zoomBehavior]
  );

  const value: MapControlsContextValue = {
    zoomIn,
    zoomOut,
    panTo,
    setZoom,
  };

  // Register controls in store
  setMapControlsRef(value);

  return (
    <MapControlsContext.Provider value={value}>
      {children}
    </MapControlsContext.Provider>
  );
}