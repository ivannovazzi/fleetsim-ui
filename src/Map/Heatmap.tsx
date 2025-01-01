import React, { useContext, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { Vehicle } from "@/types";
import { RoadNetworkContext } from "./RoadNetworkMap";

interface HeatmapProps {
  vehicles: Vehicle[];
  bandwidth?: number;
  opacity?: number;
  thresholds?: number;
  debounceMs?: number;
}

export default function Heatmap({
  vehicles,
  bandwidth = 10,
  opacity = 0.02,
  thresholds = 50,
}: HeatmapProps) {
  const { projection } = useContext(RoadNetworkContext);
  const heatmapRef = useRef<SVGGElement>(null);
  
  // Memoize density generator
  const density = useMemo(
    () =>
      d3
        .contourDensity<[number, number]>()
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
    if (!projection || !heatmapRef.current || vehicles.length === 0) return;

    // Project points
    const points = vehicles.map(v => projection(v.position) ?? [0, 0]);
    
    // Generate contours
    const contours = density(points);
    
    // Update color scale domain
    colorScale.domain([0, d3.max(contours, d => d.value) ?? 1]);

    // Simple update pattern
    const heatGroup = d3.select(heatmapRef.current);
    
    const paths = heatGroup
      .selectAll<SVGPathElement, d3.ContourMultiPolygon>("path")
      .data(contours);

    // Remove old
    paths.exit().remove();
    
    // Add new
    paths.enter()
      .append("path")
      .merge(paths)
      .attr("d", d3.geoPath())
      .attr("fill", d => colorScale(d.value))
      .attr("opacity", opacity)
      .attr("stroke", "none");

  }, [vehicles, projection, density, colorScale, opacity]);

  return <g ref={heatmapRef} className="heatmap-layer" />;
}