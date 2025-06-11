import { useState } from "react";

export type SortOption = "nearest" | "rating";

export function useToiletSorting(initialOption: SortOption = "nearest") {
  const [sortOption, setSortOption] = useState<SortOption>(initialOption);

  // Sort toilets by distance
  const sortToiletsByDistance = (toiletsToSort: any[]) => {
    return [...toiletsToSort].sort((a, b) => a.distance - b.distance);
  };

  // Sort toilets by rating
  const sortToiletsByRating = (toiletsToSort: any[]) => {
    return [...toiletsToSort].sort((a, b) => b.rating - a.rating);
  };

  // Handle sort option change
  const handleSortChange = (option: SortOption, toilets: any[]) => {
    setSortOption(option);
    if (option === "nearest") {
      return sortToiletsByDistance(toilets);
    } else {
      return sortToiletsByRating(toilets);
    }
  };

  return {
    sortOption,
    setSortOption,
    sortToiletsByDistance,
    sortToiletsByRating,
    handleSortChange,
  };
}
