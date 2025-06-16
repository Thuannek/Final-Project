import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "./global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AppProvider } from "../context/appReducer";
import { AuthProvider } from "../context/authContext";
import { useAuthMiddleware } from "../hooks/useAuthMiddleware";
import { initializeDatabase } from "../utils/db";

import { GestureHandlerRootView } from "react-native-gesture-handler";

// Auth middleware component
function AuthMiddleware({ children }: { children: React.ReactNode }) {
  useAuthMiddleware();
  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Initialize database when app starts
  useEffect(() => {
    try {
      initializeDatabase();
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AppProvider>
          <AuthMiddleware>
            <GestureHandlerRootView>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </GestureHandlerRootView>
          </AuthMiddleware>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
