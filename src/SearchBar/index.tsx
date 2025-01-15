import { POI, Road } from "@/types";
import { Directions, POI as POIIcon, Road as RoadIcon } from "@/components/Icons";
import { useRoads } from "@/hooks/useRoads";
import { usePois } from "@/hooks/usePois";
import { SquaredButton, Typeahead } from "@/components/Inputs";
import styles from "./SearchBar.module.css";
import { isRoad } from "@/utils/general";

function Option({ item }: { item: Road | POI }) {
  const icon = isRoad(item) ? <RoadIcon /> : <POIIcon />;
  return (
    <div className={styles.option}>
      {icon}
      <span>{item.name}</span>
    </div>
  );
}

interface SearchBarProps {
  selectedItem: Road | POI | null;
  onDestinationClick: () => void;
  onItemSelect: (item: Road | POI) => void;
  onItemUnselect: () => void;
}

export default function SearchBar({
  selectedItem,
  onDestinationClick,
  onItemSelect,
  onItemUnselect,
}: SearchBarProps) {
  const { roads } = useRoads();
  const { pois } = usePois();

  const items = [...roads, ...pois];

  return (
    <div className={styles.searchBar}>
      <Typeahead
        className={styles.typeahead}
        options={items}
        value={selectedItem}
        onChange={onItemSelect}
        // onOptionHover={onItemSelect}
        // onOptionLeave={onItemUnselect}
        renderLabel={(item) => item!.name || "not sure"}
        renderOption={(item) => <Option item={item} />}
        placeholder="Search..."
      />

      <SquaredButton
        onClick={onDestinationClick}
        icon={<Directions />}
        disabled={!selectedItem}
        className={styles.destinationButton}
      />
    </div>
  );
}
