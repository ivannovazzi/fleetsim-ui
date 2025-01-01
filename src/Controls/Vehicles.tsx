import classNames from "classnames";
import { Vehicle } from "@/types";
import styles from "./Vehicles.module.css";
import { EngineIssues, HeatZone, LowFuel, LowBattery } from "@/components/Icons";
import { eValue } from "@/utils/form";
import { Input } from "@/components/Inputs";

function Heading({ heading }: { heading: number }) {
  return (
    <svg
      className={styles.heading}
      style={{ transform: `rotate(${heading}deg)` }}
      width="16"
      height="16"
      viewBox="0 0 20 20"
    >
      <path d="M 4 16 L 10 3 L 16 16 L 10 12 Z" fill="currentColor" />
    </svg>
  );
}

function SpeedBar({ speed, maxSpeed }: { speed: number; maxSpeed: number }) {
  return (
    <div
      className={styles.speedBar}
      style={{
        width: `${(speed / maxSpeed) * 100}%`,
      }}
    />
  );
}

const commonIconProps = {
  height: 13,
  width: 13,
  fillOpacity: 0.4,
};

interface VehicleListProps {
  filter: string;
  vehicles: Vehicle[];
  maxSpeed: number;
  onFilterChange: (value: string) => void;
  onSelectVehicle: (id: string) => void;
  onHoverVehicle: (id: string) => void;
  onUnhoverVehicle: () => void;
}

export default function VehicleList({
  filter,
  vehicles,
  maxSpeed,
  onFilterChange,
  onSelectVehicle,
  onHoverVehicle,
  onUnhoverVehicle,
}: VehicleListProps) {
  return (
    <>
    <div className={styles.filter}>
      <Input
        type="text"
        value={filter}
        onChange={eValue(onFilterChange)}
        placeholder="Filter Vehicles:"
      />
      </div>
      <div className={styles.vehicles}>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={classNames(styles.vehicle, {
              [styles.hidden]: !vehicle.visible,
              [styles.selected]: vehicle.selected,
            })}
            onClick={() => onSelectVehicle(vehicle.id)}
            onMouseEnter={() => onHoverVehicle(vehicle.id)}
            onMouseLeave={() => onUnhoverVehicle()}
          >
            <div className={styles.speed}>
              <SpeedBar speed={vehicle.speed} maxSpeed={maxSpeed} />
            </div>
            <div className={styles.content}>
              <div
                className={classNames(
                  styles.status,
                  styles[vehicle.status.toLowerCase()]
                )}
              />
              <div className={styles.name}>{vehicle.name}</div>
              <div className={styles.flags}>
                {vehicle.flags.hasEngineIssue && (
                  <EngineIssues {...commonIconProps} fill="#cc9933" />
                )}
                {vehicle.flags.lowFuel && (
                  <LowFuel {...commonIconProps} fill="#33cc66" />
                )}
                {vehicle.flags.hasInternetConnectivity && (
                  <LowBattery {...commonIconProps} fill="#cc3333cc" />
                )}
                {vehicle.flags.isInHeatZone && (
                  <HeatZone {...commonIconProps} fill="#cc33ccff"/>
                )}
              </div>
              <div className={styles.headingContainer}>
                <Heading heading={vehicle.heading} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
