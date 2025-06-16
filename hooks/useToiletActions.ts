import { useApp } from "@/context/appReducer";
import { useAuth } from "@/context/authContext";
import { Toilet } from "@/models/toilet";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useToiletActions = (toilet?: Toilet) => {
  const { state: authState } = useAuth();
  const { state: appState, saveToilet, unsaveToilet } = useApp();
  const router = useRouter();

  // Check if toilet is saved
  const isSaved = toilet
    ? appState.savedToilets.some((t) => t.id === toilet.id)
    : false;

  const handleSaveToilet = async () => {
    if (!authState.isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "You need to login to save toilets.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/(auth)/login") },
        ]
      );
      return;
    }

    if (!toilet) return;

    try {
      if (isSaved) {
        const success = await unsaveToilet(toilet.id);
        if (success) {
          Alert.alert("Toilet Removed", "Toilet removed from your saved list");
        }
      } else {
        const success = await saveToilet(toilet);
        if (success) {
          Alert.alert("Toilet Saved", "Toilet added to your saved list");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update saved toilets");
    }
  };

  const requireAuth = (action: () => void) => {
    if (!authState.isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "You need to login to perform this action.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/(auth)/login") },
        ]
      );
      return;
    }
    action();
  };

  return {
    isSaved,
    handleSaveToilet,
    requireAuth,
    isAuthenticated: authState.isAuthenticated,
  };
};
