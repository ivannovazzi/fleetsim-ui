export interface PanToOptions {
  duration: number;
}

export interface MapControlsContextValue {
  zoomIn: () => void;
  zoomOut: () => void;
  panTo: (lng: number, lat: number, options: PanToOptions) => void;
  setZoom: (zoom: number) => void;
}

let controlsRef: MapControlsContextValue = {
  zoomIn: () => {},
  zoomOut: () => {},
  panTo: () => {},
  setZoom: () => {},
};

export function setMapControlsRef(ref: typeof controlsRef) {
  controlsRef = ref;
}

export function useMapControls() {
  return controlsRef;
}
