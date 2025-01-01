import { useMapControls } from "@/components/Map/controls";

const SomeButtonBar = () => {
  const {zoomIn, zoomOut, panTo} = useMapControls();  

  return (
    <>
      <button onClick={zoomIn}>Zoom In</button>
      <button onClick={zoomOut}>Zoom Out</button>
      <button onClick={() => panTo(36, -1)}>Pan to Berlin</button>
      {/* ... */}
    </>
  );
};

export default SomeButtonBar;