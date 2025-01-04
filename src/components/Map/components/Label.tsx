import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useMapContext } from '../hooks';
import { Position } from '@/types';

interface LabelProps {
  label: string;
  color?: string;
  width?: number;
  coordinates: Position | Position[];
  onClick?: () => void;
}

const Label: React.FC<LabelProps> = ({
  label,
  color = '#4488ff',
  coordinates,
  onClick
}) => {
  const { projection } = useMapContext();
  const textRef = useRef<SVGTextElement>(null);
  const rectRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    if (!projection || !textRef.current || !label || !coordinates) return;

    let center: Position;
    if (Array.isArray(coordinates[0])) {
      const pts = coordinates as Position[];
      const lngAvg = d3.mean(pts, d => d[0]) ?? 0;
      const latAvg = d3.mean(pts, d => d[1]) ?? 0;
      center = [lngAvg, latAvg];
    } else {
      center = coordinates as Position;
    }

    const projected = projection(center);
    if (projected) {
      textRef.current.setAttribute('x', projected[0].toString());
      textRef.current.setAttribute('y', projected[1].toString());
    }

    const box = textRef.current.getBBox();
    if (rectRef.current) {
      rectRef.current.setAttribute('x', box.x.toString());
      rectRef.current.setAttribute('y', box.y.toString());
      rectRef.current.setAttribute('width', box.width.toString());
      rectRef.current.setAttribute('height', box.height.toString());
    }
  }, [coordinates, projection, label]);

  return (
    <g style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <rect ref={rectRef} fill="black" r="4" />
      <text ref={textRef} fill={color} fontSize={8}>
        {label}
      </text>
    </g>
  );
};

export default Label;