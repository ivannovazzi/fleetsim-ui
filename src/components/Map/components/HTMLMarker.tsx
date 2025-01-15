import React, { useRef, useEffect } from "react";
import { useMapContext } from "../hooks";
import { Position } from "@/types";

interface HtmlMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  position: Position;
  offset?: [number, number];
  children?: React.ReactNode;
}

export default function HTMLMarker({
  position,
  offset = [0, 0],
  children,
  ...props 
}: HtmlMarkerProps) {
  const { projection, transform } = useMapContext();
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!markerRef.current || !projection || !transform) return;
    const [x, y] = projection(position) ?? [0, 0];
    const [screenX, screenY] = transform.apply([x, y]);
    markerRef.current.style.transform = `translate3d(${screenX + offset[0]}px, ${screenY + offset[1]}px, 0)`;

  }, [position, offset, projection, transform]);

  const style:React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 0,
    width: 0,
  }

  return (
    <div ref={markerRef} style={style} {...props}>
      {children}
    </div>
  );
}
