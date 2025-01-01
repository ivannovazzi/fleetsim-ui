export interface PanToOptions {
  duration: number;
}

export interface MapContextValue {
  projection: d3.GeoProjection | null;
  transform: d3.ZoomTransform | null;
}

export interface MapControlsContextValue {
  zoomIn: () => void;
  zoomOut: () => void;
  panTo: (lng: number, lat: number, options: PanToOptions) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: [[number, number], [number, number]]) => void;
}
