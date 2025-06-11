import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../context/authContext";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function SavedScreen() {
  const { isAuthenticated } = useAuth();
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
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-6">Saved Toilets</Text>

      <View className="flex-1 justify-center items-center">
        <IconSymbol name="heart.fill" size={60} color="#f87171" />
        <Text className="text-lg text-gray-600 mt-4 text-center">
          Your saved toilets will appear here
        </Text>
      </View>
    </View>
  );
}
