"use client";

import { useRouter } from "next/navigation";
import { HomePage } from "@/app/components/HomePage";

export default function Page() {
  const router = useRouter();
  const onNavigate = (tab: string) => {
    if (tab === "home") router.push("/");
    else router.push(`/${tab}`);
  };
  return <HomePage onNavigate={onNavigate} />;
}
