export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export type Position = [number, number];

export type LatLng = {
  lat: number;
  lng: number;
};

export interface Modifiers {
  showRoutes: boolean;
  showHeatzones: boolean;
  showHeatmap: boolean;
  showVehicles: boolean;
}

export enum VehicleStatus {
  ONSHIFT = "ONSHIFT",
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  UNTRACKED = "UNTRACKED",
  UNKNOWN = "UNKNOWN",
}

export interface VehicleFlags {
  hasInternetConnectivity: boolean;
  hasEngineIssue: boolean;
  lowFuel: boolean;
  isInHeatZone: boolean;
}
export interface VehicleDTO {
  id: string;
  name: string;
  status: VehicleStatus;
  position: Position;
  speed: number;
  heading: number;
  flags: VehicleFlags;
}

interface VehicleUIFlags {
  visible: boolean;
  selected: boolean;
  hovered: boolean;
}

export type Vehicle = VehicleDTO & VehicleUIFlags;

export interface SimulationStatus {
  interval: number;
  running: boolean;
  vehicles: VehicleDTO[];
}

export interface StartOptions {
  minSpeed: number;
  maxSpeed: number;
  speedVariation: number;
  acceleration: number;
  deceleration: number;
  turnThreshold: number;
  updateInterval: number;
  heatZoneSpeedFactor: number;
  updateServer: boolean;
  updateServerTimeout: number;
}

export interface Route {
  edges: Edge[];
  distance: number;
}

export interface Node {
  id: string;
  coordinates: Position;
  connections: Edge[];
}

export interface Edge {
  id: string;
  streetId: string;
  start: Node;
  end: Node;
  distance: number;
  bearing: number;
}

export interface VehicleRoute {
  vehicleId: string;
  route: Route;
}

export interface Road {
  name: string;
  nodeIds: Set<string>;
  streets: Position[][];
}

export interface Heatzone {
  type: "Feature";
  properties: {
    id: string;
    intensity: number;
    timestamp: string;
    radius: number;
  };
  geometry: {
    type: "Polygon";
    coordinates: Position[];
  };
};
