import React, { useRef, useEffect } from "react";
import { useMapContext } from "../hooks";
import { Position } from "@/types";

interface HtmlMarkerProps {
  position: Position;
  offset?: [number, number];
  className?: string;
  children?: React.ReactNode;
}

export default function HTMLMarker({
  position,
  offset = [0, 0],
  className,
  children,
}: HtmlMarkerProps) {
  const { projection, transform } = useMapContext();
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!markerRef.current || !projection || !transform) return;
    const [x, y] = projection(position) ?? [0, 0];
    const [screenX, screenY] = transform.apply([x, y]);
    markerRef.current.style.transform = `translate(${screenX}px, ${screenY}px)`;
    markerRef.current.style.position = "absolute";
    markerRef.current.style.left = `${offset[0]}px`;
    markerRef.current.style.top = `${offset[1]}px`;
  }, [position, offset, projection, transform]);

  return (
    <div ref={markerRef} className={className}>
      {children}
    </div>
  );
}
