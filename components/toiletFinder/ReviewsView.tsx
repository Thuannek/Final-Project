import { IconSymbol } from "@/components/ui/IconSymbol";
import { useApp } from "@/context/appReducer";
import { useAuth } from "@/context/authContext";
import { Review } from "@/models/toilet";
import {
  calculateAverageRating,
  fetchComments,
  hasUserReviewed,
} from "@/utils/db";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ReviewsViewProps {
  onBack: () => void;
  toilet: any;
}

export function ReviewsView({ onBack, toilet }: ReviewsViewProps) {
  const { state: authState } = useAuth();
  const { addComment, updateComment, deleteComment } = useApp();
  const router = useRouter();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Load reviews and calculate stats
  const loadReviews = () => {
    if (!toilet) return;

    const dbComments = fetchComments(toilet.id);

    // Separate user reviews from dummy reviews
    const userComments = dbComments.filter((review) => review.userId);
    const dummyReviews = toilet.reviews || [];

    // Combine all reviews
    const combinedReviews = [...dummyReviews, ...userComments];

    setAllReviews(combinedReviews);
    setUserReviews(userComments);

    // Calculate real statistics
    const totalCount = dummyReviews.length + userComments.length;
    const avgRating = calculateAverageRating(
      toilet.id,
      toilet.rating,
      toilet.reviewCount
    );

    setTotalReviews(totalCount);
    setAverageRating(avgRating);

    // Check if current user has reviewed
    if (authState.user?.id) {
      setHasReviewed(hasUserReviewed(toilet.id, authState.user.id));
    }
  };

  useEffect(() => {
    loadReviews();
  }, [toilet, authState.user]);

  const handleReviewSubmit = async () => {
    if (!authState.isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "You need to login to leave a review.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/(auth)/login") },
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

    setIsSubmitting(true);

    try {
      let success = false;

      if (editingReview) {
        // Update existing review
        success = await updateComment(
          toilet.id,
          editingReview.id,
          rating,
          reviewText.trim()
        );
      } else {
        // Add new review
        success = await addComment(
          toilet.id,
          authState.user?.name || "Anonymous User",
          rating,
          reviewText.trim(),
          authState.user?.id
        );
      }

      if (success) {
        Alert.alert(
          "Thank you",
          editingReview
            ? "Your review has been updated."
            : "Your review has been submitted.",
          [
            {
              text: "OK",
              onPress: () => {
                setReviewText("");
                setRating(0);
                setEditingReview(null);
                loadReviews(); // Reload all reviews
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", "Failed to submit review. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewText(review.comment);
    setRating(review.rating);
  };

  const handleDeleteReview = (review: Review) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteComment(toilet.id, review.id);
            if (success) {
              loadReviews(); // Reload all reviews
              Alert.alert("Success", "Review deleted successfully.");
            } else {
              Alert.alert("Error", "Failed to delete review.");
            }
          },
        },
      ]
    );
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setReviewText("");
    setRating(0);
  };

  const renderStars = (ratingValue: number, interactive: boolean = false) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={interactive ? () => setRating(star) : undefined}
            disabled={
              !interactive || !authState.isAuthenticated || isSubmitting
            }
          >
            <IconSymbol
              name="heart.fill"
              size={interactive ? 24 : 14}
              color={star <= ratingValue ? "#f00" : "#ddd"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const isOwnReview = (review: Review) => {
    return authState.user?.id && review.userId === authState.user.id;
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View className="mb-4 bg-gray-50 p-3 rounded-lg">
      <View className="flex-row justify-between mb-1">
        <Text className="font-bold">{item.userName}</Text>
        <View className="flex-row items-center">
          <View className="flex-row mr-2">{renderStars(item.rating)}</View>
          {isOwnReview(item) && (
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => handleEditReview(item)}
                className="mr-2 p-1"
              >
                <IconSymbol name="pencil" size={16} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteReview(item)}
                className="p-1"
              >
                <IconSymbol name="trash" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Text className="text-gray-700">{item.comment}</Text>
      {item.timestamp && (
        <Text className="text-xs text-gray-400 mt-1">
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  // Don't show add review form if user has already reviewed and not editing
  const shouldShowReviewForm =
    authState.isAuthenticated && (!hasReviewed || editingReview);

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
          <Text className="ml-1 font-bold">{averageRating}</Text>
          <Text className="ml-1 text-gray-500">({totalReviews} reviews)</Text>
        </View>
      </View>

      <FlatList
        data={allReviews}
        keyExtractor={(item) => `${item.id}-${item.timestamp || ""}`}
        renderItem={renderReviewItem}
        ListEmptyComponent={
          <View className="items-center justify-center p-8">
            <Text className="text-gray-500">No reviews yet</Text>
            <Text className="text-gray-400 text-sm mt-1">
              Be the first to review!
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {shouldShowReviewForm ? (
        <View className="mt-4 mb-6 pb-20">
          <Text className="font-semibold mb-2">
            {editingReview ? "Edit your review" : "Write a review"}
          </Text>

          <View className="mb-3">
            <Text className="mb-1">Rating</Text>
            {renderStars(rating, true)}
          </View>

          <TextInput
            className="bg-gray-100 p-3 rounded-lg border border-gray-300 min-h-[100px] mb-3"
            multiline
            placeholder="Share your experience with this toilet..."
            value={reviewText}
            onChangeText={setReviewText}
            textAlignVertical="top"
            editable={!isSubmitting}
          />

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleReviewSubmit}
              className="flex-1 p-3 rounded-lg bg-blue-900 flex-row justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">
                  {editingReview ? "Update Review" : "Submit Review"}
                </Text>
              )}
            </TouchableOpacity>

            {editingReview && (
              <TouchableOpacity
                onPress={cancelEdit}
                className="px-4 py-3 rounded-lg bg-gray-500 justify-center"
                disabled={isSubmitting}
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : authState.isAuthenticated && hasReviewed && !editingReview ? (
        <View className="mt-4 mb-6 pb-20 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Text className="text-center text-blue-800 font-medium">
            You have already reviewed this toilet. You can edit your review by
            tapping the edit icon.
          </Text>
        </View>
      ) : (
        <View className="mt-4 mb-6 pb-20 p-4 bg-gray-100 rounded-lg">
          <Text className="text-center mb-2">Sign in to leave a review</Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="bg-blue-500 p-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
