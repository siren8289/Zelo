import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai";
import { safeJsonParse } from "@/lib/json";
import { PriorityReq, PriorityRes } from "@/lib/flow-b/schemas";
import { buildPriorityPrompt } from "@/lib/flow-b/prompts";

export async function POST(req: Request) {
  try {
    const body = PriorityReq.parse(await req.json());
    const prompt = buildPriorityPrompt(JSON.stringify(body.organized));
    const text = await generateText(prompt);

    const json = safeJsonParse<unknown>(text);
    const parsed = PriorityRes.parse(json);

    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "priority failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
