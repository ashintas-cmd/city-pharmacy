import type { LucideIcon } from "lucide-react";
import { PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  actionTo,
  secondary,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: string;
  actionTo?: string;
  secondary?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center", className)}>
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-apollo-50 text-apollo-600">
        <Icon size={26} strokeWidth={1.7} />
      </span>
      <h3 className="mt-4 text-base font-bold text-apollo-900">{title}</h3>
      {description ? <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted">{description}</p> : null}
      {action && actionTo ? (
        <Link to={actionTo} className="btn-primary mt-5">
          {action}
        </Link>
      ) : null}
      {secondary ? <div className="mt-3">{secondary}</div> : null}
    </div>
  );
}
