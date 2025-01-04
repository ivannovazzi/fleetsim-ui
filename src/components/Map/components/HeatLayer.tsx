import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { useMapContext } from "@/components/Map/hooks";
import { Position } from "@/types";

interface HeatLayerProps {
  data: Position[];
  bandwidth?: number;
  opacity?: number;
  thresholds?: number;
  debounceMs?: number;
}

export default function HeatLayer({
  data,
  bandwidth = 10,
  opacity = 0.02,
  thresholds = 50,
}: HeatLayerProps) {
  const { projection } = useMapContext();
  const heatmapRef = useRef<SVGGElement>(null);
  
  // Memoize density generator
  const density = useMemo(
    () =>
      d3
        .contourDensity<Position>()
        .x(d => d[0])
        .y(d => d[1])
        .bandwidth(bandwidth)
        .thresholds(thresholds)
        .size([1300, 1000]),
    [bandwidth, thresholds]
  );

  // Simple color interpolator
  const colorScale = useMemo(
    () => d3.scaleSequential()
      .interpolator(d3.interpolateRgb("#00ff00", "#ff0000")),
    []
  );

  useEffect(() => {
    if (!projection || !heatmapRef.current || data.length === 0) return;
    
    const points = data.map(v => projection(v) ?? [0, 0]) as Position[];        
    const contours = density(points);
        
    colorScale.domain([0, d3.max(contours, d => d.value) ?? 1]);
    
    const heatGroup = d3.select(heatmapRef.current);
    const paths = heatGroup
      .selectAll<SVGPathElement, d3.ContourMultiPolygon>("path")
      .data(contours);
    
    paths.exit().remove();
        
    paths.enter()
      .append("path")
      .merge(paths)
      .attr("d", d3.geoPath())
      .attr("fill", d => colorScale(d.value))
      .attr("opacity", opacity)
      .attr("stroke", "none");

  }, [data, projection, density, colorScale, opacity]);

  return <g ref={heatmapRef} className="heatmap-layer" />;
}