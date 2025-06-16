import { Toilet } from "@/models/toilet";
import React from "react";
import { Text, View } from "react-native";

interface ToiletFeaturesProps {
  toilet?: Toilet;
}

export const ToiletFeatures: React.FC<ToiletFeaturesProps> = ({ toilet }) => {
  return (
    <View className="mt-6">
      <Text className="font-bold text-lg mb-2">Features</Text>
      <View className="flex-row flex-wrap gap-2">
        {toilet?.features?.map((feature: string) => (
          <Text
            key={feature}
            className="text-sm text-gray-500 bg-gray-200 rounded-full px-2"
          >
            {feature.replace("_", " ")}
          </Text>
        ))}
        {toilet?.waterLaser && (
          <>
            <Text className="text-sm text-gray-500 bg-gray-200 rounded-full px-2">
              Water Laser
            </Text>
          </>
        )}
      </View>
    </View>
  );
};
