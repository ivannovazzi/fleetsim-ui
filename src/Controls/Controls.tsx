import React from "react";
import client from "@/utils/client";
import { Modifiers, StartOptions, Vehicle } from "@/types";
import styles from "./Controls.module.css";
import Vehicles from "./Vehicles";
import { HeatZone, ZoomIn, ZoomOut } from "@/components/Icons";
import { Filters } from "@/useVehicles";
import { useOptions } from "@/hooks/useOptions";
import { Input, Switch, Range, SquaredButton, Button } from "@/components/Inputs";
import { eValue } from "@/utils/form";
import useTracking from "./useTracking";
import { useMapControls } from "@/components/Map/hooks";
import classNames from "classnames";

interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
children: React.ReactNode;
}
function Block({
children,
...props
}: BlockProps) {
return (
  <div  {...props} className={classNames([props.className, styles.block])}>
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

interface ControlPanelProps {
running: boolean;
vehicles: Vehicle[];
interval: number;
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
}

export default function ControlPanel({
running,
vehicles,
interval,
connected,
modifiers,
filters,
onChangeModifiers,
onFilterChange,
onSelectVehicle,
onHoverVehicle,
onUnhoverVehicle,
}: ControlPanelProps) {
const { zoomIn, zoomOut } = useMapControls();  
const { options, updateOption } = useOptions(300);

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
    <Block className={styles.status}>
      <Item label="Connected">{connected ? "Yes" : "No"}</Item>
      <Item label="Running">{running ? "Yes" : "No"}</Item>
      <Item label="Vehicles">{vehicles.length}</Item>
      <Item label="Adapter">{interval / 1000} sec</Item>      
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
      <Item label="Use Adapter">
        <Switch
          type="checkbox"
          checked={options.useAdapter}
          onChange={handleChange("useAdapter")}
        />
      </Item>
      <Item label="Update Server">
        <Switch
          type="checkbox"
          checked={options.syncAdapter}
          onChange={handleChange("syncAdapter")}
        />
      </Item>
      <div className={styles.resetButton}>      
      <Button onClick={client.reset}>Reset</Button>
      </div>
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
    <Block className={styles.buttons}>
      <SquaredButton onClick={client.makeHeatzones} icon={<HeatZone />} />        
      <SquaredButton onClick={zoomIn} icon={<ZoomIn />} />
      <SquaredButton onClick={zoomOut} icon={<ZoomOut />} />
    </Block>
    <Block className={styles.mainButton}>
      <StartStopButton
        running={running}
        onClick={running ? client.stop : handleStart}
      />
    </Block>
  </section>
);
}
