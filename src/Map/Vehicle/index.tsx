import styles from "./Vehicle.module.css";
import classNames from "classnames";
import React, {  memo, useEffect } from "react";
import { Position, Vehicle } from "@/types";
import { calculateRotation } from "@/utils/utils";
import { Marker } from "../../components/Marker";

interface VehicleProps extends Vehicle {
  position: Position;
  animFreq: number;
  scale: number;
  onClick: () => void;
}

function VehicleMarker({
  position,
  status,
  selected,
  hovered,
  heading,
  animFreq,
  scale,
  onClick,
}: VehicleProps) {
  const [prevHeading, setPrevHeading] = React.useState(heading);
  useEffect(() => {
    setPrevHeading(heading);
  }, [heading]);
  
  const rotation = calculateRotation(prevHeading, heading);
  
  const className = classNames(styles.vehicle, {
    [styles.selected]: selected,
    [styles.hovered]: hovered,
    [styles[status.toLowerCase()]]: true,
  });  

  const bearingStyle = {
    transform: `rotate(${prevHeading + rotation}deg) scale(${scale})`,
    transition: `transform ${animFreq}ms linear`,
  };
  return (
    <Marker
      position={position}
      onClick={onClick}
      onHover={console.log}
    >
      <rect
        x="-1"
        y="-2"
        width="2"
        height="4"
        rx="1"
        ry="1"
        className={className}
        style={bearingStyle}
      />
    </Marker>
  );
}

export default memo(VehicleMarker);
