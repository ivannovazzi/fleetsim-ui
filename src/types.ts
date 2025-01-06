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
  showDirections: boolean;
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
  useAdapter: boolean;
  syncAdapter: boolean;
  syncAdapterTimeout: number;
}

interface RoadFeature {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: Position[];
  };
  properties: {
    name?: string;
    type?: string;
    speed_limit?: number;
    highway?: string;
  };
}

export interface RoadNetwork {
  type: "FeatureCollection";
  features: RoadFeature[];
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

export interface VehicleDirection {
  vehicleId: string;
  route: Route;
  eta: number;
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
