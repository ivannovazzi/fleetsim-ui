
import { POI, Road } from "@/types";
import { Directions } from "@/components/Icons";
import { useRoads } from "@/hooks/useRoads";
import { usePois } from "@/hooks/usePois";
import { SquaredButton, Typeahead } from "@/components/Inputs";
import styles from "./SearchBar.module.css";

interface SearchBarProps {  
  selectedItem: Road | POI | null;
  onDestinationClick: () => void;
  onItemSelect: (item: Road | POI) => void;
}

export default function SearchBar({
  selectedItem,
  onDestinationClick,
  onItemSelect,
}: SearchBarProps) {
  const { roads } = useRoads();
  const { pois } = usePois();

  return (
    <div className={styles.searchBar}>
      <Typeahead
        className={styles.typeahead}
        options={[...roads, ...pois].flat()}
        value={selectedItem}
        onChange={(item) => onItemSelect(item!)}
        onOptionHover={(item) => onItemSelect(item!)}
        renderLabel={(item) => item!.name || "not sure"}
        renderOption={(item) => item!.name}
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