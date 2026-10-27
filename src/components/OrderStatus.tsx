import { CheckCircle2, Circle, Clock3, Home, PackageCheck, Truck, XCircle } from "lucide-react";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

export const statusMeta: Record<
  OrderStatus,
  { label: string; short: string; className: string; icon: typeof Circle }
> = {
  PLACED: { label: "Order placed", short: "Placed", className: "bg-amber-50 text-amber-700 ring-amber-200", icon: Clock3 },
  PACKED: { label: "Packed", short: "Packed", className: "bg-sky-50 text-sky-700 ring-sky-200", icon: PackageCheck },
  OUT_FOR_DELIVERY: { label: "Out for delivery", short: "On the way", className: "bg-violet-50 text-violet-700 ring-violet-200", icon: Truck },
  DELIVERED: { label: "Delivered", short: "Delivered", className: "bg-apollo-50 text-apollo-700 ring-apollo-200", icon: Home },
  CANCELLED: { label: "Cancelled", short: "Cancelled", className: "bg-coral-50 text-coral-700 ring-coral-200", icon: XCircle },
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const meta = statusMeta[status] ?? statusMeta.PLACED;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ring-1", meta.className, className)}>
      <meta.icon size={10} />
      {meta.short}
    </span>
  );
}

const flow: OrderStatus[] = ["PLACED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED"];
export const statusFlow = flow;

export function StatusTimeline({ status, timeline }: { status: OrderStatus; timeline?: { status: OrderStatus; at: string; note?: string }[] }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-coral-50 px-3 py-2.5 text-[10.5px] font-medium text-coral-700 ring-1 ring-coral-100">
        <XCircle size={15} /> This order was cancelled. Contact the store if you need help with a refund.
      </div>
    );
  }

  const currentIndex = Math.max(0, flow.indexOf(status));

  return (
    <div>
      <div className="grid grid-cols-4 gap-1">
        {flow.map((step, index) => {
          const meta = statusMeta[step];
          const done = index <= currentIndex;
          const active = index === currentIndex;
          return (
            <div key={step} className="relative flex flex-col items-center">
              {index > 0 ? (
                <span className={cn("absolute right-1/2 top-3.5 h-0.5 w-full", index <= currentIndex ? "bg-apollo-500" : "bg-line")} />
              ) : null}
              <span
                className={cn(
                  "relative z-10 grid h-7 w-7 place-items-center rounded-full border-2 bg-white",
                  done ? "border-apollo-600 text-apollo-700" : "border-line text-muted",
                  active && "ring-4 ring-apollo-100",
                )}
              >
                {done ? <meta.icon size={13} /> : <Circle size={10} />}
              </span>
              <span className={cn("mt-1 text-center text-[8.5px] font-semibold leading-tight", done ? "text-apollo-800" : "text-muted")}>
                {meta.short}
              </span>
            </div>
          );
        })}
      </div>
      {timeline?.length ? (
        <div className="mt-3 space-y-1 border-t border-dashed border-line pt-2">
          {timeline.map((item, index) => (
            <p key={`${item.status}-${index}`} className="flex items-center justify-between text-[9px] text-muted">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={10} className="text-apollo-500" />
                {statusMeta[item.status]?.label ?? item.status}
                {item.note ? <span className="text-muted/70">· {item.note}</span> : null}
              </span>
              <span>{formatDate(item.at, true)}</span>
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
