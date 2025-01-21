import { Position } from "@/types";

export interface PanToOptions {
  duration: number;
}

export interface MapContextValue {
  map: SVGSVGElement | null;
  projection: d3.GeoProjection | null;
  transform: d3.ZoomTransform | null;
  getBoundingBox: () => [Position, Position];
  getZoom: () => number;
}

export interface MapControlsContextValue {
  zoomIn: () => void;
  zoomOut: () => void;
  panTo: (lng: number, lat: number, options: PanToOptions) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: [Position, Position]) => void;
}

export interface OverlayContextValue {
  mapHTMLElement: HTMLElement | null;
  htmlTransform: ((position: Position) => Position ) | null;
}