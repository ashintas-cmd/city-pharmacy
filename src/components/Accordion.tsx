import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export function Accordion({
  items,
  className,
}: {
  items: { q: string; a: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <details
          key={item.q}
          className="group border-b border-line py-4 last:border-0"
          open={index === 0}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-apollo-900 marker:hidden">
            {item.q}
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-apollo-50 text-apollo-700 transition group-open:rotate-180">
              <ChevronDown size={15} />
            </span>
          </summary>
          <div className="mt-2.5 pr-8 text-xs leading-relaxed text-muted">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
