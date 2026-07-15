import { ViewTransition } from "react";

// Cross-fades page content on route navigations via the native View
// Transitions API (no-op in unsupported browsers). Timing lives in
// globals.css under ::view-transition-old/new(root).
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ViewTransition default="page-fade">{children}</ViewTransition>;
}
