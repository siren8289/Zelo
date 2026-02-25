import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai";
import { safeJsonParse } from "@/lib/json";
import { OrganizeReq, OrganizeRes } from "@/lib/flow-b/schemas";
import { buildOrganizePrompt } from "@/lib/flow-b/prompts";

export async function POST(req: Request) {
  try {
    const body = OrganizeReq.parse(await req.json());
    const prompt = buildOrganizePrompt(body.raw_input);
    const text = await generateText(prompt);

    const json = safeJsonParse<unknown>(text);
    const parsed = OrganizeRes.parse(json);

    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "organize failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
