import { createClient } from "@supabase/supabase-js";

/**
 * 서버 전용. service_role 키는 절대 클라이언트에 노출하면 안 됨.
 */
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key
  );
}
