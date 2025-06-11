import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface ToiletDetailViewProps {
  onBackToList: () => void;
  toilet?: any; // In a real app, define a proper type for this
}

export function ToiletDetailView({
  onBackToList,
  toilet,
}: ToiletDetailViewProps) {
  return (
    <View className="px-6">
      <TouchableOpacity
        onPress={onBackToList}
        className="flex-row items-center mb-4"
      >
        <IconSymbol name="chevron.left" size={20} color="#37f" />
        <Text className="text-blue-500">Back to results</Text>
      </TouchableOpacity>

      <View className="flex-row mb-4">
        <View className="flex-1 justify-center">
          <View className="flex-row gap-1 items-center mb-1">
            <IconSymbol name="globe.desk.fill" size={18} color="#37f" />
            <IconSymbol name="dollar.sign" size={18} color="#f2f" />
            <Text className="font-bold text-lg">City Hall Restroom</Text>
          </View>
          <Text className="text-gray-500 mb-1">
            123 Government Ave, Floor 2
          </Text>
          <View className="flex-row items-center">
            <IconSymbol name="heart.fill" size={16} color="#f00" />
            <Text className="ml-1 mr-4">4.8 (42)</Text>
            <Text className="text-gray-500">0.3 km away</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity className="bg-blue-500 p-3 rounded-lg flex-row justify-center items-center mb-6">
        <IconSymbol name="location.fill" size={20} color="#fff" />
        <Text className="text-white font-semibold ml-2">Get Directions</Text>
      </TouchableOpacity>

      <View className="mb-6">
        <Text className="font-bold text-lg mb-2">Features</Text>
        <View className="flex-row flex-wrap gap-2">
          <View className="flex-row items-center bg-gray-100 py-1 px-3 rounded-full">
            <IconSymbol name="accessibility" size={14} color="#37f" />
            <Text className="ml-1 text-sm">Accessible</Text>
          </View>
          <View className="flex-row items-center bg-gray-100 py-1 px-3 rounded-full">
            <IconSymbol name="shower.handheld" size={14} color="#37f" />
            <Text className="ml-1 text-sm">Bidet</Text>
          </View>
          <View className="flex-row items-center bg-gray-100 py-1 px-3 rounded-full">
            <IconSymbol name="hand.wave" size={14} color="#37f" />
            <Text className="ml-1 text-sm">Hand Dryer</Text>
          </View>
          <View className="flex-row items-center bg-gray-100 py-1 px-3 rounded-full">
            <IconSymbol name="lock.open" size={14} color="#37f" />
            <Text className="ml-1 text-sm">No Key Required</Text>
          </View>
          <View className="flex-row items-center bg-gray-100 py-1 px-3 rounded-full">
            <IconSymbol name="sparkles" size={14} color="#37f" />
            <Text className="ml-1 text-sm">Water Laser</Text>
          </View>
        </View>
      </View>

      <View className="mb-6">
        <Text className="font-bold text-lg mb-2">Operating Hours</Text>
        <Text>Monday - Friday: 8:00 AM - 9:00 PM</Text>
        <Text>Weekends: 10:00 AM - 6:00 PM</Text>
      </View>

      <View>
        <Text className="font-bold text-lg mb-2">Reviews</Text>
        <View className="bg-gray-100 p-3 rounded-lg mb-2">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="font-semibold">Jane D.</Text>
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconSymbol
                  key={star}
                  name="star.fill"
                  size={14}
                  color="#FFD700"
                />
              ))}
            </View>
          </View>
          <Text className="text-sm">
            Very clean and well maintained. Soap and paper towels were stocked.
          </Text>
        </View>
      </View>
    </View>
  );
}
