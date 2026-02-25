"use client";
import { useState } from "react";
import {
  Target,
  Users,
  AlertCircle,
  Lightbulb,
  FileText,
  Download,
  Copy,
  ChevronRight,
  PenLine,
  Printer,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

type FlowStep = "input" | "structured" | "prd" | "export";

const manualFormSections = [
  { key: "goal", label: "프로젝트 목표", icon: Target, placeholder: "이 프로젝트로 달성하고자 하는 목표를 입력하세요" },
  { key: "target", label: "타겟 사용자", icon: Users, placeholder: "대상 사용자층을 설명하세요" },
  { key: "problem", label: "해결할 문제", icon: AlertCircle, placeholder: "어떤 문제를 해결하려는지 입력하세요" },
  { key: "solution", label: "해결 방안", icon: Lightbulb, placeholder: "제안하는 해결 방법을 입력하세요" },
] as const;

export function AIPlannerFlow() {
  const [step, setStep] = useState<FlowStep>("input");
  const [projectName, setProjectName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [structuredData, setStructuredData] = useState({
    goal: "",
    target: "",
    problem: "",
    solution: "",
  });

  /** AI가 작성한 기획서 전체 (직접 입력/구조화 내용을 바탕으로 AI가 문단 작성) */
  const [prdGenerated, setPrdGenerated] = useState<{
    projectName?: string;
    goal: string;
    target: string;
    problem: string;
    solution: string;
    keyFeatures: string[];
  } | null>(null);

  const updateStructuredField = (key: keyof typeof structuredData, value: string) => {
    setStructuredData((prev) => ({ ...prev, [key]: value }));
  };

  const canProceedManual = projectName.trim() && structuredData.goal.trim() && structuredData.target.trim();

  const handleManualNext = () => {
    if (!canProceedManual) {
      toast.error("프로젝트명과 목표, 타겟 사용자를 입력해주세요");
      return;
    }
    setStep("structured");
    toast.success("항목이 반영되었습니다. 기획서로 만들기를 진행하세요.");
  };

  const handleGeneratePRD = async () => {
    setIsProcessing(true);
    setPrdGenerated(null);
    try {
      const res = await fetch("/api/flow-planner/generate-prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectName.trim() || undefined,
          goal: structuredData.goal,
          target: structuredData.target,
          problem: structuredData.problem,
          solution: structuredData.solution,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "기획서 생성 실패");
        return;
      }
      setPrdGenerated({
        projectName: data.project_name?.trim(),
        goal: data.goal ?? structuredData.goal,
        target: data.target ?? structuredData.target,
        problem: data.problem ?? structuredData.problem,
        solution: data.solution ?? structuredData.solution,
        keyFeatures: data.key_features ?? [],
      });
      if (data.project_name?.trim()) {
        setProjectName((prev) => prev.trim() || data.project_name);
      }
      setStep("prd");
      toast.success("기획서가 생성되었습니다!");
    } catch {
      toast.error("네트워크 오류");
    } finally {
      setIsProcessing(false);
    }
  };

  const getPrdMarkdown = () => {
    const title = prdGenerated?.projectName || projectName.trim() || "제목 없음";
    const goal = prdGenerated?.goal ?? structuredData.goal;
    const target = prdGenerated?.target ?? structuredData.target;
    const problem = prdGenerated?.problem ?? structuredData.problem;
    const solution = prdGenerated?.solution ?? structuredData.solution;
    const features = prdGenerated?.keyFeatures?.length
      ? "\n\n## 핵심 기능\n" + prdGenerated.keyFeatures.map((f) => `- ${f}`).join("\n")
      : "";
    return `# ${title}\n\n## 프로젝트 목표\n${goal}\n\n## 타겟 사용자\n${target}\n\n## 해결할 문제\n${problem}\n\n## 해결 방안\n${solution}${features}`;
  };

  const handleDownloadMarkdown = () => {
    const title = (prdGenerated?.projectName || projectName.trim() || "기획서").replace(/[/\\?%*:|"]/g, "_").slice(0, 50);
    const blob = new Blob([getPrdMarkdown()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown 파일이 다운로드되었습니다");
  };

  const handlePrint = () => {
    const md = getPrdMarkdown();
    const win = window.open("", "_blank");
    if (!win) {
      toast.error("팝업이 차단되었습니다. 허용 후 다시 시도하세요.");
      return;
    }
    win.document.write(`
      <!DOCTYPE html><html><head><meta charset="utf-8"><title>기획서</title>
      <style>body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;line-height:1.6;white-space:pre-wrap;}</style></head>
      <body><pre>${md.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
    toast.success("인쇄 대화상자를 엽니다. PDF로 저장하려면 대상에서 ‘PDF로 저장’을 선택하세요.");
  };

  const handleCopyForNotion = () => {
    navigator.clipboard.writeText(getPrdMarkdown());
    toast.success("내용을 복사했습니다. Notion에서 새 페이지를 만들고 붙여넣기(Ctrl+V) 하세요.");
    window.open("https://www.notion.so/new", "_blank");
  };

  const handleCopyForGoogleDocs = () => {
    navigator.clipboard.writeText(getPrdMarkdown());
    toast.success("내용을 복사했습니다. Google Docs에서 새 문서를 만들고 붙여넣기(Ctrl+V) 하세요.");
    window.open("https://docs.google.com/document/create", "_blank");
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
              <PenLine className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3>항목 직접 입력</h3>
              <p className="text-sm text-muted-foreground">
                프로젝트명과 목표·타겟·문제·해결방안을 입력하면, AI가 기획서를 작성합니다
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="ai-projectName">프로젝트명</Label>
              <Input
                id="ai-projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="예: 건강 도시락 구독 서비스"
                className="mt-2"
              />
            </div>

            {manualFormSections.map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key}>
                <Label className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </Label>
                <Textarea
                  value={structuredData[key]}
                  onChange={(e) => updateStructuredField(key, e.target.value)}
                  placeholder={placeholder}
                  className="min-h-[100px] mt-1"
                />
              </div>
            ))}

            <Button
              onClick={handleManualNext}
              disabled={!canProceedManual}
              size="lg"
              className="w-full"
            >
              다음 (구조화 결과 보기)
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Structured Data */}
      {step === "structured" && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3>구조화 결과</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep("input")}>
                수정
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              아래 내용을 확인하고 기획서로 만들기를 진행하세요
            </p>
            {projectName.trim() && (
              <p className="text-sm font-medium mb-2">프로젝트: {projectName}</p>
            )}
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
            {isProcessing ? "AI가 기획서 작성 중..." : "기획서로 만들기"}
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
                  AI가 직접 입력하신 항목을 바탕으로 작성한 기획서입니다
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="mb-3">프로젝트 개요</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">프로젝트명:</span>
                <p className="mt-1">{prdGenerated?.projectName || projectName.trim() || "제목 없음"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">목표:</span>
                <p className="mt-1 whitespace-pre-wrap">{prdGenerated?.goal ?? structuredData.goal || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">타겟 사용자:</span>
                <p className="mt-1 whitespace-pre-wrap">{prdGenerated?.target ?? structuredData.target || "—"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="mb-3">문제 & 해결</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">해결할 문제:</span>
                <p className="mt-1 whitespace-pre-wrap">{prdGenerated?.problem ?? structuredData.problem || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">해결 방안:</span>
                <p className="mt-1 whitespace-pre-wrap">{prdGenerated?.solution ?? structuredData.solution || "—"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="mb-3">핵심 기능</h4>
            {prdGenerated?.keyFeatures?.length ? (
              <ul className="space-y-2 text-sm">
                {prdGenerated.keyFeatures.map((feature, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">핵심 기능을 생성 중이거나 없습니다.</p>
            )}
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
              onClick={handleDownloadMarkdown}
            >
              <Download className="h-5 w-5 mr-3" />
              Markdown 파일로 저장 (.md)
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              onClick={handlePrint}
            >
              <Printer className="h-5 w-5 mr-3" />
              인쇄 / PDF로 저장
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              onClick={() => {
                navigator.clipboard.writeText(getPrdMarkdown());
                toast.success("클립보드에 복사되었습니다");
              }}
            >
              <Copy className="h-5 w-5 mr-3" />
              Markdown 복사하기
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              onClick={handleCopyForNotion}
            >
              <FileText className="h-5 w-5 mr-3" />
              Notion에 붙여넣기
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              onClick={handleCopyForGoogleDocs}
            >
              <FileText className="h-5 w-5 mr-3" />
              Google Docs에 붙여넣기
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full h-auto py-3"
            onClick={() => {
              setStep("input");
              setIdea("");
              setProjectName("");
              setStructuredData({ goal: "", target: "", problem: "", solution: "" });
              setPrdGenerated(null);
              toast.success("새 기획서를 시작하세요");
            }}
          >
            새 기획서 시작하기
          </Button>
        </div>
      )}
    </div>
  );
}