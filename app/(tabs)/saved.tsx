import { IconSymbol } from "@/components/ui/IconSymbol";
import { useApp } from "@/context/appReducer";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SavedScreen() {
  const { state: authState } = useAuth();
  const { state: appState, loadSavedToilets } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/(auth)/login");
      return;
    }

    // Load saved toilets when component mounts
    loadSavedToilets();
  }, [authState.isAuthenticated]);

  if (!authState.isAuthenticated) {
    return null;
  }

  if (appState.isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4">Loading saved toilets...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-6">Saved Toilets</Text>

      {appState.savedToilets.length > 0 ? (
        <ScrollView>
          {appState.savedToilets.map((toilet) => (
            <TouchableOpacity
              key={toilet.id}
              className="bg-gray-100 p-4 rounded-lg mb-3"
            >
              <View className="flex-row items-center gap-2">
                <IconSymbol
                  name={
                    toilet.type === "PUBLIC" ? "globe.desk.fill" : "lock.fill"
                  }
                  size={16}
                  color={toilet.type === "PUBLIC" ? "#059669" : "#db2777"}
                />
                <Text className="font-medium flex-1">{toilet.name}</Text>
                <Text className="text-sm text-gray-500">
                  {toilet.distance} km
                </Text>
              </View>
              <Text className="text-sm text-gray-500 mt-1">
                {toilet.address}
              </Text>
              <View className="flex-row items-center mt-2">
                <IconSymbol name="heart.fill" size={14} color="#f00" />
                <Text className="text-sm ml-1">{toilet.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center">
          <IconSymbol name="heart.fill" size={60} color="#f87171" />
          <Text className="text-lg text-gray-600 mt-4 text-center">
            Your saved toilets will appear here
          </Text>
        </View>
      )}
    </View>
  );
}
