import React from "react";
import { Road, Route, Heatzone, StartOptions, RoadNetwork } from "./types";

type RouteMap = Map<string, Route>;

interface ClientData {
  options: StartOptions;
  roads: Road[];
  routes: Map<string, Route>;
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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = React.useState<StartOptions>({
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
  });
  const [roads, setRoads] = React.useState<Road[]>([]);
  const [routes, setRoutes] = React.useState<RouteMap>(new Map());
  const [heatzones, setHeatzones] = React.useState<Heatzone[]>([]);
  const [network, setNetwork] = React.useState<RoadNetwork>({
    type: "FeatureCollection",
    features: [],
  });

  return (
    <ClientDataContext.Provider
      value={{
        options,
        roads,
        routes,
        heatzones,
        network,
        setOptions,
        setRoads,
        setRoutes,
        setHeatzones,
        setNetwork,
      }}
    >
      {children}
    </ClientDataContext.Provider>
  );
}
