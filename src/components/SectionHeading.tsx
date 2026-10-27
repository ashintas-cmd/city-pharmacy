import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  actionTo,
  tone = "default",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: string;
  actionTo?: string;
  tone?: "default" | "light";
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow ? (
          <p className={cn("eyebrow mb-1.5", tone === "light" && "text-amber-200")}>{eyebrow}</p>
        ) : null}
        <h2
          className={cn(
            "text-[20px] font-extrabold leading-tight sm:text-[25px]",
            tone === "light" ? "text-white" : "text-apollo-900",
          )}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className={cn("mt-1 max-w-2xl text-xs leading-relaxed sm:text-[13px]", tone === "light" ? "text-white/70" : "text-muted")}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {action && actionTo ? (
        <Link
          to={actionTo}
          className={cn(
            "group hidden shrink-0 items-center gap-1.5 text-xs font-bold sm:flex",
            tone === "light" ? "text-amber-100 hover:text-white" : "text-apollo-700 hover:text-apollo-900",
          )}
        >
          {action}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card p-5 sm:p-6", className)}>
      <div className="mb-4">
        <h3 className="text-base font-bold text-apollo-900">{title}</h3>
        {description ? <p className="mt-1 text-xs text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
