import { useAuth } from "@/context/authContext";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export const useAuthMiddleware = () => {
  const { state } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (state.isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup =
      segments[0] === "(tabs)" &&
      (segments[1] === "saved" ||
        segments[1] === "contribute" ||
        segments[1] === "profile");

    if (!state.isAuthenticated && inProtectedGroup) {
      // Redirect to login if not authenticated and trying to access protected routes
      router.replace("/(auth)/login");
    } else if (state.isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and on auth screens
      router.replace("/(tabs)");
    }
  }, [state.isAuthenticated, state.isLoading, segments]);

  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
  };
};
