import React, { useRef, useEffect } from "react";
import { Position } from "@/types";
import { useMapContext } from "../hooks";
import { on } from "events";

interface MarkerProps {
  position: Position;
  children?: React.ReactNode;
  offset?: [number, number];
  animation?: number;
  onClick?: (e: React.MouseEvent<SVGGElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<SVGGElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<SVGGElement>) => void;
}

export const Marker: React.FC<MarkerProps> = ({
  position,
  children,
  offset,
  animation = 500,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { projection } = useMapContext();
  const markerRef = useRef<SVGGElement>(null);

  // Existing position update effect
  useEffect(() => {
    if (!projection || !markerRef.current) return;
    const [x, y] = projection(position) ?? [0, 0];
    markerRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, [position, projection]);

  const onMarkerClick = (e: React.MouseEvent<SVGGElement>) => {
    if (!onClick) return;
    e.stopPropagation();
    onClick(e);
  };

  return (
    <g
      ref={markerRef}
      onClick={onMarkerClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transition: `transform ${animation}ms linear`,
        transform: "translate(0, 0)",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <g transform={`translate(${offset?.[0] ?? 0}, ${offset?.[1] ?? 0})`}>
        {children}
      </g>
    </g>
  );
};
