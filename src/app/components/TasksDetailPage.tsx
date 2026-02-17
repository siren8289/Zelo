import {
  ArrowLeft,
  CheckSquare,
  Download,
  Calendar,
  TrendingUp,
  Code,
  Palette,
  Users,
  Mail,
  Clock,
  Filter,
} from "lucide-react";
"use client";
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: number;
  urgency: string;
  reason: string;
  completed: boolean;
}

interface TasksDetailData {
  id: string;
  title: string;
  date: string;
  tasks: Task[];
}

interface TasksDetailPageProps {
  data: TasksDetailData;
  onBack: () => void;
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

export function TasksDetailPage({ data, onBack }: TasksDetailPageProps) {
  const [tasks, setTasks] = useState<Task[]>(data.tasks);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleExport = (format: string) => {
    toast.success(`${format}으로 내보내기가 시작됩니다`);
  };

  const categories = Array.from(new Set(tasks.map((t) => t.category)));
  const filteredTasks = filterCategory
    ? tasks.filter((t) => t.category === filterCategory)
    : tasks;

  const sortedTasks = [...filteredTasks].sort((a, b) => b.priority - a.priority);
  const topTasks = sortedTasks.slice(0, 3);
  const completedCount = tasks.filter((t) => t.completed).length;
  const completionRate = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-secondary to-primary rounded-2xl shadow-lg">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="mb-2">
              AI 업무 매니저
            </Badge>
            <h2 className="mb-2">{data.title}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{data.date}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Summary */}
      <Card className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3>진행 상황</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">완료율</span>
            <span className="font-semibold">
              {completedCount} / {tasks.length} ({completionRate}%)
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>
      </Card>

      {/* Category Filter */}
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

      {/* Top Priority Tasks */}
      <div className="space-y-3">
        <h3 className="px-1">🔥 우선 처리 추천 (Top 3)</h3>
        {topTasks.map((task, index) => {
          const Icon = categoryIcons[task.category] || CheckSquare;
          return (
            <Card
              key={task.id}
              className="p-4 border-primary/30 bg-primary/5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                    />
                    <Icon className="h-4 w-4" />
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
          <h3 className="px-1">나머지 작업</h3>
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

      {/* Export Actions */}
      <div className="space-y-3">
        <h3 className="px-1">내보내기 & 공유</h3>
        
        <Button
          variant="outline"
          className="w-full justify-start h-auto py-4"
          onClick={() => handleExport("Notion")}
        >
          <Download className="h-5 w-5 mr-3" />
          Notion으로 보내기
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-4"
          onClick={() => handleExport("Google Docs")}
        >
          <Download className="h-5 w-5 mr-3" />
          Google Docs로 내보내기
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-4"
          onClick={() => {
            const checklist = tasks
              .map((t) => `${t.completed ? "[x]" : "[ ]"} ${t.title}`)
              .join("\n");
            navigator.clipboard.writeText(checklist);
            toast.success("체크리스트가 복사되었습니다");
          }}
        >
          <Download className="h-5 w-5 mr-3" />
          체크리스트 복사
        </Button>
      </div>
    </div>
  );
}
