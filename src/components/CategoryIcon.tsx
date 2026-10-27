import {
  Activity,
  Baby,
  Coffee,
  Flower2,
  HeartPulse,
  Leaf,
  Pill,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  pill: Pill,
  "heart-pulse": HeartPulse,
  sparkles: Sparkles,
  baby: Baby,
  activity: Activity,
  leaf: Leaf,
  flower: Flower2,
  coffee: Coffee,
};

export const categoryTones: Record<string, string> = {
  mint: "bg-apollo-50 text-apollo-700",
  peach: "bg-orange-50 text-orange-700",
  blush: "bg-coral-50 text-coral-600",
  sky: "bg-sky-50 text-sky-700",
  lilac: "bg-violet-50 text-violet-700",
  lime: "bg-lime-50 text-lime-700",
  aqua: "bg-cyan-50 text-cyan-700",
  sand: "bg-amber-50 text-amber-700",
};

export function CategoryIcon({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = icons[name] ?? Pill;
  return <Icon size={size} className={className} strokeWidth={1.9} />;
}
