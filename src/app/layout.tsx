import type { Metadata } from "next";
import "@/app/globals.css";
import { SiteHeader } from "@/app/components/SiteHeader";
import { AppToaster } from "@/app/components/AppToaster";

export const metadata: Metadata = {
  title: "Create Moodboard Images",
  description: "Zelo - 내 업무 자동화 AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background" suppressHydrationWarning>
        <AppToaster />
        <SiteHeader />
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
