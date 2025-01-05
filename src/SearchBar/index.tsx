
import { Road } from "@/types";
import { Directions } from "@/components/Icons";
import { useRoads } from "@/hooks/useRoads";
import { SquaredButton, Typeahead } from "@/components/Inputs";
import styles from "./SearchBar.module.css";

interface SearchBarProps {  
  hasDirections?: boolean;
  onDestinationClick: () => void;
  onRoadSelect: (road: Road) => void;
}

export default function SearchBar({
  hasDirections,
  onDestinationClick,
  onRoadSelect,
}: SearchBarProps) {
  const { roads } = useRoads();  
  
  return (
    <div className={styles.searchBar}>
      <Typeahead
        className={styles.typeahead}
        options={roads}
        onChange={(road) => onRoadSelect(road)}
        onOptionHover={(road) => onRoadSelect(road!)}
        renderOption={(item) => item.name}
        placeholder="Search a road"
      />
      
      <SquaredButton
        onClick={onDestinationClick}
        icon={<Directions />}
        disabled={!hasDirections}
        className={styles.destinationButton}
      />

    </div>
  );
}