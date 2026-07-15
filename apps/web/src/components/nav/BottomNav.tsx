"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BOTTOM_NAV_ITEMS, NAV_ITEMS } from "./items";

export default function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  if (pathname === "/login") return null;

  const moreItems = NAV_ITEMS.filter(
    (item) => !BOTTOM_NAV_ITEMS.some((b) => b.href === item.href)
  );
  const moreActive = moreItems.some((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );

  return (
    <>
      {showMore && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setShowMore(false)}
        />
      )}
      {showMore && (
        <div className="animate-toast-in fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 mx-3 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg md:hidden dark:border-zinc-700 dark:bg-zinc-900">
          {moreItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMore(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  active
                    ? "font-semibold text-indigo-600 dark:text-indigo-400"
                    : "text-zinc-600 dark:text-zinc-300"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="flex justify-around pb-[env(safe-area-inset-bottom)]">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`pressable flex min-w-0 flex-col items-center gap-0.5 px-1 py-2 text-[10px] transition-colors duration-150 ${
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
          <button
            onClick={() => setShowMore(!showMore)}
            className={`pressable flex min-w-0 flex-col items-center gap-0.5 px-1 py-2 text-[10px] transition-colors duration-150 ${
              moreActive || showMore
                ? "font-semibold text-indigo-600 dark:text-indigo-400"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <span className="text-xl leading-none">•••</span>
            More
          </button>
        </div>
      </nav>
    </>
  );
}
