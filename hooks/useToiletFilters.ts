import { useState, useEffect } from "react";
import { ToiletType, GenderType, Feature, Toilet } from "../models/toilet";

export interface FilterOptions {
  types: {
    public: boolean;
    private: boolean;
  };
  genderDesignation: {
    unisex: boolean;
    genderSeparated: boolean;
  };
  advancedOptions: {
    accessibility: boolean;
    serviceFee: boolean;
    waterLaser: boolean;
  };
}

export function useToiletFilters(initialFilters?: FilterOptions) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(
    initialFilters || {
      types: {
        public: true,
        private: true,
      },
      genderDesignation: {
        unisex: true,
        genderSeparated: true,
      },
      advancedOptions: {
        accessibility: true,
        serviceFee: false,
        waterLaser: false,
      },
    }
  );

  const toggleToiletType = (type: "public" | "private") => {
    setFilterOptions({
      ...filterOptions,
      types: {
        ...filterOptions.types,
        [type]: !filterOptions.types[type],
      },
    });
  };

  const toggleGenderDesignation = (type: "unisex" | "genderSeparated") => {
    setFilterOptions({
      ...filterOptions,
      genderDesignation: {
        ...filterOptions.genderDesignation,
        [type]: !filterOptions.genderDesignation[type],
      },
    });
  };

  const toggleAdvancedOption = (
    option: "accessibility" | "serviceFee" | "waterLaser"
  ) => {
    setFilterOptions({
      ...filterOptions,
      advancedOptions: {
        ...filterOptions.advancedOptions,
        [option]: !filterOptions.advancedOptions[option],
      },
    });
  };

  const applyFilters = (toilets: Toilet[]) => {
    // Check if any advanced options are selected
    const anyAdvancedOptionSelected = Object.values(
      filterOptions.advancedOptions
    ).some((value) => value);

    return toilets.filter((toilet) => {
      // Basic filters - always apply
      const typeMatch =
        (filterOptions.types.public && toilet.type === ToiletType.PUBLIC) ||
        (filterOptions.types.private && toilet.type === ToiletType.PRIVATE);

      const genderMatch =
        (filterOptions.genderDesignation.unisex &&
          toilet.gender === GenderType.UNISEX) ||
        (filterOptions.genderDesignation.genderSeparated &&
          toilet.gender === GenderType.GENDER_SEPARATED);

      // Only apply advanced filters if at least one is selected
      if (!anyAdvancedOptionSelected) {
        return typeMatch && genderMatch;
      }

      // Apply advanced filters
      const accessibilityMatch =
        !filterOptions.advancedOptions.accessibility ||
        toilet.features.includes(Feature.ACCESSIBLE);

      const serviceFeeMatch =
        !filterOptions.advancedOptions.serviceFee || !toilet.hasFee;

      const waterLaserMatch =
        !filterOptions.advancedOptions.waterLaser || toilet.waterLaser;

      return (
        typeMatch &&
        genderMatch &&
        accessibilityMatch &&
        serviceFeeMatch &&
        waterLaserMatch
      );
    });
  };

  return {
    filterOptions,
    setFilterOptions,
    toggleToiletType,
    toggleGenderDesignation,
    toggleAdvancedOption,
    applyFilters,
  };
}
