import { NextResponse } from "next/server";
import { SaveReq } from "@/lib/flow-b/schemas";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = SaveReq.parse(await req.json());

    const sb = await supabaseServer();
    const { data: userData, error: userErr } = await sb.auth.getUser();
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const userId = userData.user.id;

    const priorityByIndex = new Map(
      body.priority.items.map((p) => [p.item_index, p])
    );

    const itemsToInsert = body.organized.items.map((it, idx) => {
      const p = priorityByIndex.get(idx);
      return {
        category: it.category,
        content: it.content,
        priority_score: p?.priority_score ?? 0,
        reason: p?.reason ?? null,
        estimated_time: it.estimated_time,
        status: it.status,
      };
    });

    const admin = supabaseAdmin();

    const { data: taskRow, error: taskErr } = await admin
      .from("tasks")
      .insert({
        user_id: userId,
        raw_input: body.raw_input,
        parsed_json: body.organized,
        priority_json: body.priority,
        exported_to: null,
        is_shared: false,
        shared_link: null,
      })
      .select("id")
      .single();

    if (taskErr) throw taskErr;

    const { error: itemsErr } = await admin.from("task_items").insert(
      itemsToInsert.map((x) => ({
        ...x,
        task_id: taskRow.id,
      }))
    );

    if (itemsErr) throw itemsErr;

    return NextResponse.json({ ok: true, task_id: taskRow.id });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "save failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
