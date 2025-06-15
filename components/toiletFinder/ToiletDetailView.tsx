import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { ReportView } from "./ReportView";
import { ReviewsView } from "./ReviewsView";

interface ToiletDetailViewProps {
  onBackToList: () => void;
  toilet?: any; // In a real app, define a proper type for this
}

export function ToiletDetailView({
  onBackToList,
  toilet,
}: ToiletDetailViewProps) {
  const [currentView, setCurrentView] = useState<
    "detail" | "report" | "reviews"
  >("detail");
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToilet = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "You need to login to save toilets.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/login") },
        ]
      );
      return;
    }

    // In a real app, you would call an API to save the toilet
    setIsSaved(!isSaved);
    Alert.alert(
      !isSaved ? "Toilet Saved" : "Toilet Removed",
      !isSaved
        ? "Toilet added to your saved list"
        : "Toilet removed from your saved list"
    );
  };

  const handleReportPress = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "You need to login to report issues.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/login") },
        ]
      );
      return;
    }

    setCurrentView("report");
  };

  const handleReviewsPress = () => {
    setCurrentView("reviews");
  };

  const handleBackToDetail = () => {
    setCurrentView("detail");
  };

  if (currentView === "report" && toilet) {
    return (
      <ReportView
        onBack={handleBackToDetail}
        toiletId={toilet.id}
        toiletName={toilet.name}
      />
    );
  }

  if (currentView === "reviews" && toilet) {
    return <ReviewsView onBack={handleBackToDetail} toilet={toilet} />;
  }

  return (
    <View className="px-6">
      <TouchableOpacity
        onPress={onBackToList}
        className="flex-row items-center mb-2"
      >
        <IconSymbol name="close" size={30} color="#3b82f6" />
      </TouchableOpacity>

      <View className="flex-row mb-4">
        <View className="flex-1 justify-center">
          <View className="flex-row gap-1 items-center mb-1">
            <IconSymbol
              name={toilet?.type === "PUBLIC" ? "globe.desk.fill" : "lock.fill"}
              size={18}
              color={toilet?.type === "PUBLIC" ? "#059669" : "#db2777"}
            />
            {toilet?.hasFee && (
              <IconSymbol name="dollar.sign" size={18} color="#f59e0b" />
            )}
            <Text className="font-bold text-lg">
              {toilet?.name || "City Hall Restroom"}
            </Text>
          </View>
          <Text className="text-gray-500 mb-1">
            {toilet?.address || "123 Government Ave, Floor 2"}
          </Text>
          <View className="flex-row items-center">
            <IconSymbol name="heart.fill" size={16} color="#f00" />
            <Text className="ml-1 mr-4">
              {toilet?.rating || 4.8} ({toilet?.reviewCount || 42})
            </Text>
            <Text className="text-gray-500">
              {toilet?.distance || 0.3} km away
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row w-full justify-between items-center">
        <View className="basis-6/12">
          <TouchableOpacity className="bg-blue-900 p-3 rounded-lg flex-row justify-center items-center gap-2 w-full border border-gray-300">
            <IconSymbol name="recenter" size={20} color="#fff" />
            <Text className="font-medium text-white">Show Position</Text>
          </TouchableOpacity>
        </View>
        <View className="basis-6/12 pl-2">
          <TouchableOpacity
            className={`${
              isSaved ? "bg-red-100" : "bg-gray-200"
            } p-3 rounded-lg flex-row justify-center items-center gap-2 border ${
              isSaved ? "border-red-500" : "border-gray-300"
            }`}
            onPress={handleSaveToilet}
          >
            <IconSymbol
              name="heart.fill"
              size={20}
              color={isSaved ? "#f00" : "#999"}
            />
            <Text className="font-medium">
              {isSaved ? "Saved" : "Save Toilet"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-6">
        <Text className="font-bold text-lg mb-2">Features</Text>
        <View className="flex-row flex-wrap gap-2">
          {toilet?.features?.map((feature: string) => (
            <Text
              key={feature}
              className="text-sm text-gray-500 bg-gray-200 rounded-full px-2"
            >
              {feature.replace("_", " ")}
            </Text>
          ))}
          {!toilet?.features && (
            <>
              <Text className="text-sm text-gray-500 bg-gray-200 rounded-full px-2">
                Accessible
              </Text>
              <Text className="text-sm text-gray-500 bg-gray-200 rounded-full px-2">
                Fee Required
              </Text>
              <Text className="text-sm text-gray-500 bg-gray-200 rounded-full px-2">
                Water Laser
              </Text>
            </>
          )}
        </View>
      </View>

      <View className="mt-6">
        <Text className="font-bold text-lg mb-2">Operating Hours</Text>
        <Text>
          Monday - Friday:{" "}
          {toilet?.operatingHours?.weekdays || "8:00 AM - 9:00 PM"}
        </Text>
        <Text>
          Weekends: {toilet?.operatingHours?.weekends || "10:00 AM - 6:00 PM"}
        </Text>
      </View>

      <View className="mt-6">
        <Text className="font-bold text-lg mb-2">Service Fees</Text>
        <Text>
          {toilet?.hasFee
            ? "This toilet requires a fee"
            : "This toilet is free to use"}
        </Text>
      </View>

      <View className="flex-row w-full justify-between items-center mt-6">
        <View className="w-1/2 pr-1">
          <TouchableOpacity
            className="bg-gray-200 p-3 rounded-lg flex-row justify-center items-center gap-2 border border-gray-300"
            onPress={handleReportPress}
          >
            <IconSymbol name="report" size={20} color="#f00" />
            <Text className="font-medium">Report</Text>
          </TouchableOpacity>
        </View>
        <View className="w-1/2 pl-1">
          <TouchableOpacity
            className="bg-gray-200 p-3 rounded-lg flex-row justify-center items-center gap-2 border border-gray-300"
            onPress={handleReviewsPress}
          >
            <IconSymbol name="reviews" size={20} color="#f2f" />
            <Text className="font-medium">Reviews</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
