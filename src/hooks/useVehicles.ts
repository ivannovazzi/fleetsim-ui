import { useCallback, useEffect, useState, useRef } from "react";
import client from "../utils/client";
import { Modifiers, Position, Vehicle, VehicleDTO } from "../types";

export interface Filters {
  filter: string;
  visible: string[];
  selected?: string;
  hovered?: string;
}

export interface FiltersActions {
  onSelectVehicle: (id: string) => void;
  onUnselectVehicle: () => void;
  onHoverVehicle: (id: string) => void;
  onUnhoverVehicle: () => void;
  onFilterChange: (value: string) => void;
}

export function useFilters(): {
  filters: Filters;
} & FiltersActions {
  const [filters, setFilters] = useState<Filters>({
    filter: "",
    visible: [],
    selected: undefined,
    hovered: undefined,
  });

  const onSelectVehicle = useCallback((id: string) => {
    setFilters((prev) => ({
      ...prev,
      selected: prev.selected === id ? undefined : id,
    }));
  }, []);

  const onUnselectVehicle = useCallback(() => {
    setFilters((prev) => ({ ...prev, selected: undefined }));
  }, []);

  const onHoverVehicle = useCallback((id: string) => {
    setFilters((prev) => ({ ...prev, hovered: id }));
  }, []);

  const onUnhoverVehicle = useCallback(() => {
    setFilters((prev) => ({ ...prev, hovered: undefined }));
  }, []);

  const onFilterChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, filter: value }));
  }, []);

  return {
    filters,
    onSelectVehicle,
    onUnselectVehicle,
    onHoverVehicle,
    onUnhoverVehicle,
    onFilterChange,
  };
}

function useVehicleChanges(): [VehicleDTO[], (vehicles: VehicleDTO[]) => void] {
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const batchUpdatesRef = useRef(new Map<string, VehicleDTO>());
  const animationFrameRef = useRef<number>();
  const processingRef = useRef(false);

  useEffect(() => {
    const onVehicleUpdate = (vehicle: VehicleDTO) => {
      batchUpdatesRef.current.set(vehicle.id, vehicle);
    };

    const processUpdates = () => {
      if (batchUpdatesRef.current.size > 0 && !processingRef.current) {
        processingRef.current = true;

        setVehicles((prev) => {
          const updatedMap = new Map(prev.map((v) => [v.id, v]));

          // Apply all queued updates
          for (const [id, vehicle] of batchUpdatesRef.current.entries()) {
            updatedMap.set(id, vehicle);
          }

          batchUpdatesRef.current.clear();
          processingRef.current = false;

          return Array.from(updatedMap.values());
        });
      }

      animationFrameRef.current = requestAnimationFrame(processUpdates);
    };

    client.onVehicle(onVehicleUpdate);
    animationFrameRef.current = requestAnimationFrame(processUpdates);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const setVehiclesArr = useCallback((vehicles: VehicleDTO[]) => {
    setVehicles(vehicles);
  }, []);

  return [vehicles, setVehiclesArr];
}

interface UseVehicle extends FiltersActions {
  vehicles: Vehicle[];
  filters: Filters;
  modifiers: Modifiers;
  setVehicles: (vehicles: VehicleDTO[]) => void;
  setModifiers: React.Dispatch<React.SetStateAction<Modifiers>>;
}

export function useVehicles(): UseVehicle {
  const [vehicles, setVehicles] = useVehicleChanges();
  const { filters, ...actions } = useFilters();
  const [modifiers, setModifiers] = useState<Modifiers>({
    showDirections: true,
    showHeatzones: false,
    showHeatmap: false,
    showVehicles: true,
    showPOIs: false,
  });

  const mappedVehicles = vehicles.map((vehicle) => ({
    ...vehicle,
    position: [vehicle.position[1], vehicle.position[0]] as Position,
    visible:
      (filters.visible.length === 0 || filters.visible.includes(vehicle.id)) &&
      vehicle.name.toLowerCase().includes(filters.filter.toLowerCase()),
    selected: filters.selected === vehicle.id,
    hovered: filters.hovered === vehicle.id,
  }));

  return {
    vehicles: mappedVehicles,
    filters,
    setVehicles,
    ...actions,
    modifiers,
    setModifiers,
  };
}
