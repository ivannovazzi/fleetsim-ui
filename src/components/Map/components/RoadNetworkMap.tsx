import React, { useEffect, useState, MouseEventHandler, useRef } from "react";
import * as d3 from "d3";
import { Position, RoadNetwork } from "@/types";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { MapControlsProvider } from "../providers/ControlsContextProvider";
import { MapContextProvider } from "../providers/MapContextProvider";
import { OverlayProvider } from "../providers/OverlayContextProvider";
interface RoadNetworkMapProps {
  data: RoadNetwork;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  children?: React.ReactNode;
  htmlMarkers?: React.ReactNode;
  onClick?: (event: React.MouseEvent, position: Position) => void;
  onContextClick?: (event: React.MouseEvent, position: Position) => void;
}

export const RoadNetworkMap: React.FC<RoadNetworkMapProps> = ({
  data,
  strokeColor = "#999",
  strokeWidth = 1.5,
  strokeOpacity = 0.4,
  children,
  onClick,
  onContextClick,
  htmlMarkers,
}) => {
  const [svgRef, setSvgRef] = useState<SVGSVGElement | null>(null);
  const [projection, setProjection] = useState<d3.GeoProjection | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform | null>(null);
  const [zoom, setZoom] = useState<d3.ZoomBehavior<
    SVGSVGElement,
    unknown
  > | null>(null);
  const [containerRef, size] = useResizeObserver();
  const markersRefs = useRef<Map<HTMLDivElement, Position>>(new Map());
  const markersProjections = useRef<Map<HTMLDivElement, Position>>(new Map());

  useEffect(() => {
    if (!svgRef || !size.width || !size.height || !data) return;

    const svg = d3.select(svgRef);
    svg.selectAll("g.roads").remove();
    svg.attr("width", size.width).attr("height", size.height);

    const proj = d3.geoMercator().fitSize([size.width, size.height], data);
    const pathGen = d3.geoPath().projection(proj);
    setProjection(() => proj);

    const roadsGroup = svg.insert("g", ":first-child").attr("class", "roads");

    // Filter and cache long main roads first
    const mainRoads = data.features.filter((d) => {
      if (!d.properties.name) return false;
      if (d.properties.highway === "primary") return true;
      const length = d3.geoLength(d);
      return length > 0.0001; // Stricter threshold
    });

    // Add roads
    roadsGroup
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", pathGen)
      .attr("fill", "none")
      .attr("stroke", (d) =>
        d.properties.type === "highway" ? "#222" : strokeColor
      )
      .attr("stroke-width", (d) =>
        d.properties.type === "highway" ? strokeWidth * 2 : strokeWidth
      )
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("id", (d, i) => (mainRoads.includes(d) ? `road-${i}` : null));

    const labelsGroup = roadsGroup
      .append("g")
      .attr("class", "street-labels")
      .style("opacity", 0.4);

    const markersGroup = svg.select<SVGGElement>("g.markers");

    // Simplified zoom handler
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 15])
      .on("zoom", (evt) => {
        requestAnimationFrame(() => {
          roadsGroup.attr("transform", evt.transform.toString());
          markersGroup.attr("transform", evt.transform.toString());
          labelsGroup.style("opacity", evt.transform.k > 6 ? 0.9 : 0);
          setTransform(evt.transform);
        });
      });

    setZoom(() => zoomBehavior);
    svg.call(zoomBehavior);
  
  }, [data, size, strokeColor, strokeWidth, strokeOpacity, svgRef]);

  useEffect(() => {
    if (!projection || !transform || !markersRefs.current.size) return;

    let rafId = 0;

    function updateHtmlMarkers() {
      markersRefs.current.forEach((position, node) => {
        if (!node) return;
        const [x, y] = projection?.(position) ?? [0, 0];
        const [screenX, screenY] = transform!.apply([x, y]);
        node.style.transform = `translate3d(${screenX}px, ${screenY}px, 0)`;
      });
    }

    rafId = requestAnimationFrame(updateHtmlMarkers);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [projection, transform]);

  const getBoundingBox = () => {
    let boundingBox = [
      [0, 0],
      [0, 0],
    ] as [Position, Position];
    if (projection && transform && size.width && size.height) {
      const topLeft = projection.invert?.(transform.invert([0, 0])) ?? [0, 0];
      const bottomRight = projection.invert?.(
        transform.invert([size.width, size.height])
      ) ?? [0, 0];
      boundingBox = [topLeft, bottomRight];
    }
    return boundingBox;
  };

  const getZoom = () => transform?.k ?? 0;

  const setRef = (node: HTMLDivElement, position: Position) => {
    markersRefs.current.set(node, position);
    markersProjections.current.set(node, projection?.(position) ?? [0, 0]);
  }


  const onSvgClick: MouseEventHandler<SVGSVGElement> = (evt) => {
    if (!projection || !transform) return;
    const [sx, sy] = d3.pointer(evt, svgRef);
    const [mx, my] = transform.invert([sx, sy]);
    const coords = projection.invert?.([mx, my]);
    if (!coords) return;
    onClick?.(evt, coords);
  };

  const onSvgContextClick: MouseEventHandler<SVGSVGElement> = (evt) => {
    if (!projection || !transform) return;
    const [sx, sy] = d3.pointer(evt, svgRef);
    const [mx, my] = transform.invert([sx, sy]);
    const coords = projection.invert?.([mx, my]);
    if (!coords) return;
    onContextClick?.(evt, coords);
  };

  // divide children by MArker and HTMLMarker
  return (
    <MapContextProvider
      projection={projection}
      transform={transform}
      setRef={setRef}
      getBoundingBox={getBoundingBox}
      getZoom={getZoom}
    >
      <MapControlsProvider
        svgRef={svgRef}
        zoomBehavior={zoom}
        projection={projection}
      >
        <OverlayProvider
          projection={projection}
          transform={transform}
          getRef={() => containerRef.current}
        >
          <div
            ref={containerRef}
            style={{ width: "100%", height: "100%", position: "relative" }}
          >
            <svg
              ref={(node) => setSvgRef(node)}
              style={{
                width: "100%",
                height: "100%",
                background: "#111",
                display: "block",
                cursor: "grab",
              }}
              onClick={onSvgClick}
              onContextMenu={onSvgContextClick}
            >
              <g className="markers">
                {children}
              </g>
            </svg>
            <div style={{ position: "absolute", top: 0, left: 0 }}>
              {htmlMarkers}
            </div>
          </div>
        </OverlayProvider>
      </MapControlsProvider>
    </MapContextProvider>
  );
};
