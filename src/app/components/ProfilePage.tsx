"use client";

import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

export function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
          U
        </div>
        <h2 className="text-xl font-semibold mb-1">사용자</h2>
        <p className="text-sm text-muted-foreground">user@example.com</p>
      </div>

      <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Button
          variant="outline"
          className="w-full justify-start h-auto py-5"
          onClick={() => toast.info("Google 로그인 기능 준비 중")}
        >
          <div className="text-left">
            <div className="font-medium mb-1">Google 계정 연동</div>
            <div className="text-xs text-muted-foreground">
              Google Docs 내보내기
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-5"
          onClick={() => toast.info("Kakao 로그인 기능 준비 중")}
        >
          <div className="text-left">
            <div className="font-medium mb-1">Kakao 계정 연동</div>
            <div className="text-xs text-muted-foreground">간편 로그인</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-5"
          onClick={() => toast.info("Notion 연동 기능 준비 중")}
        >
          <div className="text-left">
            <div className="font-medium mb-1">Notion 연동</div>
            <div className="text-xs text-muted-foreground">바로 내보내기</div>
          </div>
        </Button>
      </div>

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
