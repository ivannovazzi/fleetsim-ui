import React from "react";
import { Road, Route, Heatzone, StartOptions, RoadNetwork } from "@/types";

export type RouteMap = Map<string, Route>;

interface ClientData {
  options: StartOptions;
  roads: Road[];
  routes: RouteMap;
  heatzones: Heatzone[];
  network: RoadNetwork;
  setOptions: React.Dispatch<React.SetStateAction<StartOptions>>;
  setRoads: React.Dispatch<React.SetStateAction<Road[]>>;
  setRoutes: React.Dispatch<React.SetStateAction<RouteMap>>;
  setHeatzones: React.Dispatch<React.SetStateAction<Heatzone[]>>;
  setNetwork: React.Dispatch<React.SetStateAction<RoadNetwork>>;
}

export const ClientDataContext = React.createContext<ClientData>({
  options: {
    minSpeed: 10,
    maxSpeed: 50,
    acceleration: 5,
    deceleration: 7,
    turnThreshold: 30,
    updateInterval: 10000,
    updateServer: false,
    updateServerTimeout: 10000,
    speedVariation: 0.1,
    heatZoneSpeedFactor: 0.5,
  },
  roads: [],
  routes: new Map(),
  heatzones: [],
  network: {
    type: "FeatureCollection",
    features: [],
  },
  setOptions: () => {},
  setRoads: () => {},
  setRoutes: () => {},
  setHeatzones: () => {},
  setNetwork: () => {},
});
