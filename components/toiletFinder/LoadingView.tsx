import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

export function LoadingView() {
  return (
    <View className="px-6 flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#3b82f6" className="mb-4" />
      <Text className="text-xl font-bold text-center mb-2">
        Finding the nearest toilet
      </Text>
      <Text className="text-center text-gray-500">
        Hang in there! We're locating the best options nearby.
      </Text>
    </View>
  );
}
