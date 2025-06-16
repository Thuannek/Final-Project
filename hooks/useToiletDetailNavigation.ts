import { useState } from "react";

type ViewType = "detail" | "report" | "reviews";

export const useToiletDetailNavigation = () => {
  const [currentView, setCurrentView] = useState<ViewType>("detail");

  const showDetail = () => setCurrentView("detail");
  const showReport = () => setCurrentView("report");
  const showReviews = () => setCurrentView("reviews");

  return {
    currentView,
    showDetail,
    showReport,
    showReviews,
    isDetailView: currentView === "detail",
    isReportView: currentView === "report",
    isReviewsView: currentView === "reviews",
  };
};
