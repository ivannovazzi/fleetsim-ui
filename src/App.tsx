import { useEffect, useState } from "react";
import client from "@/utils/client";
import ControlPanel from "./Controls/Controls";
import Map from "./Map/Map";
import { Modifiers, Position, SimulationStatus } from "./types";
import styles from "./App.module.css";
import { useVehicles } from "./useVehicles";

export default function App() {
  const [destination, setDestination] = useState<{ position: Position; tmp: boolean } | null>(null);
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

  const onMapClick = (coords: Position) => {
    setDestination({position: coords, tmp: true });
    onUnselectVehicle();
    client.getNode(coords).then((node) => {
      setDestination({position: node.data.coordinates, tmp: false });
    });    
  };
  

  const onDestinationClick = async () => {
    await client.direction(
      vehicles.map((v) => v.id),
      destination!.position
    );
    setDestination(null);
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
          destination={destination?.position}
          filters={filters}
          onFilterChange={onFilterChange}
          onChangeModifiers={onChangeModifiers}
          onSelectVehicle={onSelectVehicle}
          onHoverVehicle={onHoverVehicle}
          onUnhoverVehicle={onUnhoverVehicle}
          onDestinationClick={onDestinationClick}
          onRoadSelect={onMapClick}
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
          destination={destination}
        />
      </div>
    </div>
  );
}
