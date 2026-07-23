import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ApiErrorToast from "@/components/ApiErrorToast";
import CommandPalette from "@/components/CommandPalette";
import AuthGuard from "@/components/AuthGuard";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/nav/BottomNav";
import Sidebar from "@/components/nav/Sidebar";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cortex",
  description: "Personal learning ops — System Design, AI, DSA",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Providers>
          <AuthGuard>
            <div className="flex">
              <Sidebar />
              <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-6 pb-24 md:px-8 md:pb-10">
                <PageTransition>{children}</PageTransition>
              </main>
            </div>
            <BottomNav />
            <ApiErrorToast />
            <CommandPalette />
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
