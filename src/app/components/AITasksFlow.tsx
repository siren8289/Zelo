"use client";
import { useState } from "react";
import {
  CheckSquare,
  Clock,
  Filter,
  Download,
  TrendingUp,
  Code,
  Palette,
  Users,
  Mail,
  ChevronRight,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

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

const categoryIcons: Record<string, any> = {
  개발: Code,
  디자인: Palette,
  미팅: Users,
  이메일: Mail,
};

const categoryColors: Record<string, string> = {
  개발: "bg-primary/10 text-primary border-primary/20",
  디자인: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  미팅: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  이메일: "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

export function AITasksFlow() {
  const [step, setStep] = useState<FlowStep>("input");
  const [taskInput, setTaskInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!taskInput.trim()) {
      toast.error("할 일을 입력해주세요");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "사용자 로그인 API 개발",
          category: "개발",
          priority: 95,
          urgency: "긴급",
          reason: "프로젝트 핵심 기능이며 다른 작업의 선행 조건",
          completed: false,
        },
        {
          id: "2",
          title: "디자인 시스템 컴포넌트 정리",
          category: "디자인",
          priority: 75,
          urgency: "중요",
          reason: "일관된 UI/UX를 위해 필요하나 긴급하지 않음",
          completed: false,
        },
        {
          id: "3",
          title: "팀 주간 회의 준비",
          category: "미팅",
          priority: 88,
          urgency: "긴급",
          reason: "내일 오전 회의 예정",
          completed: false,
        },
        {
          id: "4",
          title: "고객 문의 답변",
          category: "이메일",
          priority: 65,
          urgency: "보통",
          reason: "24시간 이내 답변 권장",
          completed: false,
        },
      ];

      setTasks(mockTasks);
      setIsProcessing(false);
      setStep("categorized");
      toast.success("할 일이 자동으로 정리되었습니다!");
    }, 1500);
  };

  const handlePrioritize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("prioritized");
      toast.success("우선순위가 계산되었습니다!");
    }, 1000);
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
  const topTasks = sortedTasks.slice(0, 3);

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
              <h3> 일을 입력하세요</h3>
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

          {/* Top 3 */}
          <div className="space-y-3">
            <h4 className="px-1">🔥 우선 처리 추천 (Top 3)</h4>
            {topTasks.map((task, index) => {
              const Icon = categoryIcons[task.category] || CheckSquare;
              return (
                <Card
                  key={task.id}
                  className="p-4 border-primary/30 bg-primary/5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4" />
                        <h4>{task.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={categoryColors[task.category]}
                        >
                          {task.category}
                        </Badge>
                        <Badge variant="outline">{task.urgency}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">우선순위 점수</span>
                      <span className="font-semibold">{task.priority}/100</span>
                    </div>
                    <Progress value={task.priority} className="h-2" />
                    <p className="text-xs text-muted-foreground">{task.reason}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* All Tasks */}
          {sortedTasks.length > 3 && (
            <div className="space-y-3">
              <h4 className="px-1">나머지 작업</h4>
              {sortedTasks.slice(3).map((task) => {
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
                          <h4>{task.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={categoryColors[task.category]}
                          >
                            {task.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            점수: {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

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
              onClick={() => toast.success("체크리스트가 복사되었습니다")}
            >
              <Download className="h-5 w-5 mr-3" />
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