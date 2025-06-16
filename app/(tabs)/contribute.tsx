import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/authContext";

export default function Contribute() {
  const { state, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push("/login");
    }
  }, [state.isAuthenticated]);

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <IconSymbol name="hammer.fill" size={60} color="#f59e0b" />
      <Text className="font-bold text-2xl text-center mt-4">
        Under Development
      </Text>
      <Text className="text-gray-500 text-center mt-2 mb-6">
        The toilet contribution feature is currently being developed. Soon
        you'll be able to add new toilet locations to help the community!
      </Text>

      {/* Development status indicator */}
      <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 w-full">
        <View className="flex-row items-center mb-2">
          <IconSymbol
            name="exclamationmark.triangle.fill"
            size={20}
            color="#f59e0b"
          />
          <Text className="font-semibold text-yellow-800 ml-2">
            Coming Soon
          </Text>
        </View>
        <Text className="text-yellow-700 text-sm">
          This feature will allow you to:
        </Text>
        <Text className="text-yellow-700 text-sm mt-1">
          • Add new toilet locations{"\n"}• Upload photos and descriptions{"\n"}
          • Help improve our community database
        </Text>
      </View>

      <TouchableOpacity
        className="bg-gray-300 p-3 rounded-lg flex-row justify-center items-center w-full"
        disabled={true}
      >
        <IconSymbol name="plus" size={20} color="#666" />
        <Text className="text-gray-600 font-semibold ml-2">
          Add New Toilet (Coming Soon)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-8 p-3" onPress={logout}>
        <Text className="text-red-500">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
