let controlsRef: {
  zoomIn: () => void;
  zoomOut: () => void;
  panTo: (lng: number, lat: number) => void;
} = {
  zoomIn: () => {},
  zoomOut: () => {},
  panTo: () => {},
};

export function setMapControlsRef(ref: typeof controlsRef) {
  controlsRef = ref;
}

export function useMapControls() {
  return controlsRef;
}
