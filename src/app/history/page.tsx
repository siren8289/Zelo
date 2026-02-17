"use client";

import { useState } from "react";
import { HistoryPage } from "@/app/components/HistoryPage";
import { PlannerDetailPage } from "@/app/components/PlannerDetailPage";
import { TasksDetailPage } from "@/app/components/TasksDetailPage";
import {
  getMockPlannerData,
  getMockTasksData,
  type HistoryItem,
} from "@/app/lib/history-mock";

export default function HistoryRoutePage() {
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<HistoryItem | null>(null);

  const handleOpenDetail = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setViewMode("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedHistoryItem(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (viewMode === "list") {
    return <HistoryPage onOpenDetail={handleOpenDetail} />;
  }

  if (selectedHistoryItem?.type === "planner") {
    return (
      <PlannerDetailPage
        data={getMockPlannerData(selectedHistoryItem)}
        onBack={handleBackToList}
      />
    );
  }

  if (selectedHistoryItem?.type === "tasks") {
    return (
      <TasksDetailPage
        data={getMockTasksData(selectedHistoryItem)}
        onBack={handleBackToList}
      />
    );
  }

  return null;
}
