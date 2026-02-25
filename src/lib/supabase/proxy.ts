import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Server Components는 쿠키를 쓸 수 없어서,
 * middleware에서 세션을 갱신하고 쿠키를 브라우저/서버에 동기화합니다.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 서버 렌더링 중에도 최신 토큰을 쓰도록 request 쿠키도 업데이트
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // 브라우저에 내려줄 response 쿠키 업데이트
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: 세션 갱신을 위해 꼭 호출 (SSR 환경에서 유저가 랜덤 로그아웃되는 것 방지)
  await supabase.auth.getClaims();

  return supabaseResponse;
}

