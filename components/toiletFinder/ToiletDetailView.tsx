import { IconSymbol } from "@/components/ui/IconSymbol";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
        className="flex-row items-center mb-2"
      >
        <IconSymbol name="close" size={30} color="#3b82f6" />
      </TouchableOpacity>

      <View className="w-full h-36 rounded-lg mb-6">
        <Image
          source={{
            uri: "https://cdn.imgchest.com/files/4nec8v5jrp4.jpg",
          }}
          className="w-full h-full"
          contentFit="cover"
          transition={1000}
        />
      </View>

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

      <View className="flex-row w-full justify-between items-center">
        <View className="basis-8/12 pr-2">
          <TouchableOpacity className="bg-blue-900 p-3 rounded-lg flex-row justify-center items-center w-full border border-blue-900">
            <IconSymbol name="direction" size={20} color="#fff" />
            <Text className="text-white font-semibold ml-2">
              Get Directions
            </Text>
          </TouchableOpacity>
        </View>
        <View className="basis-2/12">
          <TouchableOpacity className="bg-gray-200 p-3 rounded-lg flex-row justify-center items-center w-full border border-gray-300">
            <IconSymbol name="recenter" size={20} color="#37f" />
          </TouchableOpacity>
        </View>
        <View className="basis-2/12 pl-2">
          <TouchableOpacity className="bg-gray-200 p-3 rounded-lg flex-row justify-center items-center border border-gray-300">
            <IconSymbol name="heart.fill" size={20} color="#f00" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-6">
        <Text className="font-bold text-lg mb-2">Features</Text>
        <View className="flex-row flex-wrap gap-2">
          <Text className="text-sm text-gray-500 bg-gray-200 rounded-full px-2">
            Accessible
          </Text>
          <Text className="text-sm text-gray-500 bg-gray-200 rounded-full px-2">
            Fee Required
          </Text>
          <Text className="text-sm text-gray-500 bg-gray-200 rounded-full px-2">
            Water Laser
          </Text>
        </View>
      </View>

      <View className="mt-6">
        <Text className="font-bold text-lg mb-2">Operating Hours</Text>
        <Text>Monday - Friday: 8:00 AM - 9:00 PM</Text>
        <Text>Weekends: 10:00 AM - 6:00 PM</Text>
      </View>

      <View className="mt-6">
        <Text className="font-bold text-lg mb-2">Service Fees</Text>
        <Text>1000 VND for peeing</Text>
        <Text>2000 VND for pooping</Text>
      </View>

      <View className="flex-row w-full justify-between items-center mt-6">
        <View className="w-1/2 pr-1">
          <TouchableOpacity className="bg-gray-200 p-3 rounded-lg flex-row justify-center items-center border border-gray-300">
            <Text className="font-medium">Report</Text>
          </TouchableOpacity>
        </View>
        <View className="w-1/2 pl-1">
          <TouchableOpacity className="bg-gray-200 p-3 rounded-lg flex-row justify-center items-center border border-gray-300">
            <Text className="font-medium">Reviews</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
