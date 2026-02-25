import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const sb = await supabaseServer();
    const { data: userData, error: userErr } = await sb.auth.getUser();
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from("tasks")
      .select("id, raw_input, created_at")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) throw error;

    const tasks = (data ?? []).map((t: { id: string; raw_input: string; created_at: string }) => ({
      id: t.id,
      type: "tasks" as const,
      title: t.raw_input?.slice(0, 30)?.trim() || "제목 없음",
      date: formatRelativeTime(t.created_at),
      preview: t.raw_input?.slice(0, 60)?.trim() || "",
    }));

    return NextResponse.json({ tasks });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "list failed";
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
