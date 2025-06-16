import { IconSymbol } from "@/components/ui/IconSymbol";
import { useApp } from "@/context/appReducer";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { state: authState, logout } = useAuth();
  const { state: appState, resetState } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          resetState();
          router.replace("/(tabs)");
        },
      },
    ]);
  };

  if (!authState.isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <IconSymbol name="person.circle" size={80} color="#9ca3af" />
        <Text className="text-xl font-bold mt-4 mb-2">Not Logged In</Text>
        <Text className="text-gray-500 text-center mb-6">
          Sign in to access your profile and saved toilets
        </Text>
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-lg w-full"
          onPress={() => router.push("/(auth)/login")}
        >
          <Text className="text-white font-semibold text-center">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-6">Profile</Text>

      <View className="items-center mb-8">
        <IconSymbol name="person.circle.fill" size={80} color="#3b82f6" />
        <Text className="text-xl font-bold mt-2">{authState.user?.name}</Text>
        <Text className="text-gray-500">{authState.user?.email}</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4">Statistics</Text>
        <View className="bg-gray-100 p-4 rounded-lg">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Saved Toilets</Text>
            <Text className="font-bold text-lg">
              {appState.savedToilets.length}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="bg-red-500 p-3 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white font-semibold text-center">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
