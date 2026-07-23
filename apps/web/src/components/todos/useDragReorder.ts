"use client";

import { useRef, useState, type CSSProperties } from "react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

interface DragState {
  from: number;
  to: number;
  dy: number;
}

/**
 * Touch long-press drag-to-reorder for a vertical list. The list `<ul>` gets
 * `listRef`; each row calls begin/move/end (SwipeableRow does this on long-press)
 * and applies `rowStyle(index)`. Row rects are measured at drag start, so heights
 * may vary. Commit calls `onReorder` with the new id order.
 */
export function useDragReorder(
  ids: string[],
  onReorder: (orderedIds: string[]) => void
) {
  const listRef = useRef<HTMLUListElement>(null);
  const rects = useRef<DOMRect[]>([]);
  const startY = useRef(0);
  // Mirror drag state in a ref so `end()` can commit without calling the parent's
  // setState from inside a setState updater (which React flags as update-in-render).
  const dragRef = useRef<DragState | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  function begin(index: number, clientY: number) {
    const lis = listRef.current
      ? [...listRef.current.querySelectorAll<HTMLLIElement>(":scope > li")]
      : [];
    rects.current = lis.map((li) => li.getBoundingClientRect());
    startY.current = clientY;
    dragRef.current = { from: index, to: index, dy: 0 };
    setDrag(dragRef.current);
  }

  function move(clientY: number) {
    const d = dragRef.current;
    if (!d) return;
    let to = 0;
    for (let i = 0; i < rects.current.length; i++) {
      const r = rects.current[i];
      if (clientY > r.top + r.height / 2) to = i;
    }
    dragRef.current = { ...d, dy: clientY - startY.current, to };
    setDrag(dragRef.current);
  }

  function end() {
    const d = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (d && d.to !== d.from) {
      const order = [...ids];
      const [moved] = order.splice(d.from, 1);
      order.splice(d.to, 0, moved);
      onReorder(order);
    }
  }

  function rowStyle(index: number): CSSProperties {
    if (!drag) return {};
    const animate = !prefersReducedMotion();
    if (index === drag.from) {
      return {
        transform: `translateY(${drag.dy}px) scale(1.02)`,
        zIndex: 10,
        position: "relative",
        boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
        transition: "none",
      };
    }
    const h = rects.current[drag.from]?.height ?? 0;
    let shift = 0;
    if (drag.from < drag.to && index > drag.from && index <= drag.to) shift = -h;
    else if (drag.from > drag.to && index < drag.from && index >= drag.to) shift = h;
    return {
      transform: `translateY(${shift}px)`,
      transition: animate ? "transform 150ms ease" : "none",
    };
  }

  return { listRef, drag, begin, move, end, rowStyle };
}
