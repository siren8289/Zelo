import { z } from "zod";

export const GeneratePRDReq = z.object({
  project_name: z.string().optional(),
  goal: z.string(),
  target: z.string(),
  problem: z.string(),
  solution: z.string(),
});

export const GeneratePRDRes = z.object({
  project_name: z.string().optional(),
  goal: z.string().optional(),
  target: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  key_features: z.array(z.string()).min(1).max(20),
});

export function buildGeneratePRDPrompt(params: {
  projectName?: string;
  goal: string;
  target: string;
  problem: string;
  solution: string;
}) {
  const { projectName, goal, target, problem, solution } = params;
  return `
너는 기획서(PRD) 작성 엔진이다.
사용자가 직접 입력한 기획 개요를 바탕으로, 기획서 본문 전체를 대신 작성한다.
반드시 유효한 JSON만 출력한다. 마크다운/설명/코드블록 금지.

규칙:
- goal: 사용자 목표를 바탕으로 "프로젝트 목표" 문단을 2~4문장으로 다듬어 쓴다.
- target: 사용자 타겟을 바탕으로 "타겟 사용자" 문단을 2~4문장으로 다듬어 쓴다.
- problem: 사용자 문제를 바탕으로 "해결할 문제" 문단을 2~4문장으로 다듬어 쓴다.
- solution: 사용자 해결방안을 바탕으로 "해결 방안" 문단을 2~4문장으로 다듬어 쓴다.
- key_features: 이 서비스/제품의 핵심 기능 5~12개를 한글으로 나열 (각 1줄, "~하기", "~제공" 등).
- project_name: 비어 있으면 프로젝트 성격에 맞는 이름을 제안한다. 있으면 그대로 반환한다.
- 모든 필드는 한글로, 기획서에 그대로 넣을 수 있는 완성된 문장으로 쓴다.

스키마:
{ "project_name": string, "goal": string, "target": string, "problem": string, "solution": string, "key_features": string[] }

입력(사용자가 직접 입력한 기획 개요):
프로젝트명: ${projectName || "(비어 있음)"}
목표: ${goal}
타겟: ${target}
문제: ${problem}
해결방안: ${solution}
`.trim();
}

