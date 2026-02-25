import { Lightbulb, CheckSquare, History, User, Sparkles, FileText } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const actionCards = [
    {
      id: "ai-planner",
      title: "AI PRD 기획서",
      description: "AI가 아이디어를 분석해 기획서로 만들어드립니다",
      icon: Lightbulb,
      gradient: "from-primary to-secondary",
    },
    {
      id: "prd",
      title: "일반 PRD 기획서",
      description: "템플릿에 맞춰 직접 기획서를 작성합니다",
      icon: FileText,
      gradient: "from-secondary to-primary",
    },
    {
      id: "ai-tasks",
      title: "할 일 정리하기",
      description: "업무를 자동으로 분류하고 우선순위를 추천합니다",
      icon: CheckSquare,
      gradient: "from-primary to-secondary",
    },
  ];

  const quickActions = [
    { id: "history", label: "최근 결과 보기", icon: History },
    { id: "profile", label: "프로필", icon: User },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="mb-2">내 업무 자동화 AI</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              아이디어를 기획서로, 할 일을 체계적으로.
              <br />
              AI가 당신의 업무를 자동화합니다.
            </p>
          </div>
        </div>
      </Card>

      {/* Main Actions */}
      <div className="space-y-4">
        <h3 className="px-1">무엇을 도와드릴까요?</h3>
        <div className="space-y-3">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className="p-5 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => onNavigate(card.id)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-4 bg-gradient-to-br ${card.gradient} rounded-xl shadow-md`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{card.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="px-1">빠른 실행</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto py-8 flex-col gap-3"
                onClick={() => onNavigate(action.id)}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Usage Guide */}
      <Card className="p-5 bg-muted/50">
        <h4 className="mb-3">사용 가이드</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">1.</span>
            <span>원하는 기능을 선택하세요</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">2.</span>
            <span>자유롭게 텍스트를 입력하세요</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">3.</span>
            <span>AI가 자동으로 정리하고 추천합니다</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">4.</span>
            <span>Notion, Google Docs로 내보낼 수 있습니다</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}