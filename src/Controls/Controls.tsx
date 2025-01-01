import React, { useEffect } from "react";
import client from "@/utils/client";
import { Modifiers, Position, StartOptions, Vehicle } from "@/types";
import styles from "./Controls.module.css";
import Vehicles from "./Vehicles";
import { Directions, HeatZone } from "@/components/Icons";
import { Filters } from "@/useVehicles";
import { useRoads } from "@/hooks/useRoads";
import { useOptions } from "@/hooks/useOptions";
import { Input, Switch, Range, Typeahead } from "@/components/Inputs";
import { eValue } from "@/utils/form";
import { invertLatLng } from "@/utils/utils";
import Test from "./Test";
import { mod } from "node_modules/@deck.gl/core/dist/utils/math-utils";
import { useMapControls } from "@/components/Map/controls";
import useTracking from "./useTracking";

function Item({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.item}>
      <span className={styles.itemLabel}>{label}</span>
      <span className={styles.itemValue}>{children}</span>
    </div>
  );
}

function StartStopButton({
  running,
  onClick,
}: {
  running: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.playPauseButton} ${
        running ? styles.stop : styles.start
      }`}
    >
      {running ? (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ) : (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}

interface SquaredButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}
function SquaredButton({ icon, ...props }: SquaredButtonProps) {
  return (
    <button type="button" {...props} className={styles.squaredButton}>
      <div className={styles.squaredButtonIcon}>{icon}</div>
    </button>
  );
}
interface ControlPanelProps {
  running: boolean;
  vehicles: Vehicle[];
  interval: number;
  connected: boolean;
  modifiers: Modifiers;
  destination?: Position;
  onChangeModifiers: <T extends keyof Modifiers>(
    name: T
  ) => (value: Modifiers[T]) => void;
  filters: Filters;
  onSelectVehicle: (id: string) => void;
  onHoverVehicle: (id: string) => void;
  onUnhoverVehicle: () => void;
  onFilterChange: (value: string) => void;
  onDestinationClick: () => void;
  onRoadSelect: (position: Position) => void;
}

export default function ControlPanel({
  running,
  vehicles,
  interval,
  connected,
  modifiers,
  destination,
  filters,
  onChangeModifiers,
  onFilterChange,
  onSelectVehicle,
  onHoverVehicle,
  onUnhoverVehicle,
  onDestinationClick,
  onRoadSelect,
}: ControlPanelProps) {
  const { options, updateOption } = useOptions(300);
  const { roads } = useRoads();

  useTracking(vehicles, filters.selected, interval);

  const handleChange =
    (field: keyof StartOptions) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target.checked as unknown as StartOptions[keyof StartOptions])
          : Number(e.target.value);
      updateOption(field, value);
    };
  const handleStart = () => {
    client.start(options);
  };

  return (
    <section className={styles.controlPanel}>
      <div className={styles.status}>
        <Item label="Connected:">{connected ? "Yes" : "No"}</Item>
        <Item label="Running:">{running ? "Yes" : "No"}</Item>
        <Item label="Vehicles:">{vehicles.length}</Item>
        <Item label="Update Interval:">{interval / 1000} sec</Item>
        <Item label="Show Network:">
          <Switch
            type="checkbox"
            checked={modifiers.showRoutes}
            onChange={eValue(onChangeModifiers("showRoutes"))}
          />
        </Item>
        <Item label="Show Heatmap:">
          <Switch
            type="checkbox"
            checked={modifiers.showHeatmap}
            onChange={eValue(onChangeModifiers("showHeatmap"))}
          />
        </Item>
        <Item label="Show Heatzones:">
          <Switch
            type="checkbox"
            checked={modifiers.showHeatzones}
            onChange={eValue(onChangeModifiers("showHeatzones"))}
          />
        </Item>
        <Item label="Update Server:">
          <Switch
            type="checkbox"
            checked={options.updateServer}
            onChange={handleChange("updateServer")}
          />
        </Item>
      </div>
      <div className={styles.vehicles}>
        <Vehicles
          filter={filters.filter}
          onFilterChange={onFilterChange}
          vehicles={Array.from(vehicles.values())}
          onSelectVehicle={onSelectVehicle}
          onHoverVehicle={onHoverVehicle}
          onUnhoverVehicle={onUnhoverVehicle}
          maxSpeed={options.maxSpeed}
        />
      </div>

      <div className={styles.options}>
        <Input
          min={0}
          max={0.5}
          step={0.1}
          label="Heat Zone Speed Factor:"
          value={options.heatZoneSpeedFactor}
          onChange={handleChange("heatZoneSpeedFactor")}
        />
        <Input
          min={1000}
          max={30000}
          step={1000}
          label="Update Server Timeout (ms):"
          value={options.updateServerTimeout}
          onChange={handleChange("updateServerTimeout")}
        />
        <Input
          min={10}
          max={5000}
          step={10}
          label="Update Interval (ms):"
          value={options.updateInterval}
          onChange={handleChange("updateInterval")}
        />
        <Input
          min={1}
          label="Minimum Speed:"
          value={options.minSpeed}
          onChange={handleChange("minSpeed")}
        />
        <Input
          label="Maximum Speed:"
          value={options.maxSpeed}
          onChange={handleChange("maxSpeed")}
        />
        <Range
          min={1}
          max={10}
          label="Acceleration:"
          value={options.acceleration}
          onChange={handleChange("acceleration")}
        />
        <Range
          min={1}
          max={10}
          label="Deceleration:"
          value={options.deceleration}
          onChange={handleChange("deceleration")}
        />
        <Range
          min={0}
          max={360}
          label="Turn Threshold (degrees):"
          value={options.turnThreshold}
          onChange={handleChange("turnThreshold")}
        />
        <Range
          min={0}
          max={1}
          step={0.1}
          label="Speed Variation:"
          value={options.speedVariation}
          onChange={handleChange("speedVariation")}
        />
      </div>
      <div className={styles.buttons}>
        <Typeahead
          options={roads}
          onChange={(road) => onRoadSelect(invertLatLng(road.coordinates[0] as Position))}
          renderOption={(item) => item.name}
          placeholder="Search a road"
        />
        <SquaredButton onClick={client.makeHeatzones} icon={<HeatZone />} />
        <SquaredButton
          onClick={onDestinationClick}
          icon={<Directions />}
          disabled={!destination}
        />
      </div>
      <div className={styles.mainButton}>
        <StartStopButton
          running={running}
          onClick={running ? client.stop : handleStart}
        />
      </div>
      <Test />
    </section>
  );
}
