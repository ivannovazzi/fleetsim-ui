import { Modifiers, Position, Road, Vehicle } from "@/types";
import { Filters } from "@/useVehicles";

import { useNetwork } from "@/hooks/useNetwork";
import { RoadNetworkMap } from "./RoadNetworkMap";
import VehicleM from "./Vehicle";
import Heatzones from "./Heatzones";
import Route from "./Route";
import Roada from "./Road";
import Destination from "./Destination";
import Heatmap from "./Heatmap";

interface MapProps {
  destination: { position: Position, tmp: boolean } | null;
  filters: Filters;
  vehicles: Vehicle[];
  animFreq: number;
  modifiers: Modifiers;
  road: Road | null;
  onClick: (id: string) => void;
  onMapClick: (e: Position) => void;
}

export default function Map({
  destination,
  modifiers,
  filters,
  road,
  onMapClick,
  ...props
}: MapProps) {
  const network = useNetwork();

  return (
    <RoadNetworkMap
      data={network}
      width={800}
      height={600}
      strokeOpacity={modifiers.showRoutes ? 0.4 : 0}
      strokeColor="#444"
      strokeWidth={1.5}
      onClick={onMapClick}
    >      
      {destination && <Destination destination={destination} />}
      <Route selected={filters.selected} hovered={filters.hovered} />
      <Heatzones visible={modifiers.showHeatzones} />
      {props.vehicles?.map((vehicle) => (
        <VehicleM
          key={vehicle.id}
          position={vehicle.position}
          animFreq={props.animFreq}
          id={vehicle.id}
          status={vehicle.status}
          scale={1}
          speed={vehicle.speed}
          heading={vehicle.heading}
          flags={vehicle.flags}
          name={vehicle.name}
          visible={vehicle.visible}
          selected={vehicle.selected}
          hovered={vehicle.hovered}
          onClick={() => props.onClick(vehicle.id)}
        />
      ))}
      {modifiers.showHeatmap && <Heatmap
        vehicles={props.vehicles}
      />}
      {road && (
        <Roada
          road={road}
        />
      )}
    </RoadNetworkMap>
  );
}
