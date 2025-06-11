import React, { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/authContext";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function Contribute() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // Prevents flash of content before redirect
  }

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <IconSymbol name="plus.circle.fill" size={60} color="#3b82f6" />
      <Text className="font-bold text-2xl text-center mt-4">Contribute</Text>
      <Text className="text-gray-500 text-center mt-2 mb-6">
        Help others find great toilets by adding new locations to our database
      </Text>

      <TouchableOpacity className="bg-blue-500 p-3 rounded-lg flex-row justify-center items-center w-full">
        <IconSymbol name="plus" size={20} color="#fff" />
        <Text className="text-white font-semibold ml-2">Add New Toilet</Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-8 p-3" onPress={logout}>
        <Text className="text-red-500">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
