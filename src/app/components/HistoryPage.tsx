"use client";
import { useState, useEffect } from "react";
import { History, FileText, CheckSquare, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

export interface HistoryItem {
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
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "planner" | "tasks">("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/flow-b/tasks");
        if (res.status === 401) {
          if (!cancelled) setHistoryItems([]);
          return;
        }
        const data = await res.json();
        if (!res.ok || cancelled) return;
        setHistoryItems(data.tasks ?? []);
      } catch {
        if (!cancelled) setHistoryItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
          {loading ? (
            <Card className="p-8 text-center">
              <Loader2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground animate-spin" />
              <p className="text-muted-foreground">불러오는 중...</p>
            </Card>
          ) : filteredItems.length === 0 ? (
            <Card className="p-8 text-center">
              <History className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                {historyItems.length === 0
                  ? "저장된 기록이 없습니다. AI 업무 매니저에서 저장하면 여기에 표시됩니다."
                  : "이 필터에 맞는 기록이 없습니다"}
              </p>
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