import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

export function OfferCountdown({ endsAt, compact = false }: { endsAt: string; compact?: boolean }) {
  const target = new Date(endsAt).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  if (diff <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/70">
        <Clock3 size={11} /> Offer ended
      </span>
    );
  }

  const parts = [
    { value: days, label: "days" },
    { value: hours, label: "hrs" },
    { value: minutes, label: "min" },
    { value: seconds, label: "sec" },
  ];

  if (compact) {
    return (
      <span className="text-[10px] font-semibold text-amber-100">
        Ends in {days}d {hours}h {minutes}m
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {parts.map((part) => (
        <div key={part.label} className="min-w-[38px] rounded-lg bg-black/20 px-1.5 py-1 text-center ring-1 ring-white/15 backdrop-blur">
          <p className="text-sm font-extrabold leading-none text-white tabular-nums">
            {String(part.value).padStart(2, "0")}
          </p>
          <p className="mt-0.5 text-[7.5px] font-semibold uppercase tracking-wider text-white/55">{part.label}</p>
        </div>
      ))}
    </div>
  );
}
