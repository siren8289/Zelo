"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  Download,
  TrendingUp,
  Code,
  Palette,
  Users,
  Mail,
  ChevronRight,
  FileText,
  BookOpen,
  MessageSquare,
  User,
  Briefcase,
  GraduationCap,
  Copy,
  Save,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import type { OrganizeResType, PriorityResType } from "@/lib/flow-b/schemas";

type PriorityItem = PriorityResType["items"][number];

type FlowStep = "input" | "categorized" | "prioritized" | "export";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: number;
  urgency: string;
  reason: string;
  completed: boolean;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  업무: Briefcase,
  학업: GraduationCap,
  개발: Code,
  디자인: Palette,
  문서: FileText,
  회의: Users,
  연락: Mail,
  개인: User,
  기타: CheckSquare,
};

const categoryColors: Record<string, string> = {
  업무: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  학업: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  개발: "bg-primary/10 text-primary border-primary/20",
  디자인: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  문서: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  회의: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  연락: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  개인: "bg-muted text-muted-foreground border-border",
  기타: "bg-muted text-muted-foreground border-border",
};

function scoreToUrgency(score: number): string {
  if (score >= 80) return "긴급";
  if (score >= 50) return "중요";
  return "보통";
}

export function AITasksFlow() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>("input");
  const [taskInput, setTaskInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [organized, setOrganized] = useState<OrganizeResType | null>(null);
  const [priority, setPriority] = useState<PriorityResType | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!taskInput.trim()) {
      toast.error("할 일을 입력해주세요");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("/api/flow-b/organize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_input: taskInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "분류 요청 실패");
        return;
      }
      setOrganized(data);
      const mapped: Task[] = data.items.map((it: { content: string; category: string }, idx: number) => ({
        id: String(idx),
        title: it.content,
        category: it.category,
        priority: 0,
        urgency: "보통",
        reason: "",
        completed: false,
      }));
      setTasks(mapped);
      setStep("categorized");
      toast.success("할 일이 자동으로 정리되었습니다!");
    } catch {
      toast.error("네트워크 오류");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrioritize = async () => {
    if (!organized) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/flow-b/priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organized }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "우선순위 계산 실패");
        return;
      }
      setPriority(data);
      const priorityByIndex = new Map<number, PriorityItem>(
        (data.items as PriorityItem[]).map((p) => [p.item_index, p])
      );
      const ordered = (data.ordered_indexes as number[]) ?? (data.items as PriorityItem[]).map((p) => p.item_index);
      setTasks((prev) =>
        ordered.map((idx: number) => {
          const item = organized.items[idx];
          const p = priorityByIndex.get(idx);
          return {
            id: String(idx),
            title: item.content,
            category: item.category,
            priority: p?.priority_score ?? 0,
            urgency: scoreToUrgency(p?.priority_score ?? 0),
            reason: p?.reason ?? "",
            completed: prev.find((t) => t.id === String(idx))?.completed ?? false,
          };
        })
      );
      setStep("prioritized");
      toast.success("우선순위가 계산되었습니다!");
    } catch {
      toast.error("네트워크 오류");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToSupabase = async () => {
    if (!organized || !priority || !taskInput.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/flow-b/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_input: taskInput.trim(),
          organized,
          priority,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        toast.error("로그인이 필요합니다");
        router.push("/profile");
        return;
      }
      if (!res.ok) {
        toast.error(data?.error ?? "저장 실패");
        return;
      }
      toast.success("Supabase에 저장되었습니다");
    } catch {
      toast.error("네트워크 오류");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyChecklist = () => {
    const text = tasks.map((t) => `${t.completed ? "[x]" : "[ ]"} ${t.title}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("체크리스트가 복사되었습니다");
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const loadExampleData = () => {
    setTaskInput(
      `사용자 로그인 API 개발
디자인 시스템 컴포넌트 정리
팀 주간 회의 준비
고객 문의 답변
데이터베이스 최적화
마케팅 자료 제작`
    );
  };

  const categories = Array.from(new Set(tasks.map((t) => t.category)));
  const filteredTasks = filterCategory
    ? tasks.filter((t) => t.category === filterCategory)
    : tasks;

  const sortedTasks = [...filteredTasks].sort((a, b) => b.priority - a.priority);

  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {["입력", "분류", "우선순위", "내보내기"].map((label, index) => {
          const stepIndex = ["input", "categorized", "prioritized", "export"].indexOf(step);
          const isActive = index <= stepIndex;
          return (
            <div key={label} className="flex items-center gap-2 shrink-0">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-sm ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {index < 3 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Input */}
      {step === "input" && (
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3>할 일을 입력하세요</h3>
              <p className="text-sm text-muted-foreground">
                줄바꿈으로 구분하여 입력하세요
              </p>
            </div>
          </div>

          <Textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="예:&#10;사용자 로그인 API 개발&#10;디자인 시스템 정리&#10;팀 회의 준비"
            className="min-h-[200px] mb-3"
          />

          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={loadExampleData}>
              예시 불러오기
            </Button>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isProcessing || !taskInput.trim()}
            className="w-full"
            size="lg"
          >
            {isProcessing ? "분석 중..." : "AI 정리 시작"}
          </Button>
        </Card>
      )}

      {/* Step 2: Categorized */}
      {step === "categorized" && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3>카테고리별 분류</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep("input")}>
                수정
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              AI가 {tasks.length}개의 작업을 {categories.length}개 카테고리로 분류했습니다
            </p>
          </Card>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={filterCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(null)}
            >
              전체 ({tasks.length})
            </Button>
            {categories.map((cat) => {
              const count = tasks.filter((t) => t.category === cat).length;
              return (
                <Button
                  key={cat}
                  variant={filterCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat} ({count})
                </Button>
              );
            })}
          </div>

          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const Icon = categoryIcons[task.category] || CheckSquare;
              return (
                <Card key={task.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <h4
                          className={
                            task.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }
                        >
                          {task.title}
                        </h4>
                      </div>
                      <Badge
                        variant="outline"
                        className={categoryColors[task.category]}
                      >
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Button onClick={handlePrioritize} disabled={isProcessing} className="w-full" size="lg">
            {isProcessing ? "계산 중..." : "우선순위 추천받기"}
          </Button>
        </div>
      )}

      {/* Step 3: Prioritized */}
      {step === "prioritized" && (
        <div className="space-y-4">
          <Card className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <h3>우선순위 분석 완료</h3>
                <p className="text-sm text-muted-foreground">
                  긴급도와 중요도를 기반으로 점수를 계산했습니다
                </p>
              </div>
            </div>
          </Card>

          {/* 우선순위 순 전체 목록 (모든 작업에 점수·사유 표시) */}
          <div className="space-y-3">
            <h4 className="px-1">우선순위 순 작업 목록 ({sortedTasks.length}건)</h4>
            {sortedTasks.map((task, index) => {
              const Icon = categoryIcons[task.category] || CheckSquare;
              const isTop3 = index < 3;
              return (
                <Card
                  key={task.id}
                  className={`p-4 ${isTop3 ? "border-primary/30 bg-primary/5" : ""}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 shrink-0" />
                        <h4 className={task.completed ? "line-through text-muted-foreground" : ""}>
                          {task.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={categoryColors[task.category]}
                        >
                          {task.category}
                        </Badge>
                        <Badge variant="outline">{task.urgency}</Badge>
                      </div>
                    </div>
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      className="shrink-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">우선순위 점수</span>
                      <span className="font-semibold">{task.priority}/100</span>
                    </div>
                    <Progress value={task.priority} className="h-2" />
                    {task.reason ? (
                      <p className="text-xs text-muted-foreground">{task.reason}</p>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={() => setStep("categorized")}>
              돌아가기
            </Button>
            <Button size="lg" onClick={() => setStep("export")}>내보내기</Button>
          </div>
        </div>
      )}

      {/* Step 4: Export */}
      {step === "export" && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-2">내보내기 & 공유</h3>
            <p className="text-sm text-muted-foreground">
              정리된 할 일을 다양한 형식으로 저장하세요
            </p>
          </Card>

          <div className="space-y-3">
            <Button
              variant="default"
              className="w-full justify-start h-auto py-4"
              onClick={handleSaveToSupabase}
              disabled={isSaving || !organized || !priority}
            >
              <Save className="h-5 w-5 mr-3" />
              {isSaving ? "저장 중..." : "Supabase에 저장"}
            </Button>

            <Button variant="outline" className="w-full justify-start h-auto py-4">
              <Download className="h-5 w-5 mr-3" />
              Notion으로 보내기
            </Button>

            <Button variant="outline" className="w-full justify-start h-auto py-4">
              <Download className="h-5 w-5 mr-3" />
              Google Docs로 내보내기
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              onClick={handleCopyChecklist}
            >
              <Copy className="h-5 w-5 mr-3" />
              체크리스트 복사
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full h-auto py-3"
            onClick={() => {
              setStep("input");
              setTaskInput("");
              setTasks([]);
              setOrganized(null);
              setPriority(null);
              toast.success("새 할 일을 시작하세요");
            }}
          >
            새 할 일 시작하기
          </Button>
        </div>
      )}
    </div>
  );
}