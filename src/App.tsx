import { useEffect, useState } from "react";
import client from "@/utils/client";
import ControlPanel from "./Controls/Controls";
import Map from "./Map/Map";
import SearchBar from "./SearchBar";
import Zoom from "./Zoom/"
import { Modifiers, Position, Road, SimulationStatus } from "./types";
import styles from "./App.module.css";
import { useVehicles } from "./useVehicles";
import useContextMenu from "./hooks/useContextMenu";
import ContextMenu from "./components/ContextMenu";
import { Button } from "./components/Inputs";

export default function App() {
  const [onContextClick, ref, xy, closeContextMenu] = useContextMenu();
  const [selectedRoad, setSelectedRoad] = useState<Road | null>(null);
  const [destination, setDestination] = useState<Position | null>(null);
  const [status, setStatus] = useState<
    Pick<SimulationStatus, "interval" | "running">
  >({
    interval: 0,
    running: false,
  });

  const [connected, setConnected] = useState(false);
  const {
    vehicles,
    modifiers,
    filters,
    setVehicles,
    onSelectVehicle,
    onUnselectVehicle,
    onHoverVehicle,
    onUnhoverVehicle,
    setModifiers,
    onFilterChange,
  } = useVehicles();

  const onChangeModifiers =
    <T extends keyof Modifiers>(name: T) =>
    (value: Modifiers[T]) => {
      setModifiers((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

  const onMapClick = () => {
    clearMap();
  };

  const clearMap = () => {
    closeContextMenu();
    setDestination(null);
    onUnselectVehicle();
    setSelectedRoad(null);
  };

  const onRoadDestinationClick = async () => {
    const positions = selectedRoad!.streets.flat();
    const getOne = (arr: Position[]) =>
      arr[Math.floor(Math.random() * arr.length)];

    await setFinalDestination(
      getOne(positions),
      vehicles.map((v) => v.id)
    );
    clearMap();
  };

  const onPointDestinationClick = async () => {
    await setFinalDestination(
      destination!,
      vehicles.map((v) => v.id)
    );
    clearMap();
  };

  const onPointDestinationSingleClick = async () => {
    await setFinalDestination(destination!, [filters.selected!]);
    clearMap();
  };

  const onFindRoadClick = async () => {
    const road = await client.findRoad(destination!);
    setSelectedRoad(road.data);
    closeContextMenu();
  };

  const setFinalDestination = async (
    position: Position,
    vehicleIds: string[]
  ) => {
    const coordinates = await client.findNode(position);

    await client.direction(vehicleIds, coordinates.data);
  };

  const onMapContextClick = (e: React.MouseEvent, position: Position) => {
    setDestination(position);
    onContextClick(e);
  };

  useEffect(() => {
    client.onConnect(() => setConnected(true));
    client.onDisconnect(() => setConnected(false));

    client.onStatus((data) => {
      setStatus({ interval: data.interval, running: data.running });
      setVehicles(data.vehicles);
    });

    client.getStatus().then((response) => {
      if (response.data) {
        setStatus({
          interval: response.data.interval,
          running: response.data.running,
        });
        setVehicles(response.data.vehicles);
      }
    });

    client.connectWebSocket();

    return () => client.disconnect();
  }, [setVehicles]);

  return (
    <div className={styles.app}>
      <div className={styles.controls}>
        <ControlPanel
          running={status.running}
          interval={status.interval}
          vehicles={vehicles}
          connected={connected}
          modifiers={modifiers}
          filters={filters}
          onFilterChange={onFilterChange}
          onChangeModifiers={onChangeModifiers}
          onSelectVehicle={onSelectVehicle}
          onHoverVehicle={onHoverVehicle}
          onUnhoverVehicle={onUnhoverVehicle}          
        />
      </div>

      <div className={styles.map}>
        <Map
          animFreq={status.interval}
          vehicles={vehicles}
          filters={filters}
          modifiers={modifiers}
          onClick={onSelectVehicle}
          onMapClick={onMapClick}
          onMapContextClick={onMapContextClick}
          selectedRoad={selectedRoad}
        />
        <SearchBar
        selectedRoad={selectedRoad}
        onDestinationClick={onRoadDestinationClick}
        onRoadSelect={(road) => setSelectedRoad(road)}
        />
        <Zoom />
      </div>
      {xy && (
        <ContextMenu position={xy}>
          <div
            ref={ref}
            style={{
              padding: "0.5rem",
              backdropFilter: "blur(5px)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "0.5rem",
              gap: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Button onClick={onPointDestinationClick}>
              Find Directions To Here
            </Button>
            <Button onClick={onFindRoadClick}>Identify closest road</Button>
            {filters.selected && (
              <Button onClick={onPointDestinationSingleClick}>
                Send selected vehicle here
              </Button>
            )}
          </div>
        </ContextMenu>
      )}
    </div>
  );
}
