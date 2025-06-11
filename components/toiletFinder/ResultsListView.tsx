import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { SortOption } from "@/hooks/useToiletSorting";

interface ResultsListViewProps {
  onSelectToilet: (id: number) => void;
  onFilterPress: () => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  toilets: any[];
}

export function ResultsListView({
  onSelectToilet,
  onFilterPress,
  sortOption,
  onSortChange,
  toilets,
}: ResultsListViewProps) {
  const formatFeatureText = (feature: string) => {
    // Split by underscore or space
    const words = feature.split(/[_\s]+/);
    // Capitalize first letter of each word
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  return (
    <View className="px-6">
      {/* Filter and sort options */}
      <View className="flex flex-row justify-center items-center gap-2 mb-4">
        <TouchableOpacity
          onPress={onFilterPress}
          className="bg-gray-100 p-2 rounded-lg flex-row items-center gap-2 flex-1 justify-center"
        >
          <IconSymbol name="filter" size={16} color="#000" />
          <Text className="text-center">Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            onSortChange(sortOption === "nearest" ? "rating" : "nearest")
          }
          className="bg-gray-100 p-2 rounded-lg flex-row items-center gap-2 flex-1 justify-center"
        >
          <IconSymbol
            name={
              sortOption === "nearest"
                ? "two-sided.arrow.up.down"
                : "heart.fill"
            }
            size={16}
            color="#000"
          />
          <Text className="text-center">
            {sortOption === "nearest" ? "Nearest" : "Top Rated"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results count */}
      <Text className="text-gray-500 mb-3">
        {toilets.length} toilets found nearby
      </Text>

      {/* Toilet list */}
      <View className="scroll">
        {toilets.map((toilet) => (
          <TouchableOpacity
            key={toilet.id}
            onPress={() => onSelectToilet(toilet.id)}
            className="bg-gray-100 p-4 rounded-lg mb-3"
          >
            <View className=" flex-row items-center gap-2 w-full flex justify-between">
              <View className="flex-row items-center gap-4">
                <View className="w-56">
                  <View className="flex-row gap-1 items-center">
                    {/* Toilet type icon */}
                    <IconSymbol
                      name={
                        toilet.type === "PUBLIC"
                          ? "globe.desk.fill"
                          : "lock.fill"
                      }
                      size={16}
                      color={toilet.type === "PUBLIC" ? "#059669" : "#db2777"}
                    />

                    {/* Gender designation icon */}
                    <IconSymbol
                      name={
                        toilet.gender === "UNISEX"
                          ? "social.distance"
                          : "gender.separated"
                      }
                      size={16}
                      color={toilet.gender === "UNISEX" ? "#3b82f6" : "#9333ea"}
                    />

                    {/* Fee icon - fixed to use hasFee instead of fee */}
                    {toilet.hasFee && (
                      <IconSymbol
                        name="dollar.sign"
                        size={16}
                        color="#f59e0b"
                      />
                    )}

                    <Text className="font-medium">{toilet.name}</Text>
                  </View>
                  <Text className="text-sm text-gray-500">
                    {toilet.address}
                  </Text>
                </View>
              </View>

              <View className="flex-col items-end">
                <Text className="text-sm text-gray-500">
                  {toilet.distance} km
                </Text>
                <View className="flex-row items-center gap-1">
                  <IconSymbol name="heart.fill" size={16} color="#f00" />
                  <Text className="text-sm">{toilet.rating}</Text>
                </View>
              </View>
            </View>
            <View className="flex-row flex-wrap gap-1 mt-2">
              {toilet.features.map((feature) => (
                <Text
                  key={feature}
                  className="text-xs text-gray-500 bg-gray-200 rounded-full px-2"
                >
                  {formatFeatureText(feature)}
                </Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
