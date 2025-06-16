import { IconSymbol } from "@/components/ui/IconSymbol";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ActionButtonsProps {
  isSaved: boolean;
  onShowPosition: () => void;
  onSaveToilet: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSaved,
  onShowPosition,
  onSaveToilet,
}) => {
  return (
    <View className="flex-row w-full justify-between items-center">
      <View className="basis-6/12">
        <TouchableOpacity
          onPress={onShowPosition}
          className="bg-blue-900 p-3 rounded-lg flex-row justify-center items-center gap-2 w-full border border-gray-300"
        >
          <IconSymbol name="recenter" size={20} color="#fff" />
          <Text className="font-medium text-white">Show Position</Text>
        </TouchableOpacity>
      </View>
      <View className="basis-6/12 pl-2">
        <TouchableOpacity
          className={`${
            isSaved ? "bg-red-100" : "bg-gray-200"
          } p-3 rounded-lg flex-row justify-center items-center gap-2 border ${
            isSaved ? "border-red-500" : "border-gray-300"
          }`}
          onPress={onSaveToilet}
        >
          <IconSymbol
            name="heart.fill"
            size={20}
            color={isSaved ? "#f00" : "#999"}
          />
          <Text className="font-medium">
            {isSaved ? "Saved" : "Save Toilet"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
