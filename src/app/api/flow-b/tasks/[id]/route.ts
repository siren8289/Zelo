import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sb = await supabaseServer();
    const { data: userData, error: userErr } = await sb.auth.getUser();
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const admin = supabaseAdmin();
    const { data: task, error: taskErr } = await admin
      .from("tasks")
      .select("id, raw_input, created_at, parsed_json, priority_json")
      .eq("id", id)
      .eq("user_id", userData.user.id)
      .single();

    if (taskErr || !task) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const { data: items } = await admin
      .from("task_items")
      .select("content, category, priority_score, reason, status")
      .eq("task_id", id)
      .order("priority_score", { ascending: false });

    const tasks = (items ?? []).map((it: { content: string; category: string; priority_score: number; reason: string; status: string }, idx: number) => ({
      id: String(idx),
      title: it.content,
      category: it.category,
      priority: it.priority_score,
      urgency: it.priority_score >= 80 ? "긴급" : it.priority_score >= 50 ? "중요" : "보통",
      reason: it.reason ?? "",
      completed: it.status === "done",
    }));

    const title = task.raw_input?.slice(0, 30)?.trim() || "제목 없음";
    const date = formatRelativeTime(task.created_at);

    return NextResponse.json({
      id: task.id,
      title,
      date,
      tasks,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "fetch failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffM = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffM < 60) return `${diffM}분 전`;
  if (diffH < 24) return `${diffH}시간 전`;
  if (diffD < 7) return `${diffD}일 전`;
  return d.toLocaleDateString("ko-KR");
}
