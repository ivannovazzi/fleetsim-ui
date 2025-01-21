import React from "react";
import client from "@/utils/client";
import { Modifiers, SimulationStatus, StartOptions, Vehicle } from "@/types";
import styles from "./Controls.module.css";
import Vehicles from "./Vehicles";
import { HeatZone, Hourglass, Pause, Play, Reset } from "@/components/Icons";
import { Filters } from "@/hooks/useVehicles";
import { useOptions } from "@/hooks/useOptions";
import { Input, Switch, Range, SquaredButton } from "@/components/Inputs";
import { eValue } from "@/utils/form";
import useTracking from "./useTracking";
import classNames from "classnames";

interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
function Block({ children, ...props }: BlockProps) {
  return (
    <div {...props} className={classNames([props.className, styles.block])}>
      {children}
    </div>
  );
}

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

function MainControls({
  running,
  onPlayPause,
  onReset,
  onZones,
}: {
  running: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onZones: () => void;
}) {
  return (
    <div>
      <SquaredButton
        onClick={onReset}
        icon={<Reset />}
        className={styles.mainButton}
      />
      <SquaredButton
        onClick={onZones}
        icon={<Hourglass />}
        className={styles.mainButton}
      />
      <SquaredButton
        onClick={onPlayPause}
        className={styles.mainButton}
        icon={running ? <Pause /> : <Play />}
      />
    </div>
  );
}

interface ControlPanelProps {
  vehicles: Vehicle[];
  status: SimulationStatus;
  connected: boolean;
  modifiers: Modifiers;
  onChangeModifiers: <T extends keyof Modifiers>(
    name: T
  ) => (value: Modifiers[T]) => void;
  filters: Filters;
  onSelectVehicle: (id: string) => void;
  onHoverVehicle: (id: string) => void;
  onUnhoverVehicle: () => void;
  onFilterChange: (value: string) => void;
  onAdapterChange: (value: boolean) => void;
}

export default function ControlPanel({
  vehicles,
  status,
  connected,
  modifiers,
  filters,
  onChangeModifiers,
  onFilterChange,
  onSelectVehicle,
  onHoverVehicle,
  onUnhoverVehicle,
  onAdapterChange,
}: ControlPanelProps) {
  const { options, updateOption } = useOptions(300);

  useTracking(vehicles, filters.selected, status.interval);

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
      <Block className={styles.status}>
        <div>
          <Item label="Connected">{connected ? "Yes" : "No"}</Item>
          <Item label="Running">{status.running ? "Yes" : "No"}</Item>
          <Item label="Vehicles">{vehicles.length}</Item>
          <Item label="Adapter">{status.adapterTimeout / 1000} sec</Item>
        </div>
        <div className={styles.danger}>
          <Item label="Use Adapter">
            <Switch
              disabled={!options.editAdapter}
              type="checkbox"
              checked={options.useAdapter}
              onChange={(e) => onAdapterChange(e.target.checked)}
            />
          </Item>
          <Item label="Update Server">
            <Switch
              disabled={!options.editAdapter}
              type="checkbox"
              checked={options.syncAdapter}
              onChange={handleChange("syncAdapter")}
            />
          </Item>
        </div>
      </Block>
      <Block className={styles.toggles}>
        <Item label="Show Network">
          <Switch
            type="checkbox"
            checked={modifiers.showDirections}
            onChange={eValue(onChangeModifiers("showDirections"))}
          />
        </Item>
        <Item label="Show Vehicles">
          <Switch
            type="checkbox"
            checked={modifiers.showVehicles}
            onChange={eValue(onChangeModifiers("showVehicles"))}
          />
        </Item>
        <Item label="Show Heatmap">
          <Switch
            type="checkbox"
            checked={modifiers.showHeatmap}
            onChange={eValue(onChangeModifiers("showHeatmap"))}
          />
        </Item>
        <Item label="Show Heatzones">
          <Switch
            type="checkbox"
            checked={modifiers.showHeatzones}
            onChange={eValue(onChangeModifiers("showHeatzones"))}
          />
        </Item>
        <Item label="Show POIs">
          <Switch
            type="checkbox"
            checked={modifiers.showPOIs}
            onChange={eValue(onChangeModifiers("showPOIs"))}
          />
        </Item>
      </Block>
      <Block className={styles.vehicles}>
        <Vehicles
          filter={filters.filter}
          onFilterChange={onFilterChange}
          vehicles={Array.from(vehicles.values())}
          onSelectVehicle={onSelectVehicle}
          onHoverVehicle={onHoverVehicle}
          onUnhoverVehicle={onUnhoverVehicle}
          maxSpeed={options.maxSpeed}
        />
      </Block>

      <Block className={styles.options}>
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
          value={options.syncAdapterTimeout}
          onChange={handleChange("syncAdapterTimeout")}
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
      </Block>
      <Block className={styles.mainControls}>
        <MainControls
          running={status.running}
          onPlayPause={status.running ? client.stop : handleStart}
          onReset={client.reset}
          onZones={client.makeHeatzones}
        />
      </Block>
    </section>
  );
}
