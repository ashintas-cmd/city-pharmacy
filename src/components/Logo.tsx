import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-gradient-to-br from-apollo-500 to-apollo-800 shadow-[0_6px_14px_-6px_rgba(18,74,71,0.7)]",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
        <path d="M13 5.5h6v7.5h7.5v6H19v7.5h-6V19H5.5v-6H13V5.5Z" fill="white" />
      </svg>
      <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-coral-500" />
    </span>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="City Pharmacy home">
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-3" />
      <span className="leading-none">
        <span className="block text-[20px] font-extrabold tracking-tight text-apollo-800 sm:text-[22px]">
          City <span className="text-apollo-500">Pharmacy</span>
        </span>
        {!compact ? (
          <span className="mt-1 hidden text-[9.5px] font-semibold uppercase tracking-[0.2em] text-muted sm:block">
            Adarsh Nagar · Delhi
          </span>
        ) : null}
      </span>
    </Link>
  );
}
