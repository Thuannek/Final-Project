import { IconSymbol } from "@/components/ui/IconSymbol";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ReportReviewButtonsProps {
  onReportPress: () => void;
  onReviewsPress: () => void;
}

export const ReportReview: React.FC<ReportReviewButtonsProps> = ({
  onReportPress,
  onReviewsPress,
}) => {
  return (
    <View className="flex-row w-full justify-between items-center mt-6">
      <View className="w-1/2 pr-1">
        <TouchableOpacity
          className="bg-gray-200 p-3 rounded-lg flex-row justify-center items-center gap-2 border border-gray-300"
          onPress={onReportPress}
        >
          <IconSymbol name="report" size={20} color="#f00" />
          <Text className="font-medium">Report</Text>
        </TouchableOpacity>
      </View>
      <View className="w-1/2 pl-1">
        <TouchableOpacity
          className="bg-gray-200 p-3 rounded-lg flex-row justify-center items-center gap-2 border border-gray-300"
          onPress={onReviewsPress}
        >
          <IconSymbol name="reviews" size={20} color="#f2f" />
          <Text className="font-medium">Reviews</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
