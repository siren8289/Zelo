import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai";
import { safeJsonParse } from "@/lib/json";
import {
  GeneratePRDReq,
  GeneratePRDRes,
  buildGeneratePRDPrompt,
} from "@/lib/flow-planner/generate";

export async function POST(req: Request) {
  try {
    const body = GeneratePRDReq.parse(await req.json());
    const prompt = buildGeneratePRDPrompt({
      projectName: body.project_name,
      goal: body.goal,
      target: body.target,
      problem: body.problem,
      solution: body.solution,
    });
    const text = await generateText(prompt);

    const json = safeJsonParse<unknown>(text);
    const parsed = GeneratePRDRes.parse(json);

    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "generate-prd failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
