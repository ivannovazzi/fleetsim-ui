import { MapControlsContextValue } from "./types";

export let controlsRef: MapControlsContextValue = {
  zoomIn: () => {},
  zoomOut: () => {},
  panTo: () => {},
  setZoom: () => {},
  setBounds: () => {},
};

export function setMapControlsRef(ref: typeof controlsRef) {
  controlsRef = ref;
}
