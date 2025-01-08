import React from "react";
import { Road, Heatzone, StartOptions, RoadNetwork } from "../types";
import { ClientDataContext, DirectionMap } from "./context";

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = React.useState<StartOptions>({
    minSpeed: 10,
    maxSpeed: 50,
    acceleration: 5,
    deceleration: 7,
    turnThreshold: 30,
    updateInterval: 10000,
    editAdapter: false,
    useAdapter: false,
    syncAdapter: false,
    syncAdapterTimeout: 10000,
    speedVariation: 0.1,
    heatZoneSpeedFactor: 0.5,
  });
  const [roads, setRoads] = React.useState<Road[]>([]);
  const [directions, setDirections] = React.useState<DirectionMap>(new Map());
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
        directions,
        heatzones,
        network,
        setOptions,
        setRoads,
        setDirections,
        setHeatzones,
        setNetwork,
      }}
    >
      {children}
    </ClientDataContext.Provider>
  );
}
