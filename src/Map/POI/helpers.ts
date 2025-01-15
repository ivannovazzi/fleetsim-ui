import { POI } from "@/types";

export function isBusStop(poi: POI) {
  return poi.type === "bus_stop";
}

export function isNotBusStop(poi: POI) {
  return !isBusStop(poi);
}

export function getFillByType(type: string): string {
  if (type === "shop") {
    return "#993300";
  }
  if (type === "leisure") {
    return "#339900";
  }
  if (type === "craft") {
    return "#333399";
  }
  if (type === "office") {
    return "#cc6633";
  }
  if (type === "bus_stop") {
    return "#999";
  }
  return "#666";
}