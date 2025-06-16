import { Toilet } from "@/models/toilet";
import React from "react";
import { Text, View } from "react-native";

interface ToiletFeaturesProps {
  toilet?: Toilet;
}

export const ToiletFeatures: React.FC<ToiletFeaturesProps> = ({ toilet }) => {
  const formatFeatureText = (feature: string) => {
    // Handle different feature formats
    const words = feature.split(/[_\s]+/);
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  return (
    <View className="mt-6">
      <Text className="font-bold text-lg mb-2">Features</Text>
      <View className="flex-row flex-wrap gap-2">
        {toilet?.features?.map((feature: string) => (
          <Text
            key={feature}
            className="text-sm text-gray-500 bg-gray-200 rounded-full px-3 py-1"
          >
            {formatFeatureText(feature)}
          </Text>
        ))}
        {toilet?.hasFee !== undefined && (
          <Text className="text-sm text-gray-500 bg-gray-200 rounded-full px-3 py-1">
            {toilet.hasFee ? "Service Fee Required" : "Free Service"}
          </Text>
        )}
      </View>
    </View>
  );
};
