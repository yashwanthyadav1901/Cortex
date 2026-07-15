"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { NAV_ITEMS } from "./items";

export default function Sidebar() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-zinc-200 p-4 md:flex dark:border-zinc-800">
      <Link href="/" className="mb-8 px-2 text-xl font-bold tracking-tight">
        🧠 Cortex
      </Link>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`pressable flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                active
                  ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/login";
        }}
        className="mt-auto rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        Sign out
      </button>
    </aside>
  );
}
