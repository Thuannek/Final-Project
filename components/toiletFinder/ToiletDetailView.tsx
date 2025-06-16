import { useToiletActions } from "@/hooks/useToiletActions";
import { useToiletDetailNavigation } from "@/hooks/useToiletDetailNavigation";
import React from "react";
import { View } from "react-native";
import { ActionButtons } from "../toiletDetails/ActionButtons";
import { ReportReview } from "../toiletDetails/ReviewReport";
import { ServiceDetail } from "../toiletDetails/ServiceDetail";
import { ToiletFeatures } from "../toiletDetails/ToiletFeatures";
import { ToiletHeader } from "../toiletDetails/ToiletHeader";
import { ReportView } from "./ReportView";
import { ReviewsView } from "./ReviewsView";

interface ToiletDetailViewProps {
  onBackToList: () => void;
  toilet?: any;
  onShowPosition: (coordinates: {
    latitude: number;
    longitude: number;
  }) => void;
}

export function ToiletDetailView({
  onBackToList,
  toilet,
  onShowPosition,
}: ToiletDetailViewProps) {
  const { isSaved, handleSaveToilet, requireAuth } = useToiletActions(toilet);
  const {
    currentView,
    showDetail,
    showReport,
    showReviews,
    isReportView,
    isReviewsView,
  } = useToiletDetailNavigation();

  const handleShowPosition = () => {
    if (onShowPosition && toilet?.coordinates) {
      onShowPosition(toilet.coordinates);
    }
  };

  const handleReportPress = () => {
    requireAuth(() => showReport());
  };

  const handleReviewsPress = () => {
    showReviews();
  };

  if (isReportView && toilet) {
    return (
      <ReportView
        onBack={showDetail}
        toiletId={toilet.id}
        toiletName={toilet.name}
      />
    );
  }

  if (isReviewsView && toilet) {
    return <ReviewsView onBack={showDetail} toilet={toilet} />;
  }

  return (
    <View className="px-6">
      <ToiletHeader toilet={toilet} onBack={onBackToList} />

      <ActionButtons
        isSaved={isSaved}
        onShowPosition={handleShowPosition}
        onSaveToilet={handleSaveToilet}
      />

      <ToiletFeatures toilet={toilet} />
      <ServiceDetail toilet={toilet} />

      <ReportReview
        onReportPress={handleReportPress}
        onReviewsPress={handleReviewsPress}
      />
    </View>
  );
}
