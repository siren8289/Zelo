"use client";
import { useState } from "react";
import { History, FileText, CheckSquare, Trash2, ExternalLink } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  type: "planner" | "tasks";
  title: string;
  date: string;
  preview: string;
}

interface HistoryPageProps {
  onOpenDetail: (item: HistoryItem) => void;
}

export function HistoryPage({ onOpenDetail }: HistoryPageProps) {
  const [historyItems] = useState<HistoryItem[]>([
    {
      id: "1",
      type: "planner",
      title: "건강 도시락 구독 서비스",
      date: "2시간 전",
      preview: "직장인들을 위한 영양가 있는 식단 제공 서비스",
    },
    {
      id: "2",
      type: "tasks",
      title: "개발 작업 정리",
      date: "5시간 전",
      preview: "로그인 API, 디자인 시스템, 팀 회의 등 6개 작업",
    },
    {
      id: "3",
      type: "planner",
      title: "온라인 교육 플랫폼",
      date: "1일 전",
      preview: "실시간 1:1 코칭이 가능한 교육 서비스",
    },
    {
      id: "4",
      type: "tasks",
      title: "마케팅 업무",
      date: "2일 전",
      preview: "SNS 콘텐츠 제작, 이메일 캠페인 등 4개 작업",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "planner" | "tasks">("all");

  const filteredItems =
    filter === "all" ? historyItems : historyItems.filter((item) => item.type === filter);

  const handleDelete = (id: string) => {
    toast.success("항목이 삭제되었습니다");
  };

  const handleOpen = (item: HistoryItem) => {
    onOpenDetail(item);
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2>최근 작업 기록</h2>
            <p className="text-sm text-muted-foreground">
              최근 30건의 작업이 자동 저장됩니다
            </p>
          </div>
        </div>
      </Card>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            전체 ({historyItems.length})
          </TabsTrigger>
          <TabsTrigger value="planner">
            AI 기획 ({historyItems.filter((i) => i.type === "planner").length})
          </TabsTrigger>
          <TabsTrigger value="tasks">
            AI 업무 ({historyItems.filter((i) => i.type === "tasks").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-3 mt-4">
          {filteredItems.length === 0 ? (
            <Card className="p-8 text-center">
              <History className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">저장된 기록이 없습니다</p>
            </Card>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.type === "planner" ? FileText : CheckSquare;
              const typeLabel = item.type === "planner" ? "AI 기획" : "AI 업무";
              const typeColor =
                item.type === "planner"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-secondary/10 text-secondary-foreground border-secondary/20";

              return (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="truncate">{item.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={typeColor}>
                          {typeLabel}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.preview}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpen(item)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      열기
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}