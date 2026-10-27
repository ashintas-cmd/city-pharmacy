import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[11px] text-muted">
      <Link to="/" className="transition hover:text-apollo-700">
        Home
      </Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1">
          <ChevronRight size={11} className="text-muted/50" />
          {item.to ? (
            <Link to={item.to} className="transition hover:text-apollo-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink/70">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHead({
  title,
  description,
  children,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
}) {
  return (
    <div className="border-b border-line bg-white">
      <div className="shell py-6 sm:py-8">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-apollo-900 sm:text-[32px]">{title}</h1>
            {description ? <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-muted sm:text-sm">{description}</p> : null}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
