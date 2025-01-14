import { Craft, Leisure, Office, Shop, Unknown } from "@/components/Icons";
import styles from "./POI.module.css";
import { Marker } from "@/components/Map/components/Marker";
import { POI } from "@/types";
import React from "react";
import HTMLMarker from "@/components/Map/components/HTMLMarker";

function getFillByType(type: string) {
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
}

function IconByType({ type }: { type: string }) {
  const svgProps = {
    className: styles.icon,
    width: "10px",
    height: "10px",
  };

  let icon = <Unknown />;
  if (type === "shop") {
    icon = <Shop />;
  } else if (type === "leisure") {
    icon = <Leisure />;
  } else if (type === "craft") {
    icon = <Craft />;
  } else if (type === "office") {
    icon = <Office />;
  }

  return React.cloneElement(icon, svgProps);
}

export default function POIMarker({ poi }: { poi: POI }) {
  return (
    <HTMLMarker key={poi.id} position={[poi.coordinates[1], poi.coordinates[0]]}>
      <div className={styles.poi} style={{ background: getFillByType(poi.type) }}>
        <IconByType type={poi.type} />
      </div>
    </HTMLMarker>
  );
}
