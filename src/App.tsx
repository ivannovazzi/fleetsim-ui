import { useCallback, useEffect, useState } from "react";
import client from "@/utils/client";
import ControlPanel from "./Controls/Controls";
import Map from "./Map/Map";
import SearchBar from "./SearchBar";
import Zoom from "./Zoom/";
import { Modifiers, POI, Position, Road, SimulationStatus } from "./types";
import styles from "./App.module.css";
import { useVehicles } from "./hooks/useVehicles";
import useContextMenu from "./hooks/useContextMenu";
import ContextMenu from "./components/ContextMenu";
import { Button } from "./components/Inputs";
import { isRoad } from "./utils/general";

export default function App() {
  const [onContextClick, ref, xy, closeContextMenu] = useContextMenu();
  const [selectedItem, setSelectedItem] = useState<Road | POI | null>(null);
  const [destination, setDestination] = useState<Position | null>(null);
  const [status, setStatus] = useState<SimulationStatus>({
    adapterTimeout: 0,
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
    setSelectedItem(null);
  };

  const onDestinationClick = async () => {
    let coordinates: Position;
    if (!selectedItem) return;
    if (isRoad(selectedItem)) {
      const getOne = (arr: Position[]) =>
        arr[Math.floor(Math.random() * arr.length)];
      coordinates = getOne(selectedItem.streets.flat());
    } else {
      coordinates = [selectedItem.coordinates[1], selectedItem.coordinates[0]];
    }
    await setFinalDestination(
      coordinates,
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
    setSelectedItem(road.data);
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
    client.getVehicles().then((response) => {
      setVehicles(response.data);
    });
  }, [setVehicles]);

  const setUseAdapter = useCallback(
    async (use: boolean) => {
      await client.setUseAdapter(use);
      client.getVehicles().then((response) => {
        setVehicles(response.data);
      });
    },
    [setVehicles]
  );

  useEffect(() => {
    client.onConnect(() => setConnected(true));
    client.onDisconnect(() => setConnected(false));
    client.onStatus((data) => {
      setStatus({ interval: data.interval, running: data.running, adapterTimeout: data.adapterTimeout });
    });
    client.getStatus().then((response) => {
      if (response.data) {
        setStatus({
          adapterTimeout: response.data.adapterTimeout,
          interval: response.data.interval,
          running: response.data.running,
        });
      }
    });

    client.connectWebSocket();
    return () => client.disconnect();
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.controls}>
        <ControlPanel
          status={status}
          vehicles={vehicles}
          connected={connected}
          modifiers={modifiers}
          filters={filters}
          onFilterChange={onFilterChange}
          onChangeModifiers={onChangeModifiers}
          onSelectVehicle={onSelectVehicle}
          onHoverVehicle={onHoverVehicle}
          onUnhoverVehicle={onUnhoverVehicle}
          onAdapterChange={setUseAdapter}
        />
      </div>

      <div className={styles.map}>
        <Map
          animFreq={status.interval}
          vehicles={vehicles}
          filters={filters}
          modifiers={modifiers}
          selectedItem={selectedItem}
          onClick={onSelectVehicle}
          onMapClick={onMapClick}
          onMapContextClick={onMapContextClick}
          onPOIClick={(poi) => setSelectedItem(poi)}
        />
        <SearchBar
          selectedItem={selectedItem}
          onDestinationClick={onDestinationClick}
          onItemSelect={(item) => setSelectedItem(item)}
          onItemUnselect={() => setSelectedItem(null)}
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
