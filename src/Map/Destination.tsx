import { Marker } from "../components/Map/components/Marker";
import { Position } from "@/types";

interface DirectionPointsProps {
  destination: { position: Position; tmp: boolean };
}
export default function Destination({ destination }: DirectionPointsProps) {
  const { position, tmp } = destination;
  return (
    <Marker position={position} offset={[-25, -25]} animation={200}>
      <svg width="50" height="50" viewBox="0 0 50 50">
        <defs>
          <linearGradient id="destinationGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3930c3" />
            <stop offset="100%" stopColor="#64ffdf" />
          </linearGradient>
          <mask id="destinationMask">
            <rect width="50" height="50" fill="white" />
            <circle cx="25" cy="25" r="20" fill="black" />
          </mask>
        </defs>
        <circle
          cx="25"
          cy="25"
          r="25"
          fill={"url(#destinationGradient)"}
          mask="url(#destinationMask)"
        />
        {tmp && (
          <text
            x="25"
            y="25"
            textAnchor="middle"
            alignmentBaseline="middle"
            fill={"url(#destinationGradient)"}
            fontFamily="Arial"
            fontSize={8}
          >
            Loading
          </text>
        )}
      </svg>
    </Marker>
  );
}
