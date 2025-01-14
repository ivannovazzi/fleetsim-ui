import { Modifiers, POI, Position, Road, Vehicle } from "@/types";
import { Filters } from "@/hooks/useVehicles";

import { useNetwork } from "@/hooks/useNetwork";
import { RoadNetworkMap } from "@/components/Map/components/RoadNetworkMap";
import VehicleM from "./Vehicle";
import TrafficZones from "./TrafficZones";
import Direction from "./Direction";
import RoadRenderer from "./Road";
import Heatmap from "./Heatmap";
import POIs from "./POIs";
import { isPOI, isRoad } from "@/utils/general";
import POIMarker from "./POI/POI";

interface MapProps {
  filters: Filters;
  vehicles: Vehicle[];
  animFreq: number;
  modifiers: Modifiers;
  selectedItem: Road | POI | null;
  onClick: (id: string) => void;
  onMapClick?: (event: React.MouseEvent, position: Position) => void;
  onMapContextClick: (evt: React.MouseEvent, position: Position) => void;
}

export default function Map({
  modifiers,
  filters,
  selectedItem,
  onMapClick,
  onMapContextClick,
  ...props
}: MapProps) {
  const network = useNetwork();

  return (
    <RoadNetworkMap
      data={network}
      strokeOpacity={modifiers.showDirections ? 0.4 : 0}
      strokeColor="#444"
      strokeWidth={1.5}
      onClick={onMapClick}
      onContextClick={onMapContextClick}
      htmlMarkers={<POIs visible={modifiers.showPOIs} />}
    >
      <Direction selected={filters.selected} hovered={filters.hovered} />
      <TrafficZones visible={modifiers.showHeatzones} />

      {modifiers.showVehicles &&
        props.vehicles?.map((vehicle) => (
          <VehicleM
            key={vehicle.id}
            animFreq={props.animFreq}
            scale={1}
            {...vehicle}
            onClick={() => props.onClick(vehicle.id)}
          />
        ))}
      {modifiers.showHeatmap && <Heatmap vehicles={props.vehicles} />}
      {selectedItem && isRoad(selectedItem) && (
        <RoadRenderer road={selectedItem} />
      )}
      {selectedItem && isPOI(selectedItem) && <POIMarker poi={selectedItem} />}
    </RoadNetworkMap>
  );
}
