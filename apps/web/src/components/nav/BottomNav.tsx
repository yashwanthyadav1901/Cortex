"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./items";

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="flex justify-around pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-col items-center gap-0.5 px-1 py-2 text-[10px] ${
                active
                  ? "font-semibold text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
