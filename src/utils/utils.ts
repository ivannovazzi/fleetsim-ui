import { Position } from "geojson";

export const calculateRotation = (current: number, target: number) => {
  const normalizedCurrent = ((current % 360) + 360) % 360;
  const normalizedTarget = ((target % 360) + 360) % 360;
  
  const clockwise = normalizedTarget - normalizedCurrent;
  const counterClockwise = normalizedTarget - normalizedCurrent - 360;
  
  if (Math.abs(clockwise) > Math.abs(counterClockwise)) {
    return counterClockwise;
  }
  return clockwise;
};


export function invertLatLng([lat, lng]: Position): Position {
  return [lng, lat];
}