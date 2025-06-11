import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "../../context/authContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        router.back(); // Return to previous screen after login
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <View className="mb-8 items-center">
        <IconSymbol name="toilet" size={60} color="#3b82f6" />
        <Text className="text-2xl font-bold mt-4">Sign in to SkibidiGO</Text>
        <Text className="text-gray-500 text-center mt-2">
          Access your saved toilets and contribute to our database
        </Text>
      </View>

      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-medium">Email</Text>
        <TextInput
          className="bg-gray-100 p-3 rounded-lg"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 mb-2 font-medium">Password</Text>
        <TextInput
          className="bg-gray-100 p-3 rounded-lg"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-lg items-center mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(tabs)")}>
        <Text className="text-center text-blue-500">
          Skip for now (continue as guest)
        </Text>
      </TouchableOpacity>
    </View>
  );
}
