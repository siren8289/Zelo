"use client";

import { useState, useEffect } from "react";
import { HistoryPage } from "@/app/components/HistoryPage";
import { TasksDetailPage } from "@/app/components/TasksDetailPage";
import type { HistoryItem } from "@/app/components/HistoryPage";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface TasksDetailData {
  id: string;
  title: string;
  date: string;
  tasks: Array<{
    id: string;
    title: string;
    category: string;
    priority: number;
    urgency: string;
    reason: string;
    completed: boolean;
  }>;
}

export default function HistoryRoutePage() {
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<HistoryItem | null>(null);
  const [detailData, setDetailData] = useState<TasksDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const handleOpenDetail = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setViewMode("detail");
    setDetailData(null);
    setDetailError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (item.type === "tasks") {
      setDetailLoading(true);
      fetch(`/api/flow-b/tasks/${item.id}`)
        .then((res) => {
          if (res.status === 401) {
            setDetailError("로그인이 필요합니다");
            return null;
          }
          if (!res.ok) return res.json().then((d) => { throw new Error(d?.error ?? "불러오기 실패"); });
          return res.json();
        })
        .then((data) => {
          if (data) setDetailData(data);
        })
        .catch((e) => setDetailError(e?.message ?? "불러오기 실패"))
        .finally(() => setDetailLoading(false));
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedHistoryItem(null);
    setDetailData(null);
    setDetailError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (viewMode === "list") {
    return <HistoryPage onOpenDetail={handleOpenDetail} />;
  }

  if (selectedHistoryItem?.type === "planner") {
    return (
      <div className="space-y-4">
        <Card className="p-5">
          <Button variant="ghost" size="sm" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
        </Card>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">AI 기획 기록 상세는 아직 저장 기능이 없습니다.</p>
        </Card>
      </div>
    );
  }

  if (selectedHistoryItem?.type === "tasks") {
    if (detailLoading) {
      return (
        <Card className="p-8 text-center">
          <Loader2 className="h-10 w-10 mx-auto mb-3 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">불러오는 중...</p>
        </Card>
      );
    }
    if (detailError || !detailData) {
      return (
        <div className="space-y-4">
          <Card className="p-5">
            <Button variant="ghost" size="sm" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              돌아가기
            </Button>
          </Card>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">{detailError ?? "데이터를 불러올 수 없습니다"}</p>
          </Card>
        </div>
      );
    }
    return (
      <TasksDetailPage data={detailData} onBack={handleBackToList} />
    );
  }

  return null;
}
