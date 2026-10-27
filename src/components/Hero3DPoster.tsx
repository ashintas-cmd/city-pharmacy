import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { cn } from "@/lib/utils";

const floatingPills = [
  { top: "8%", left: "6%", size: 46, delay: "0s", duration: "6.2s", color: "from-apollo-400 to-apollo-700", rotate: "12deg" },
  { top: "14%", right: "8%", size: 58, delay: "0.6s", duration: "7.4s", color: "from-coral-400 to-coral-600", rotate: "-18deg" },
  { top: "58%", left: "4%", size: 38, delay: "1.2s", duration: "5.8s", color: "from-amber-300 to-amber-500", rotate: "24deg" },
  { top: "62%", right: "6%", size: 52, delay: "0.3s", duration: "8.1s", color: "from-apollo-300 to-apollo-600", rotate: "-10deg" },
  { top: "36%", left: "2%", size: 30, delay: "1.8s", duration: "6.6s", color: "from-coral-300 to-coral-500", rotate: "40deg" },
  { top: "40%", right: "3%", size: 42, delay: "0.9s", duration: "7.1s", color: "from-amber-400 to-apollo-500", rotate: "-28deg" },
];

export function Hero3DPoster() {
  const { liveOffer, settings } = useCatalog();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-apollo-950 via-apollo-900 to-apollo-700 px-5 py-8 text-white sm:px-8 sm:py-10">
      {/* 3D perspective grid */}
      <div className="pointer-events-none absolute inset-0" style={{ perspective: "900px" }}>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            transform: "rotateX(55deg) scale(1.6)",
            transformOrigin: "center bottom",
          }}
        />
      </div>

      {/* Glow orbs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-apollo-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-coral-500/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/10 blur-3xl" />

      {/* Floating 3D pills */}
      <div className="pointer-events-none absolute inset-0" style={{ perspective: "800px" }}>
        {floatingPills.map((pill, index) => (
          <div
            key={index}
            className="absolute animate-float-rotate"
            style={{
              top: pill.top,
              left: pill.left,
              right: pill.right,
              width: pill.size,
              height: pill.size * 0.42,
              animationDelay: pill.delay,
              animationDuration: pill.duration,
              transformStyle: "preserve-3d",
              transform: `rotate(${pill.rotate})`,
            }}
          >
            <div
              className={`h-full w-full rounded-full bg-gradient-to-br ${pill.color} shadow-[0_12px_30px_-8px_rgba(0,0,0,.5)] ring-2 ring-white/20`}
              style={{ transform: "rotateY(25deg) rotateX(15deg)" }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent" />
              <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
            </div>
          </div>
        ))}
      </div>

      {/* Capsule shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[48%] h-4 w-16 -rotate-12 rounded-full bg-gradient-to-r from-white/30 to-white/5 shadow-lg animate-drift" />
        <div className="absolute right-[14%] top-[30%] h-3 w-12 rotate-30 rounded-full bg-gradient-to-r from-amber-300/40 to-amber-300/10 shadow-lg animate-floaty" />
        <div className="absolute left-[70%] bottom-[18%] h-3.5 w-14 -rotate-6 rounded-full bg-gradient-to-r from-coral-300/40 to-coral-300/10 shadow-lg animate-drift" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left copy */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-apollo-100 backdrop-blur">
            <Sparkles size={11} className="text-amber-300" /> 3D pharmacy experience
          </div>
          <h1 className="mt-4 text-[34px] font-extrabold leading-[1.02] tracking-tight sm:text-[46px]">
            Genuine medicines,<br />
            <span className="bg-gradient-to-r from-amber-200 via-coral-300 to-white bg-clip-text text-transparent animate-shimmer-slow">
              delivered to your door
            </span>
          </h1>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-white/70 sm:text-[13px]">
            Shop City Pharmacy online — verified stock, pharmacist-reviewed prescriptions, and 90-minute express
            delivery across Adarsh Nagar and North Delhi. Flat 15% off this Diwali on selected items.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[11.5px] font-bold text-apollo-900 shadow-lg transition hover:bg-apollo-50"
            >
              Shop now <ArrowRight size={14} />
            </Link>
            <Link
              to="/offers/diwali-15"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-2.5 text-[11.5px] font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Sparkles size={13} className="text-amber-300" /> Diwali 15% OFF
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[9.5px] font-medium text-white/55">
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> 100% genuine</span>
            <span className="flex items-center gap-1"><Truck size={12} /> 90-min delivery</span>
            <span className="flex items-center gap-1"><Star size={12} className="fill-amber-300 text-amber-300" /> 4.8/5 rated</span>
          </div>
        </div>

        {/* 3D poster stack */}
        <div className="relative mx-auto hidden h-[260px] w-full max-w-[320px] sm:block" style={{ perspective: "700px" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative h-44 w-44 animate-floaty"
              style={{ transformStyle: "preserve-3d", transform: "rotateY(-18deg) rotateX(8deg)" }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/20 backdrop-blur" />
              <div className="absolute inset-3 rounded-xl bg-gradient-to-br from-apollo-500 to-apollo-800 p-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-apollo-100">Rx</span>
                  <span className="text-[7px] text-white/50">CITY PHARMACY</span>
                </div>
                <div className="mt-2 space-y-1">
                  {[70, 50, 62, 40].map((w, i) => (
                    <div key={i} className="h-1 rounded-full bg-white/30" style={{ width: `${w}%` }} />
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-white/10 px-2 py-1">
                  <ShieldCheck size={10} className="text-apollo-200" />
                  <span className="text-[7px] font-bold text-white/80">Verified by pharmacist</span>
                </div>
              </div>
              <div className="absolute -right-3 -top-3 grid h-12 w-12 place-items-center rounded-full bg-coral-500 shadow-float ring-4 ring-white/10 animate-pulse-glow">
                <span className="text-[9px] font-extrabold leading-tight text-white text-center">
                  15%<br />OFF
                </span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="rounded-full bg-white/10 px-3 py-1 text-[8.5px] font-semibold text-white/60 backdrop-blur ring-1 ring-white/10">
              {liveOffer ? `Diwali offer live till ${liveOffer.endDate.slice(0, 10)}` : "Genuine medicines · Adarsh Nagar"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
