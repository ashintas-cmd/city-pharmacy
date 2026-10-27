import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  size = "md",
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const buttonSize =
    size === "sm" ? "h-6 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-apollo-300 bg-white text-apollo-800",
        size === "sm" ? "h-8" : size === "lg" ? "h-12" : "h-10",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min - 1, value - 1))}
        className={cn("grid place-items-center rounded-l-lg transition hover:bg-apollo-50", buttonSize)}
        aria-label="Decrease quantity"
      >
        <Minus size={size === "lg" ? 16 : 13} strokeWidth={2.6} />
      </button>
      <span className={cn("min-w-7 text-center font-bold", textSize)}>{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn("grid place-items-center rounded-r-lg transition hover:bg-apollo-50 disabled:opacity-40", buttonSize)}
        aria-label="Increase quantity"
      >
        <Plus size={size === "lg" ? 16 : 13} strokeWidth={2.6} />
      </button>
    </div>
  );
}
