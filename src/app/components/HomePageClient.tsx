"use client";

import { useRouter } from "next/navigation";
import { HomePage } from "./HomePage";

export function HomePageClient() {
  const router = useRouter();
  const onNavigate = (tab: string) => {
    if (tab === "home") router.push("/");
    else router.push(`/${tab}`);
  };
  return <HomePage onNavigate={onNavigate} />;
}
