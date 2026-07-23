"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

type Mode = "idle" | "detect" | "swipe" | "reorder";

/** HTML5-drag props forwarded to the foreground for the desktop (mouse) reorder path. */
export interface RowDragProps {
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

/** Touch long-press reorder wiring, supplied by useDragReorder for reorderable rows. */
export interface RowReorder {
  onStart: (clientY: number) => void;
  onMove: (clientY: number) => void;
  onEnd: () => void;
  dragging: boolean;
  style?: CSSProperties;
}

const LONG_PRESS_MS = 350;

/**
 * A todo row supporting touch gestures: swipe right → onComplete, swipe left →
 * onDelete (colored reveal beneath), and — when `reorder` is provided — long-press
 * drag to reorder. Touch-only; mouse falls through to the HTML5 drag props / child
 * controls so the desktop experience is unchanged.
 */
export default function SwipeableRow({
  children,
  onComplete,
  onDelete,
  leaving,
  reorderable,
  dragProps,
  reorder,
}: {
  children: ReactNode;
  onComplete: () => void;
  onDelete: () => void;
  leaving?: boolean;
  reorderable?: boolean;
  dragProps?: RowDragProps;
  reorder?: RowReorder;
}) {
  const start = useRef({ x: 0, y: 0, t: 0 });
  const mode = useRef<Mode>("idle");
  const longPress = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dx, setDx] = useState(0);
  const [animating, setAnimating] = useState(false);

  function clearLongPress() {
    if (longPress.current) {
      clearTimeout(longPress.current);
      longPress.current = null;
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType !== "touch") return;
    start.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    mode.current = "detect";
    setAnimating(false);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    if (reorder) {
      const y = e.clientY;
      longPress.current = setTimeout(() => {
        if (mode.current === "detect") {
          mode.current = "reorder";
          reorder.onStart(y);
        }
      }, LONG_PRESS_MS);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (mode.current === "idle") return;
    if (mode.current === "reorder") {
      e.preventDefault();
      reorder?.onMove(e.clientY);
      return;
    }
    const ddx = e.clientX - start.current.x;
    const ddy = e.clientY - start.current.y;
    if (mode.current === "detect") {
      // Larger tolerance on reorderable rows so small finger jitter during the
      // long-press hold isn't mistaken for a scroll and doesn't abort the drag.
      const cancelThreshold = reorder ? 14 : 8;
      if (Math.abs(ddy) > Math.abs(ddx) && Math.abs(ddy) > cancelThreshold) {
        mode.current = "idle"; // vertical → let the page scroll
        clearLongPress();
        return;
      }
      if (Math.abs(ddx) > 12 && Math.abs(ddx) >= Math.abs(ddy)) {
        mode.current = "swipe";
        clearLongPress();
      } else {
        return;
      }
    }
    if (mode.current === "swipe") {
      e.preventDefault();
      setDx(ddx);
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    clearLongPress();
    if (mode.current === "reorder") {
      mode.current = "idle";
      reorder?.onEnd();
      return;
    }
    if (mode.current !== "swipe") {
      mode.current = "idle";
      return;
    }
    mode.current = "idle";
    const ddx = e.clientX - start.current.x;
    const width = e.currentTarget.getBoundingClientRect().width || 1;
    const velocity = Math.abs(ddx) / Math.max(e.timeStamp - start.current.t, 1);
    const commit = Math.abs(ddx) > 0.45 * width || velocity > 0.5;
    setAnimating(!prefersReducedMotion());
    setDx(0);
    if (commit) {
      if (ddx > 0) onComplete();
      else onDelete();
    }
  }

  const dir = dx > 0 ? 1 : dx < 0 ? -1 : 0;

  return (
    <li
      className={`relative overflow-hidden ${leaving ? "animate-row-out" : ""}`}
      style={reorder?.style}
    >
      {/* Reveal beneath the row: emerald+check for right (complete), rose+trash for left (delete). */}
      {dir !== 0 && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center px-5 text-white ${
            dir > 0 ? "justify-start bg-emerald-500" : "justify-end bg-rose-500"
          }`}
        >
          {dir > 0 ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5h6v2m-8 0v12a1 1 0 001 1h8a1 1 0 001-1V7" />
            </svg>
          )}
        </div>
      )}
      <div
        className={`relative flex items-center gap-3 bg-white py-3 dark:bg-zinc-950 ${
          reorderable ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        style={{
          transform: `translateX(${dx}px)`,
          transition: animating ? "transform var(--dur-base) var(--ease-out-quart)" : "none",
          touchAction: "pan-y",
          // On reorderable rows, disable text selection / iOS long-press callout up front
          // so the press-and-hold isn't hijacked by the OS before the drag starts.
          ...(reorderable
            ? {
                userSelect: "none",
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
              }
            : null),
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        {...dragProps}
      >
        {children}
      </div>
    </li>
  );
}
