import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    // Basic validation
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const success = await register(email, password, name);
    if (success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Registration Failed", "Email may already be in use");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <View className="mb-8 items-center">
        <IconSymbol name="toilet" size={64} color="#37f" />
        <Text className="text-2xl font-bold mt-4">Create Account</Text>
        <Text className="text-gray-500">Join SkibidiGO today</Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 mb-2">Confirm Password</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg items-center mb-4"
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text className="text-white font-bold text-lg">
          {isLoading ? "Creating account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => router.push("/auth/login")}
      >
        <Text className="text-blue-500">
          Already have an account? <Text className="font-bold">Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
