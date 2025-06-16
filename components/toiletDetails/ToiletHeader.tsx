import { IconSymbol } from "@/components/ui/IconSymbol";
import { Toilet } from "@/models/toilet";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ToiletHeaderProps {
  toilet?: Toilet;
  onBack: () => void;
}

export const ToiletHeader: React.FC<ToiletHeaderProps> = ({
  toilet,
  onBack,
}) => {
  return (
    <>
      <TouchableOpacity onPress={onBack} className="flex-row items-center mb-2">
        <IconSymbol name="close" size={30} color="#3b82f6" />
      </TouchableOpacity>

      <View className="flex-row mb-4">
        <View className="flex-1 justify-center">
          <View className="flex-row gap-1 items-center mb-1">
            <IconSymbol
              name={toilet?.type === "PUBLIC" ? "globe.desk.fill" : "lock.fill"}
              size={18}
              color={toilet?.type === "PUBLIC" ? "#059669" : "#db2777"}
            />
            {toilet?.hasFee && (
              <IconSymbol name="dollar.sign" size={18} color="#f59e0b" />
            )}
            <Text className="font-bold text-lg">
              {toilet?.name || "City Hall Restroom"}
            </Text>
          </View>
          <Text className="text-gray-500 mb-1">
            {toilet?.address || "123 Government Ave, Floor 2"}
          </Text>
          <View className="flex-row items-center">
            <IconSymbol name="heart.fill" size={16} color="#f00" />
            <Text className="ml-1 mr-4">
              {toilet?.rating || 4.8} ({toilet?.reviewCount || 42})
            </Text>
            <Text className="text-gray-500">
              {toilet?.distance || 0.3} km away
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};
