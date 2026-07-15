import { Skeleton, SkeletonList, SkeletonText } from "./Skeleton";

type Variant = "dashboard" | "list" | "detail" | "stats";

function staggered(i: number) {
  return { "--stagger-i": i } as React.CSSProperties;
}

function CardBlock({ i, tall }: { i: number; tall?: boolean }) {
  return (
    <div
      className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
      style={staggered(i)}
    >
      <Skeleton className="mb-3 h-4 w-1/3" />
      <SkeletonText lines={tall ? 4 : 2} />
    </div>
  );
}

export default function PageSkeleton({ variant = "list" }: { variant?: Variant }) {
  if (variant === "dashboard") {
    return (
      <div className="stagger-children space-y-6">
        <div style={staggered(0)}>
          <Skeleton className="mb-2 h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <CardBlock i={1} tall />
        <CardBlock i={2} />
        <CardBlock i={3} />
        <div
          className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          style={staggered(4)}
        >
          <Skeleton className="mb-3 h-4 w-1/4" />
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 48 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "stats") {
    return (
      <div className="stagger-children space-y-6">
        <Skeleton className="h-7 w-40" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4" style={staggered(1)}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <Skeleton className="mb-2 h-3 w-2/3" />
              <Skeleton className="h-7 w-1/2" />
            </div>
          ))}
        </div>
        <CardBlock i={2} tall />
        <CardBlock i={3} />
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="stagger-children space-y-6">
        <div style={staggered(0)}>
          <Skeleton className="mb-2 h-7 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div style={staggered(1)}>
          <SkeletonText lines={4} />
        </div>
        <CardBlock i={2} tall />
        <CardBlock i={3} />
      </div>
    );
  }

  return (
    <div className="stagger-children space-y-6">
      <div className="flex items-center justify-between" style={staggered(0)}>
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <div style={staggered(1)}>
        <SkeletonList rows={6} />
      </div>
    </div>
  );
}
