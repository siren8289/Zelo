"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Copy,
  Target,
  Users,
  AlertCircle,
  Lightbulb,
  ChevronRight,
  Printer,
  Sparkles,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";

type Step = "form" | "preview" | "export";

const formSections = [
  { key: "goal", label: "프로젝트 목표", icon: Target, placeholder: "이 프로젝트로 달성하고자 하는 목표를 입력하세요" },
  { key: "target", label: "타겟 사용자", icon: Users, placeholder: "대상 사용자층을 설명하세요" },
  { key: "problem", label: "해결할 문제", icon: AlertCircle, placeholder: "어떤 문제를 해결하려는지 입력하세요" },
  { key: "solution", label: "해결 방안", icon: Lightbulb, placeholder: "제안하는 해결 방법을 입력하세요" },
] as const;

export function GeneralPRDFlow() {
  const [step, setStep] = useState<Step>("form");
  const [projectName, setProjectName] = useState("");
  const [formData, setFormData] = useState({
    goal: "",
    target: "",
    problem: "",
    solution: "",
  });

  /** AI가 작성한 기획서 (문단 다듬기 + 핵심 기능) */
  const [aiGenerated, setAiGenerated] = useState<{
    projectName?: string;
    goal: string;
    target: string;
    problem: string;
    solution: string;
    keyFeatures: string[];
  } | null>(null);
  const [isGeneratingPrd, setIsGeneratingPrd] = useState(false);

  const updateField = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = projectName.trim() && formData.goal.trim() && formData.target.trim();

  const handlePreview = () => {
    if (!canProceed) {
      toast.error("프로젝트명과 목표, 타겟 사용자를 입력해주세요");
      return;
    }
    setAiGenerated(null);
    setStep("preview");
  };

  const handleGenerateWithAI = async () => {
    setIsGeneratingPrd(true);
    setAiGenerated(null);
    try {
      const res = await fetch("/api/flow-planner/generate-prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectName.trim() || undefined,
          goal: formData.goal,
          target: formData.target,
          problem: formData.problem,
          solution: formData.solution,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "AI 기획서 생성 실패");
        return;
      }
      setAiGenerated({
        projectName: data.project_name?.trim(),
        goal: data.goal ?? formData.goal,
        target: data.target ?? formData.target,
        problem: data.problem ?? formData.problem,
        solution: data.solution ?? formData.solution,
        keyFeatures: data.key_features ?? [],
      });
      if (data.project_name?.trim()) {
        setProjectName((prev) => prev.trim() || data.project_name);
      }
      toast.success("AI가 기획서를 작성했습니다");
    } catch {
      toast.error("네트워크 오류");
    } finally {
      setIsGeneratingPrd(false);
    }
  };

  const displayTitle = aiGenerated?.projectName || projectName || "제목 없음";
  const displayGoal = aiGenerated?.goal ?? formData.goal;
  const displayTarget = aiGenerated?.target ?? formData.target;
  const displayProblem = aiGenerated?.problem ?? formData.problem;
  const displaySolution = aiGenerated?.solution ?? formData.solution;

  const getMarkdown = () => {
    const features = aiGenerated?.keyFeatures?.length
      ? "\n\n## 핵심 기능\n" + aiGenerated.keyFeatures.map((f) => `- ${f}`).join("\n")
      : "";
    return `# ${displayTitle}\n\n## 프로젝트 목표\n${displayGoal}\n\n## 타겟 사용자\n${displayTarget}\n\n## 해결할 문제\n${displayProblem}\n\n## 해결 방안\n${displaySolution}${features}`;
  };

  const handleDownloadMarkdown = () => {
    const name = (displayTitle || "기획서").replace(/[/\\?%*:|"]/g, "_").slice(0, 50);
    const blob = new Blob([getMarkdown()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown 파일이 다운로드되었습니다");
  };

  const handlePrint = () => {
    const md = getMarkdown();
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

  const copyAsMarkdown = () => {
    navigator.clipboard.writeText(getMarkdown());
    toast.success("클립보드에 복사되었습니다");
  };

  const handleCopyForNotion = () => {
    navigator.clipboard.writeText(getMarkdown());
    toast.success("내용을 복사했습니다. Notion에서 새 페이지를 만들고 붙여넣기(Ctrl+V) 하세요.");
    window.open("https://www.notion.so/new", "_blank");
  };

  const handleCopyForGoogleDocs = () => {
    navigator.clipboard.writeText(getMarkdown());
    toast.success("내용을 복사했습니다. Google Docs에서 새 문서를 만들고 붙여넣기(Ctrl+V) 하세요.");
    window.open("https://docs.google.com/document/create", "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center justify-between text-sm">
        {["작성", "미리보기", "내보내기"].map((label, index) => {
          const stepOrder: Step[] = ["form", "preview", "export"];
          const currentIndex = stepOrder.indexOf(step);
          const isActive = index <= currentIndex;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <span className={isActive ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              {index < 2 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Form */}
      {step === "form" && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h3>일반 PRD 기획서</h3>
                <p className="text-sm text-muted-foreground">
                  항목을 직접 입력해 기획서를 작성하세요
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">프로젝트명</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="예: 건강 도시락 구독 서비스"
                  className="mt-2"
                />
              </div>

              {formSections.map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key}>
                  <Label className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </Label>
                  <Textarea
                    value={formData[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder={placeholder}
                    className="min-h-[100px] mt-1"
                  />
                </div>
              ))}
            </div>

            <Button onClick={handlePreview} disabled={!canProceed} size="lg" className="w-full mt-6">
              미리보기
            </Button>
          </Card>
        </div>
      )}

      {/* Step 2: Preview */}
      {step === "preview" && (
        <div className="space-y-4">
          <Card className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <h3>기획서 미리보기 (일반 PRD)</h3>
                <p className="text-sm text-muted-foreground">
                  {aiGenerated ? "AI가 작성한 기획서입니다" : "입력하신 내용으로 작성된 기획서입니다"}
                </p>
              </div>
            </div>
          </Card>

          {!aiGenerated && (
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={handleGenerateWithAI}
              disabled={isGeneratingPrd}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {isGeneratingPrd ? "AI가 기획서 작성 중..." : "AI가 기획서 작성"}
            </Button>
          )}

          <Card className="p-5">
            <h4 className="mb-3">프로젝트 개요</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">프로젝트명:</span>
                <p className="mt-1">{displayTitle}</p>
              </div>
              <div>
                <span className="text-muted-foreground">목표:</span>
                <p className="mt-1 whitespace-pre-wrap">{displayGoal || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">타겟 사용자:</span>
                <p className="mt-1 whitespace-pre-wrap">{displayTarget || "—"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="mb-3">문제 & 해결</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">해결할 문제:</span>
                <p className="mt-1 whitespace-pre-wrap">{displayProblem || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">해결 방안:</span>
                <p className="mt-1 whitespace-pre-wrap">{displaySolution || "—"}</p>
              </div>
            </div>
          </Card>

          {aiGenerated?.keyFeatures?.length ? (
            <Card className="p-5">
              <h4 className="mb-3">핵심 기능</h4>
              <ul className="space-y-2 text-sm">
                {aiGenerated.keyFeatures.map((feature, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={() => setStep("form")}>
              수정하기
            </Button>
            <Button size="lg" onClick={() => setStep("export")}>
              내보내기
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Export */}
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
              onClick={copyAsMarkdown}
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
              setStep("form");
              setProjectName("");
              setFormData({ goal: "", target: "", problem: "", solution: "" });
              setAiGenerated(null);
              toast.success("새 기획서를 작성하세요");
            }}
          >
            새 PRD 작성하기
          </Button>
        </div>
      )}
    </div>
  );
}
