import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ReviewsViewProps {
  onBack: () => void;
  toilet: any; // In a real app, define a proper type for this
}

export function ReviewsView({ onBack, toilet }: ReviewsViewProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const handleReviewSubmit = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "You need to login to leave a review.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/login") },
        ]
      );
      return;
    }

    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert("Error", "Please enter a review");
      return;
    }

    // In a real app, you would send this data to your backend
    console.log({
      toiletId: toilet.id,
      rating,
      comment: reviewText,
      timestamp: new Date().toISOString(),
    });

    Alert.alert("Thank you", "Your review has been submitted.", [
      {
        text: "OK",
        onPress: () => {
          setReviewText("");
          setRating(0);
        },
      },
    ]);
  };

  const renderStars = (ratingValue: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            disabled={!isAuthenticated}
          >
            <IconSymbol
              name="heart.fill"
              size={24}
              color={star <= rating ? "#f00" : "#ddd"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View className="px-6 flex-1">
      <TouchableOpacity onPress={onBack} className="flex-row items-center mb-2">
        <IconSymbol name="close" size={30} color="#3b82f6" />
      </TouchableOpacity>

      <View className="mb-6">
        <Text className="text-xl font-bold mb-1">Reviews</Text>
        <Text className="text-gray-500">{toilet.name}</Text>
        <View className="flex-row items-center mt-1">
          <IconSymbol name="heart.fill" size={16} color="#f00" />
          <Text className="ml-1 font-bold">{toilet.rating}</Text>
          <Text className="ml-1 text-gray-500">
            ({toilet.reviewCount} reviews)
          </Text>
        </View>
      </View>

      <FlatList
        data={toilet.reviews || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-4 bg-gray-50 p-3 rounded-lg">
            <View className="flex-row justify-between mb-1">
              <Text className="font-bold">{item.userName}</Text>
              <View className="flex-row">
                {[...Array(item.rating)].map((_, i) => (
                  <IconSymbol
                    key={i}
                    name="heart.fill"
                    size={14}
                    color="#f00"
                  />
                ))}
              </View>
            </View>
            <Text className="text-gray-700">{item.comment}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center p-8">
            <Text className="text-gray-500">No reviews yet</Text>
          </View>
        }
      />

      {isAuthenticated ? (
        <View className="mt-4 mb-6">
          <Text className="font-semibold mb-2">Write a review</Text>

          <View className="mb-3">
            <Text className="mb-1">Rating</Text>
            {renderStars(rating)}
          </View>

          <TextInput
            className="bg-gray-100 p-3 rounded-lg border border-gray-300 min-h-[100px] mb-3"
            multiline
            placeholder="Share your experience with this toilet..."
            value={reviewText}
            onChangeText={setReviewText}
            textAlignVertical="top"
          />

          <TouchableOpacity
            onPress={handleReviewSubmit}
            className="p-3 rounded-lg bg-blue-900 flex-row justify-center"
          >
            <Text className="text-white font-semibold">Submit Review</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="mt-4 mb-6 p-4 bg-gray-100 rounded-lg">
          <Text className="text-center mb-2">Sign in to leave a review</Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="bg-blue-500 p-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
