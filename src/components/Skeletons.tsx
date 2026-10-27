import { cn } from "@/lib/utils";

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line bg-white", className)}>
      <div className="m-2 mb-0 aspect-[1.06] animate-pulse rounded-xl bg-neutral-100" />
      <div className="space-y-2 p-3">
        <div className="h-2 w-12 animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
        <div className="h-8 w-full animate-pulse rounded-lg bg-neutral-100" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="grid min-h-[45vh] place-items-center">
      <div className="flex flex-col items-center gap-3">
        <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-apollo-700">
          <span className="absolute inset-0 animate-ping rounded-2xl bg-apollo-400 opacity-20" />
          <span className="h-5 w-5 rounded bg-white/90" style={{ clipPath: "polygon(35% 0,65% 0,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0 65%,0 35%,35% 35%)" }} />
        </span>
        <p className="text-[11px] font-semibold text-muted">Loading City Pharmacy…</p>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-neutral-100" />
      ))}
    </div>
  );
}
