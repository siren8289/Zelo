import { z } from "zod";

const CATEGORIES = [
  "업무",
  "학업",
  "개발",
  "디자인",
  "문서",
  "회의",
  "연락",
  "개인",
  "기타",
] as const;

const STATUSES = ["not_started", "in_progress", "blocked", "done"] as const;
const ESTIMATED_TIMES = ["5m", "15m", "30m", "1h", "2h", "3h+", "unknown"] as const;

/** AI가 다른 표현으로 보낸 카테고리를 허용 목록으로 매핑 (없으면 기타) */
function normalizeCategory(v: unknown): (typeof CATEGORIES)[number] {
  const s = String(v ?? "").trim();
  const map: Record<string, (typeof CATEGORIES)[number]> = {
    미팅: "회의",
    이메일: "연락",
    메일: "연락",
    연락처: "연락",
    코딩: "개발",
    개발업무: "개발",
    업무정리: "업무",
  };
  const mapped = map[s] ?? (CATEGORIES.includes(s as any) ? s : "기타");
  return mapped as (typeof CATEGORIES)[number];
}

function normalizeStatus(v: unknown): (typeof STATUSES)[number] {
  const s = String(v ?? "").trim().toLowerCase();
  if (STATUSES.includes(s as any)) return s as (typeof STATUSES)[number];
  return "not_started";
}

function normalizeEstimatedTime(v: unknown): (typeof ESTIMATED_TIMES)[number] {
  const s = String(v ?? "").trim().toLowerCase();
  if (ESTIMATED_TIMES.includes(s as any)) return s as (typeof ESTIMATED_TIMES)[number];
  return "unknown";
}

export const OrganizeReq = z.object({
  raw_input: z.string().min(1),
});

export const OrganizedItem = z.object({
  category: z.union([z.enum(CATEGORIES), z.string()]).transform(normalizeCategory),
  content: z.string().min(1),
  status: z.union([z.enum(STATUSES), z.string()]).transform(normalizeStatus),
  estimated_time: z
    .union([z.enum(ESTIMATED_TIMES), z.string()])
    .transform(normalizeEstimatedTime),
  notes: z.string().nullable().optional(),
});

export const OrganizeRes = z.object({
  raw_input: z.string(),
  items: z.array(OrganizedItem).min(1).max(30),
});

export const PriorityReq = z.object({
  organized: OrganizeRes,
});

export const PriorityItem = z.object({
  item_index: z.number().int().min(0),
  priority_score: z.number().int().min(0).max(100),
  reason: z.string().max(120).optional().default(""),
});

export const PriorityRes = z.object({
  items: z.array(PriorityItem),
  ordered_indexes: z.array(z.number().int().min(0)),
});

export const SaveReq = z.object({
  raw_input: z.string().min(1),
  organized: OrganizeRes,
  priority: PriorityRes,
});

export type OrganizeResType = z.infer<typeof OrganizeRes>;
export type PriorityResType = z.infer<typeof PriorityRes>;
