import { useCallback } from "react";
import * as d3 from "d3";
import { setMapControlsRef } from "./controls";
import { MapControlsContextValue, PanToOptions } from "./types";
import { MapControlsContext } from "./contexts";
import { Position } from "@/types";

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

  const setBounds = useCallback(
    (bounds: [Position, Position]) => {
      if (!projection || !svgRef || !zoomBehavior) return;
      const [[x0, y0], [x1, y1]] = bounds.map(projection) as [
        Position,
        Position
      ];

      // Get SVG dimensions
      const width = svgRef.clientWidth;
      const height = svgRef.clientHeight;

      // Calculate scale to fit bounds
      const scale = Math.min(
        width / Math.abs(x1 - x0),
        height / Math.abs(y1 - y0)
      ) * 0.9; // 0.9 adds a small padding

      // Calculate center point
      const x = (x0 + x1) / 2;
      const y = (y0 + y1) / 2;

      const transition = d3.select(svgRef).transition().ease(d3.easeLinear);
      transition.call(zoomBehavior.scaleTo, scale);
      transition.call(zoomBehavior.translateTo, x, y);
    },
    [projection, svgRef, zoomBehavior]
  );

  const value: MapControlsContextValue = {
    zoomIn,
    zoomOut,
    panTo,
    setZoom,
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