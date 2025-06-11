import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link } from "expo-router";
import { FilterOptions, useToiletFilters } from "@/hooks/useToiletFilters";

interface FilterViewProps {
  onBack: () => void;
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
}

export function FilterView({
  onBack,
  onFilterChange,
  initialFilters,
}: FilterViewProps) {
  const {
    filterOptions,
    toggleToiletType,
    toggleGenderDesignation,
    toggleAdvancedOption,
  } = useToiletFilters(initialFilters);

  // Add state to track which section is expanded
  const [expandedSections, setExpandedSections] = useState({
    toiletType: true,
    genderDesignation: true,
    advancedOptions: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    onFilterChange(filterOptions);
  }, [filterOptions, onFilterChange]);

  return (
    <View className="px-6">
      <TouchableOpacity onPress={onBack} className="flex-row items-center mb-2">
        <IconSymbol name="close" size={30} color="#3b82f6" />
      </TouchableOpacity>

      {/* Toilet Type Section */}
      <TouchableOpacity
        onPress={() => toggleSection("toiletType")}
        className="flex-row items-center justify-between mb-2"
      >
        <Text className="text-lg font-semibold">Choose toilet type</Text>
        <IconSymbol
          name={expandedSections.toiletType ? "chevron.up" : "chevron.down"}
          size={20}
          color="#37f"
        />
      </TouchableOpacity>

      {expandedSections.toiletType && (
        <View className="mt-3 w-full">
          {/* Existing toilet type options */}
          <TouchableOpacity
            onPress={() => toggleToiletType("public")}
            className={`flex-row items-center justify-between ${
              filterOptions.types.public
                ? "bg-indigo-100 border border-indigo-800"
                : "bg-gray-100 border border-indigo-800/0"
            } p-4 rounded-lg mb-3`}
          >
            <IconSymbol name="globe.desk.fill" size={24} color="#059669" />
            <View className="flex-col w-56 items-start justify-center">
              <Text className="font-semibold">Public Toilet</Text>
              <Text className="text-sm text-gray-500">
                Managed by the city's government
              </Text>
            </View>
            <View className="flex-row items-center w-8">
              {filterOptions.types.public && (
                <IconSymbol name="checkmark" size={24} color="#37f" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleToiletType("private")}
            className={`flex-row items-center justify-between ${
              filterOptions.types.private
                ? "bg-indigo-100 border border-indigo-800"
                : "bg-gray-100 border border-indigo-800/0"
            } p-4 rounded-lg mb-2`}
          >
            <IconSymbol name="lock.fill" size={24} color="#db2777" />
            <View className="flex-col w-56 items-start justify-center">
              <Text className="font-semibold">Private Toilet</Text>
              <Text className="text-sm text-gray-500">
                Managed by private entities
              </Text>
            </View>
            <View className="flex-row items-center w-8">
              {filterOptions.types.private && (
                <IconSymbol name="checkmark" size={24} color="#37f" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Gender Designation Section */}
      <TouchableOpacity
        onPress={() => toggleSection("genderDesignation")}
        className="flex-row items-center justify-between mb-2 mt-4"
      >
        <Text className="text-lg font-semibold">Gender Designation</Text>
        <IconSymbol
          name={
            expandedSections.genderDesignation ? "chevron.up" : "chevron.down"
          }
          size={20}
          color="#37f"
        />
      </TouchableOpacity>

      {expandedSections.genderDesignation && (
        <View className="flex-row items-center justify-center mb-3 w-full">
          {/* Existing gender designation options */}
          <View className="w-1/2">
            <TouchableOpacity
              onPress={() => toggleGenderDesignation("unisex")}
              className={`ml-1 mr-2 py-3 ${
                filterOptions.genderDesignation.unisex
                  ? "bg-indigo-100 border border-indigo-800"
                  : "bg-gray-100 border border-indigo-800/0"
              } inline-flex items-center justify-center rounded-lg`}
            >
              <IconSymbol name="social.distance" size={24} color="#ca8a04" />
              <Text>Unisex</Text>
            </TouchableOpacity>
          </View>
          <View className="w-1/2">
            <TouchableOpacity
              onPress={() => toggleGenderDesignation("genderSeparated")}
              className={`mr-1 ml-2 py-3 ${
                filterOptions.genderDesignation.genderSeparated
                  ? "bg-indigo-100 border border-indigo-800"
                  : "bg-gray-100 border border-indigo-800/0"
              } inline-flex items-center justify-center rounded-lg`}
            >
              <IconSymbol name="gender.separated" size={24} color="#0284c7" />
              <Text>Gender-separated</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Advanced Options Section */}
      <TouchableOpacity
        onPress={() => toggleSection("advancedOptions")}
        className="flex-row items-center justify-between mb-2 mt-4"
      >
        <Text className="text-lg font-semibold">Advanced Options</Text>
        <IconSymbol
          name={
            expandedSections.advancedOptions ? "chevron.up" : "chevron.down"
          }
          size={20}
          color="#37f"
        />
      </TouchableOpacity>

      {expandedSections.advancedOptions && (
        <View className="mt-2">
          {/* Existing advanced options */}
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="font-medium">Accessibility</Text>
              <Text className="text-sm text-gray-500">
                Are they accessible for people with disabilities?
              </Text>
            </View>
            <Switch
              value={filterOptions.advancedOptions.accessibility}
              onValueChange={() => toggleAdvancedOption("accessibility")}
            />
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="font-medium">Free Service</Text>
              <Text className="text-sm text-gray-500">
                Is there a service fee for using this facility?
              </Text>
            </View>
            <Switch
              value={filterOptions.advancedOptions.serviceFee}
              onValueChange={() => toggleAdvancedOption("serviceFee")}
            />
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="font-medium">Water Laser</Text>
              <Text className="text-sm text-gray-500">Asian type bidet</Text>
            </View>
            <Switch
              value={filterOptions.advancedOptions.waterLaser}
              onValueChange={() => toggleAdvancedOption("waterLaser")}
            />
          </View>
        </View>
      )}

      <View className="px-6 mt-2 w-full text-center">
        <Link href="/contribute" className="text-center">
          <Text className="text-red-800">
            Learn more about how we provide this data.
          </Text>
        </Link>
      </View>
    </View>
  );
}
