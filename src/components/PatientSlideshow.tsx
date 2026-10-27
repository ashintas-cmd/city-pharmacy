import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const patients = [
  {
    name: "Rakesh Sharma",
    area: "Azadpur",
    quote: "Ordered Metformin at 9 PM and it was at my door before 10:30. The pharmacist even called to confirm the dose. This is what a real pharmacy feels like.",
    hue: 170,
    initials: "RS",
  },
  {
    name: "Neha Verma",
    area: "Shalimar Bagh",
    quote: "The Diwali 15% discount actually applied itself at checkout — no coupon hunting. Genuine medicines, fair prices and a store that remembers my name.",
    hue: 330,
    initials: "NV",
  },
  {
    name: "Dr. Arvind Mehra",
    area: "Model Town",
    quote: "I send my patients to City Pharmacy for refills. They read the prescription, explain the dose in plain language and follow up. Rare to find that kind of care today.",
    hue: 210,
    initials: "AM",
  },
  {
    name: "Sunita Kapoor",
    area: "Ashok Vihar",
    quote: "My mother's BP monitor came with a free demo at the store and a follow-up call. The team treats you like family, not like a transaction.",
    hue: 40,
    initials: "SK",
  },
  {
    name: "Imran Qureshi",
    area: "Adarsh Nagar",
    quote: "Open 24×7 saved us during an emergency at 2 AM. The pharmacist guided me over WhatsApp and had the medicine ready for pickup in ten minutes.",
    hue: 130,
    initials: "IQ",
  },
];

function PatientAvatar({ initials, hue }: { initials: string; hue: number }) {
  return (
    <div className="relative">
      <div
        className="grid h-14 w-14 place-items-center rounded-full text-sm font-extrabold text-white shadow-card ring-4 ring-white"
        style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 52%), hsl(${hue} 55% 34%))` }}
      >
        {initials}
      </div>
      <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[9px] shadow-sm">
        <span className="text-apollo-700">✓</span>
      </span>
    </div>
  );
}

export function PatientSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % patients.length), 5500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const go = (direction: number) => setIndex((value) => (value + direction + patients.length) % patients.length);
  const patient = patients[index];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-apollo-900 via-apollo-800 to-apollo-950 p-6 text-white sm:p-8">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-white/5 animate-floaty" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-coral-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-12 bottom-10 h-16 w-16 animate-float-rotate opacity-40">
        <svg viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="32" rx="26" ry="12" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <ellipse cx="32" cy="32" rx="10" ry="10" fill="rgba(255,116,142,0.3)" />
        </svg>
      </div>

      {/* Floating tablets */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[8%] top-[14%] h-3 w-3 rounded-full bg-amber-300/60 animate-drift" />
        <span className="absolute left-[18%] top-[70%] h-2.5 w-2.5 rounded-full bg-coral-300/50 animate-floaty" />
        <span className="absolute right-[12%] top-[22%] h-4 w-4 rounded-full bg-white/25 animate-drift" style={{ animationDelay: "1.2s" }} />
        <span className="absolute right-[22%] top-[78%] h-2 w-2 rounded-full bg-apollo-300/60 animate-floaty" style={{ animationDelay: "0.8s" }} />
        <span className="absolute left-[42%] top-[8%] h-2.5 w-2.5 rounded-full bg-amber-200/50 animate-drift" style={{ animationDelay: "2s" }} />
        <div className="absolute left-[6%] bottom-[12%] h-7 w-14 -rotate-12 rounded-full border-2 border-white/20 bg-white/10 animate-floaty" />
        <div className="absolute right-[8%] top-[46%] h-6 w-12 rotate-45 rounded-full border-2 border-amber-300/30 bg-amber-300/10 animate-drift" />
        <div className="absolute left-[78%] bottom-[18%] h-5 w-10 -rotate-6 rounded-full border-2 border-coral-300/30 bg-coral-300/10 animate-floaty" style={{ animationDelay: "1.4s" }} />
      </div>

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-apollo-200">Happy patients</p>
          <h2 className="mt-1.5 text-xl font-extrabold leading-tight sm:text-2xl">What our neighbours say</h2>
          <p className="mt-1 text-[10.5px] leading-relaxed text-white/55">
            Real words from families we serve every day in Adarsh Nagar and across North Delhi.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 backdrop-blur transition hover:bg-white/20 hover:text-white"
            aria-label={paused ? "Play patient stories" : "Pause patient stories"}
          >
            {paused ? <ChevronRight size={13} /> : <span className="h-2.5 w-2.5 rounded-sm bg-white/80" />}
          </button>
          <button type="button" onClick={() => go(-1)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 backdrop-blur transition hover:bg-white/20 hover:text-white" aria-label="Previous story">
            <ChevronLeft size={14} />
          </button>
          <button type="button" onClick={() => go(1)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 backdrop-blur transition hover:bg-white/20 hover:text-white" aria-label="Next story">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="relative mt-5 min-h-[150px]">
        {patients.map((item, itemIndex) => (
          <div
            key={item.name}
            className={cn(
              "absolute inset-0 transition-all duration-700",
              itemIndex === index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <PatientAvatar initials={item.initials} hue={item.hue} />
              <div className="min-w-0 flex-1">
                <Quote size={22} className="text-apollo-300/40" />
                <p className="mt-1 text-[12.5px] leading-relaxed text-white/85 sm:text-[13.5px]">{item.quote}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <p className="text-[11px] font-bold text-white">{item.name}</p>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-semibold text-white/60">{item.area}</span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star key={star} size={10} className="fill-amber-300 text-amber-300" />
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {patients.map((item, itemIndex) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                itemIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/35 hover:bg-white/60",
              )}
              aria-label={`Show story ${itemIndex + 1}`}
              aria-current={itemIndex === index}
            />
          ))}
        </div>
        <span className="text-[8.5px] font-medium text-white/40">{index + 1} of {patients.length}</span>
      </div>
    </section>
  );
}
