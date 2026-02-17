import {
  ArrowLeft,
  FileText,
  Download,
  Share2,
  Copy,
  Edit,
  Calendar,
  Target,
  Users,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface PlannerDetailData {
  id: string;
  title: string;
  date: string;
  structuredData: {
    goal: string;
    target: string;
    problem: string;
    solution: string;
  };
}

interface PlannerDetailPageProps {
  data: PlannerDetailData;
  onBack: () => void;
}

export function PlannerDetailPage({ data, onBack }: PlannerDetailPageProps) {
  const handleExport = (format: string) => {
    toast.success(`${format}으로 내보내기가 시작됩니다`);
  };

  const sections = [
    {
      key: "goal",
      label: "프로젝트 목표",
      icon: Target,
      color: "text-primary",
    },
    {
      key: "target",
      label: "타겟 사용자",
      icon: Users,
      color: "text-chart-2",
    },
    {
      key: "problem",
      label: "해결할 문제",
      icon: AlertCircle,
      color: "text-chart-3",
    },
    {
      key: "solution",
      label: "제안하는 솔루션",
      icon: Lightbulb,
      color: "text-chart-4",
    },
  ];

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
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="mb-2">
              AI 기획 비서
            </Badge>
            <h2 className="mb-2">{data.title}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{data.date}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Structured Data Sections */}
      <div className="space-y-3">
        <h3 className="px-1">구조화된 아이디어</h3>
        {sections.map((section) => {
          const Icon = section.icon;
          const content = data.structuredData[section.key as keyof typeof data.structuredData];
          return (
            <Card key={section.key} className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Icon className={`h-5 w-5 ${section.color}`} />
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2">
                    {section.label}
                  </Badge>
                  <p className="text-sm leading-relaxed">{content}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* PRD Preview */}
      <Card className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h3 className="mb-4">기획서 초안 (PRD)</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-muted-foreground">프로젝트명</h4>
            <p>{data.title}</p>
          </div>
          
          <div>
            <h4 className="mb-2 text-muted-foreground">목표</h4>
            <p className="text-sm">{data.structuredData.goal}</p>
          </div>
          
          <div>
            <h4 className="mb-2 text-muted-foreground">타겟 사용자</h4>
            <p className="text-sm">{data.structuredData.target}</p>
          </div>

          <div>
            <h4 className="mb-2 text-muted-foreground">핵심 기능</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>영양사 설계 식단 제공</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>정기 구독 시스템</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>식단 커스터마이징</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>배송 일정 관리</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <h3 className="px-1">내보내기 & 공유</h3>
        
        <Button
          variant="outline"
          className="w-full justify-start h-auto py-4"
          onClick={() => handleExport("Notion")}
        >
          <FileText className="h-5 w-5 mr-3" />
          Notion으로 보내기
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-4"
          onClick={() => handleExport("Google Docs")}
        >
          <FileText className="h-5 w-5 mr-3" />
          Google Docs로 보내기
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-4"
          onClick={() => {
            navigator.clipboard.writeText("기획서 내용...");
            toast.success("Markdown 형식으로 복사되었습니다");
          }}
        >
          <Copy className="h-5 w-5 mr-3" />
          Markdown 복사하기
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-4"
          onClick={() => handleExport("공유 링크")}
        >
          <Share2 className="h-5 w-5 mr-3" />
          공유 링크 생성
        </Button>
      </div>

      <Button
        variant="ghost"
        className="w-full h-auto py-3"
        onClick={onBack}
      >
        <Edit className="h-4 w-4 mr-2" />
        수정하기
      </Button>
    </div>
  );
}
