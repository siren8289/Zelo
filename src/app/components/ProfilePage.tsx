"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";

export function ProfilePage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) return;
        setUserEmail(data.user?.email ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setUserEmail(null);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const initial = (userEmail?.[0] ?? "U").toUpperCase();

  const signIn = async () => {
    if (!email.trim() || !password) {
      toast.error("이메일과 비밀번호를 입력해주세요");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("로그인되었습니다");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    if (!email.trim() || !password) {
      toast.error("이메일과 비밀번호를 입력해주세요");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("회원가입 요청이 완료되었습니다", {
        description: "이메일 인증이 켜져 있으면 메일함에서 확인해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("로그아웃되었습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
          {initial}
        </div>
        <h2 className="text-xl font-semibold mb-1">
          {userEmail ? "로그인됨" : "로그인 필요"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {userEmail ?? "저장/히스토리를 쓰려면 로그인하세요"}
        </p>
      </div>

      {!userEmail ? (
        <Card className="p-5 space-y-4">
          <div>
            <Label htmlFor="login-email">이메일</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              className="mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="login-password">비밀번호</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              className="mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={signIn} disabled={loading}>
              {loading ? "처리 중..." : "로그인"}
            </Button>
            <Button variant="outline" onClick={signUp} disabled={loading}>
              {loading ? "처리 중..." : "회원가입"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supabase Auth 설정에서 이메일 인증이 켜져 있으면, 회원가입 후 메일함에서 확인해야 로그인됩니다.
          </p>
        </Card>
      ) : (
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">계정</div>
              <div className="text-sm text-muted-foreground">{userEmail}</div>
            </div>
            <Button variant="outline" onClick={signOut} disabled={loading}>
              {loading ? "처리 중..." : "로그아웃"}
            </Button>
          </div>
        </Card>
      )}

      <div className="pt-4 border-t border-border">
        <h3 className="text-lg font-semibold mb-3">설정</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start py-3 h-auto">
            알림 설정
          </Button>
          <Button variant="ghost" className="w-full justify-start py-3 h-auto">
            데이터 관리
          </Button>
          <Button variant="ghost" className="w-full justify-start py-3 h-auto">
            앱 정보
          </Button>
        </div>
      </div>

      <div className="pt-4 text-center text-sm text-muted-foreground">
        <p>버전 1.0.0</p>
        <p className="mt-1">© 2026 Zelo</p>
      </div>
    </div>
  );
}
