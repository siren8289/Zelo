"use client";
import { useState } from "react";
import {
  Sparkles,
  Target,
  Users,
  AlertCircle,
  Lightbulb,
  FileText,
  Download,
  Share2,
  Copy,
  ChevronRight,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

type FlowStep = "input" | "structured" | "prd" | "export";

export function AIPlannerFlow() {
  const [step, setStep] = useState<FlowStep>("input");
  const [idea, setIdea] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [structuredData, setStructuredData] = useState({
    goal: "",
    target: "",
    problem: "",
    solution: "",
  });

  const handleAnalyze = () => {
    if (!idea.trim()) {
      toast.error("아이디어를 입력해주세요");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate AI processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setStructuredData({
            goal: "건강한 식습관을 원하는 직장인들에게 편리한 도시락 서비스 제공",
            target: "20-40대 직장인, 특히 건강 관리에 관심이 높은 사용자",
            problem: "바쁜 일상 속에서 건강한 식사를 준비하기 어렵고, 배달 음식은 건강하지 않음",
            solution: "영양사가 설계한 건강 도시락을 정기 구독으로 제공하여 편의성과 건강을 동시에 해결",
          });
          setStep("structured");
          toast.success("아이디어 분석이 완료되었습니다!");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleGeneratePRD = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("prd");
      toast.success("기획서가 생성되었습니다!");
    }, 1500);
  };

  const handleExport = (type: string) => {
    toast.success(`${type}로 내보내기 준비 중입니다`, {
      description: "곧 지원될 예정입니다",
    });
  };

  const sections = [
    { key: "goal", label: "목표", icon: Target, color: "text-primary" },
    { key: "target", label: "타겟", icon: Users, color: "text-secondary" },
    { key: "problem", label: "문제", icon: AlertCircle, color: "text-destructive" },
    { key: "solution", label: "해결책", icon: Lightbulb, color: "text-primary" },
  ];

  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {["입력", "구조화", "기획서", "내보내기"].map((label, index) => {
            const stepIndex = ["input", "structured", "prd", "export"].indexOf(step);
            const isActive = index <= stepIndex;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <span className={isActive ? "text-foreground" : "text-muted-foreground"}>
                  {label}
                </span>
                {index < 3 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Input */}
      {step === "input" && (
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3>아이디어를 입력하세요</h3>
              <p className="text-sm text-muted-foreground">
                자유롭게 작성해주세요 (최대 5,000자)
              </p>
            </div>
          </div>

          <Textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="예: 배달 없는 건강 도시락 구독 서비스를 만들고 싶어요. 직장인들을 위한 영양가 있는 식단을 제공하려고 합니다..."
            className="min-h-[200px] mb-4"
            maxLength={5000}
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {idea.length} / 5,000자
            </span>
            <Button onClick={handleAnalyze} disabled={isProcessing || !idea.trim()} size="lg">
              {isProcessing ? "분석 중..." : "AI 분석 시작"}
            </Button>
          </div>

          {isProcessing && (
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </Card>
      )}

      {/* Step 2: Structured Data */}
      {step === "structured" && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3>AI 구조화 결과</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep("input")}>
                수정
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              AI가 아이디어를 4가지 영역으로 분류했습니다
            </p>
          </Card>

          {sections.map((section) => {
            const Icon = section.icon;
            const content = structuredData[section.key as keyof typeof structuredData];
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

          <Button
            onClick={handleGeneratePRD}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? "생성 중..." : "기획서로 만들기"}
          </Button>
        </div>
      )}

      {/* Step 3: PRD Preview */}
      {step === "prd" && (
        <div className="space-y-4">
          <Card className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <h3>기획서 초안</h3>
                <p className="text-sm text-muted-foreground">
                  AI가 생성한 PRD 문서입니다
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="mb-3">프로젝트 개요</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">프로젝트명:</span>
                <p className="mt-1">건강 도시락 구독 서비스</p>
              </div>
              <div>
                <span className="text-muted-foreground">목표:</span>
                <p className="mt-1">{structuredData.goal}</p>
              </div>
              <div>
                <span className="text-muted-foreground">타겟 사용자:</span>
                <p className="mt-1">{structuredData.target}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="mb-3">핵심 기능</h4>
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
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={() => setStep("structured")}>
              수정하기
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
              기획서를 다양한 형식으로 저장하거나 공유하세요
            </p>
          </Card>

          <div className="space-y-3">
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
            onClick={() => {
              setStep("input");
              setIdea("");
              toast.success("새 아이디어를 시작하세요");
            }}
          >
            새 아이디어 시작하기
          </Button>
        </div>
      )}
    </div>
  );
}