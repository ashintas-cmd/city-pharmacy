import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  HeartPulse,
  MapPin,
  MessageCircle,
  Phone,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
  Truck,
  Upload,
  Zap,
  Activity,
  Baby,
  Droplets,
  Leaf,
  PackageCheck,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { PackArt } from "@/components/PackArt";
import { SectionHeading } from "@/components/SectionHeading";
import { OfferCountdown } from "@/components/OfferCountdown";
import { TrustStrip } from "@/components/Footer";
import { Accordion } from "@/components/Accordion";
import { CategoryIcon, categoryTones } from "@/components/CategoryIcon";
import { useCatalog } from "@/context/CatalogContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { cn, inr } from "@/lib/utils";
import { StoreMap } from "@/components/StoreMap";
import { OwnerSlideshow } from "@/components/OwnerSlideshow";
import type { Product } from "@/types";

function DiyaArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="90" stroke="#FBBF24" strokeOpacity=".18" />
      <circle cx="100" cy="100" r="68" stroke="#FBBF24" strokeOpacity=".12" />
      <path d="M62 118h76c-4 18-18 28-38 28s-34-10-38-28Z" fill="#B45309" />
      <path d="M62 118h76c-1.5 6-5 11-10 15H72c-5-4-8.5-9-10-15Z" fill="#F59E0B" />
      <path d="M100 64c9 12 13 20 9 28-2 5-6 8-9 10-3-2-7-5-9-10-4-8 0-16 9-28Z" fill="#FBBF24" />
      <path d="M100 76c4 7 5 12 3 16-1 3-2 4-3 5-1-1-2-2-3-5-2-4-1-9 3-16Z" fill="#FFF7D6" />
      <path d="M84 108c4-6 10-9 16-9s12 3 16 9" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HeroProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("w-[128px] overflow-hidden rounded-2xl bg-white p-1.5 shadow-float sm:w-[146px]", className)}>
      <div className="overflow-hidden rounded-xl bg-cream">
        <PackArt product={product} />
      </div>
      <div className="px-1 pb-1 pt-1.5">
        <p className="truncate text-[9px] font-bold text-apollo-800">{product.brand}</p>
        <p className="mt-0.5 line-clamp-1 text-[8.5px] leading-tight text-muted">{product.name}</p>
        <p className="mt-1 text-[11px] font-extrabold text-ink">{inr(Math.round(product.price * 0.85))}</p>
      </div>
    </div>
  );
}

function Hero() {
  const { liveOffer, offerProducts, products } = useCatalog();
  const [slide, setSlide] = useState(0);
  const slides = 3;

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % slides), 7500);
    return () => window.clearInterval(timer);
  }, [slides]);

  const art = (offerProducts.length ? offerProducts : products.filter((p) => p.active)).slice(0, 3);
  const slideTwoArt = products.filter((p) => p.active && (p.categoryId === "devices" || p.tags?.includes("fever"))).slice(0, 1);

  return (
    <section className="shell pt-4 sm:pt-6">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.72fr)_minmax(0,1fr)]">
        <div className="relative min-h-[355px] overflow-hidden rounded-3xl sm:min-h-[400px]">
          {/* Slide 1 - Diwali */}
          {slide === 0 ? (
            <div className="absolute inset-0 diwali-pattern animate-fade-in">
              <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-amber-400/15 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-coral-500/15 blur-3xl" />
              <DiyaArt className="pointer-events-none absolute -bottom-6 right-[34%] h-52 w-52 opacity-30" />
              <div className="relative flex h-full min-h-[355px] flex-col justify-center p-6 sm:min-h-[400px] sm:p-9">
                <div className="max-w-[330px] sm:max-w-[380px]">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-100 backdrop-blur">
                    <Sparkles size={11} /> Diwali Dhamaka · Limited period
                  </div>
                  <h1 className="mt-4 text-[38px] font-extrabold leading-[0.94] tracking-tight text-white sm:text-[52px]">
                    Flat <span className="text-amber-300">15% OFF</span>
                  </h1>
                  <p className="mt-3 max-w-[300px] text-xs leading-relaxed text-white/75 sm:text-[13px]">
                    On selected medicines, wellness and personal-care essentials. No coupon needed — the discount is
                    applied automatically.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <Link
                      to="/offers/diwali-15"
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-4 py-2.5 text-[11.5px] font-bold text-[#4a1a0a] shadow-lg transition hover:bg-amber-200"
                    >
                      Shop Diwali offer <ArrowRight size={14} />
                    </Link>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-2.5 text-[11.5px] font-semibold text-white backdrop-blur transition hover:bg-white/10"
                    >
                      Browse all products
                    </Link>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {liveOffer ? <OfferCountdown endsAt={liveOffer.endDate} /> : null}
                    <span className="text-[9px] font-medium text-white/50">Ends 15 Nov · Auto-applied</span>
                  </div>
                </div>

                <div className="absolute -right-2 bottom-4 hidden h-[270px] w-[46%] sm:block">
                  {art[1] ? (
                    <HeroProductCard product={art[1]} className="absolute left-4 top-4 -rotate-6 animate-fade-up" />
                  ) : null}
                  {art[0] ? (
                    <HeroProductCard product={art[0]} className="absolute right-4 top-16 rotate-3 animate-floaty" />
                  ) : null}
                  {art[2] ? (
                    <HeroProductCard product={art[2]} className="absolute bottom-0 left-16 -rotate-2 opacity-95" />
                  ) : null}
                  <div className="absolute right-0 top-2 grid h-16 w-16 place-items-center rounded-full bg-coral-500 text-center shadow-float ring-4 ring-white/10">
                    <span className="text-[9px] font-bold uppercase leading-tight text-white">
                      15%
                      <br />
                      OFF
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Slide 2 - delivery */}
          {slide === 1 ? (
            <div className="absolute inset-0 bg-gradient-to-br from-apollo-900 via-apollo-800 to-apollo-600 animate-fade-in">
              <div className="absolute inset-0 dot-grid opacity-[0.18]" />
              <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-apollo-300/20 blur-2xl" />
              <div className="relative flex h-full min-h-[355px] flex-col justify-center p-6 sm:min-h-[400px] sm:p-9">
                <div className="max-w-[360px]">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-apollo-100 ring-1 ring-white/15">
                    <Truck size={11} /> Express delivery
                  </div>
                  <h1 className="mt-4 text-[34px] font-extrabold leading-[1.02] tracking-tight text-white sm:text-[44px]">
                    Medicines at your door in{" "}
                    <span className="relative whitespace-nowrap text-apollo-200">
                      90 minutes
                      <svg viewBox="0 0 200 10" className="absolute -bottom-1 left-0 h-2 w-full text-amber-300/70" preserveAspectRatio="none">
                        <path d="M2 7c48-5 100-6 196-2" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                      </svg>
                    </span>
                  </h1>
                  <p className="mt-4 max-w-[320px] text-xs leading-relaxed text-white/70 sm:text-[13px]">
                    From Adarsh Nagar to your doorstep. Free delivery above ₹499, with every order checked by our
                    pharmacist.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <Link to="/shop?category=medicines" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[11.5px] font-bold text-apollo-900 transition hover:bg-apollo-50">
                      Order medicines <ArrowRight size={14} />
                    </Link>
                    <Link to="/prescription" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-[11.5px] font-semibold text-white transition hover:bg-white/10">
                      <Upload size={14} /> Upload prescription
                    </Link>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[9.5px] font-medium text-white/55">
                    <span className="flex items-center gap-1"><ShieldCheck size={12} /> 100% genuine</span>
                    <span className="flex items-center gap-1"><Clock3 size={12} /> Open 24×7</span>
                    <span className="flex items-center gap-1"><BadgeCheck size={12} /> Licensed pharmacy</span>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 hidden h-[250px] w-[38%] sm:block">
                  <div className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/15" />
                  <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-apollo-700 shadow-float">
                    <Truck size={38} strokeWidth={1.8} />
                  </div>
                  {slideTwoArt[0] ? (
                    <HeroProductCard product={slideTwoArt[0]} className="absolute bottom-0 right-0 rotate-6 animate-floaty" />
                  ) : null}
                  <span className="absolute left-0 top-8 rounded-full bg-amber-300 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wide text-[#4a1a0a] shadow">
                    Free over ₹499
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Slide 3 - prescription */}
          {slide === 2 ? (
            <div className="absolute inset-0 bg-gradient-to-br from-[#F7F0E4] via-[#FBF7EF] to-[#EDF5F1] animate-fade-in">
              <div className="absolute inset-0 dot-grid opacity-40" />
              <div className="relative flex h-full min-h-[355px] flex-col justify-center p-6 sm:min-h-[400px] sm:p-9">
                <div className="max-w-[350px]">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-apollo-700/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-apollo-800">
                    <Stethoscope size={11} /> Pharmacist reviewed
                  </div>
                  <h1 className="mt-4 text-[34px] font-extrabold leading-[1.02] tracking-tight text-apollo-950 sm:text-[44px]">
                    Have a prescription? <span className="text-apollo-600">We'll do the rest.</span>
                  </h1>
                  <p className="mt-3.5 max-w-[310px] text-xs leading-relaxed text-ink/60 sm:text-[13px]">
                    Send it once. Our pharmacist reads it, confirms availability, calls you back and arranges
                    delivery — even for regular refills.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <Link to="/prescription" className="inline-flex items-center gap-2 rounded-xl bg-apollo-700 px-4 py-2.5 text-[11.5px] font-bold text-white transition hover:bg-apollo-800">
                      <Upload size={14} /> Upload prescription
                    </Link>
                    <a
                      href="https://wa.me/919871040480?text=Hi%20City%20Pharmacy%2C%20I%20would%20like%20to%20send%20a%20prescription."
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-apollo-200 bg-white px-4 py-2.5 text-[11.5px] font-semibold text-apollo-800 transition hover:border-apollo-400"
                    >
                      <MessageCircle size={14} /> WhatsApp us
                    </a>
                  </div>
                  <p className="mt-4 flex items-center gap-1.5 text-[9.5px] font-medium text-ink/45">
                    <ShieldCheck size={12} /> Your prescription is handled only by our licensed pharmacist.
                  </p>
                </div>

                <div className="absolute -right-3 bottom-4 hidden h-[280px] w-[42%] sm:block">
                  <div className="absolute right-4 top-2 w-[190px] rotate-6 rounded-xl bg-white p-4 shadow-float">
                    <div className="flex items-center justify-between border-b border-line pb-2">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-apollo-800">Rx</span>
                      <span className="text-[7px] text-muted">CITY PHARMACY</span>
                    </div>
                    <div className="space-y-1.5 pt-2.5">
                      {[80, 60, 72, 45, 65, 38].map((width, i) => (
                        <div key={i} className="h-1 rounded-full bg-neutral-100" style={{ width: `${width}%` }} />
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-apollo-50 px-2 py-1.5">
                      <BadgeCheck size={12} className="text-apollo-700" />
                      <span className="text-[7.5px] font-bold text-apollo-800">Verified by pharmacist</span>
                    </div>
                  </div>
                  <div className="absolute bottom-1 left-0 w-[150px] -rotate-3 rounded-xl bg-apollo-700 p-3 text-white shadow-float">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-apollo-200">Call back in</p>
                    <p className="mt-0.5 text-lg font-extrabold">15 min</p>
                    <p className="mt-1 text-[7.5px] text-white/60">Mon–Sun, 8am–11pm</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setSlide((value) => (value - 1 + slides) % slides)}
            className="absolute left-2.5 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur transition hover:bg-white sm:grid"
            aria-label="Previous banner"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setSlide((value) => (value + 1) % slides)}
            className="absolute right-2.5 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur transition hover:bg-white sm:grid"
            aria-label="Next banner"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {Array.from({ length: slides }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSlide(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  slide === index ? "w-6 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-apollo-800 p-5 text-white">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border-[18px] border-white/5" />
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1 text-[8.5px] font-bold uppercase tracking-widest text-apollo-100">
                <Upload size={10} /> Prescription desk
              </span>
              <h2 className="mt-3 text-lg font-extrabold leading-tight">Upload once.<br />We'll handle the rest.</h2>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-white/55">
                Our pharmacist checks every prescription and calls you before dispatch.
              </p>
            </div>
            <Link to="/prescription" className="mt-4 flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5 text-[10.5px] font-bold transition hover:bg-white/15">
              Upload prescription <ArrowRight size={13} />
            </Link>
          </div>

          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-coral-100 bg-white p-5">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-coral-50" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-coral-50 px-2 py-1 text-[8.5px] font-bold uppercase tracking-widest text-coral-700">
                  <Sparkles size={10} /> Diwali 15%
                </span>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[8.5px] font-bold text-amber-700">17 items</span>
              </div>
              <h2 className="mt-3 text-lg font-extrabold leading-tight text-apollo-950">Festive savings,<br />on the essentials.</h2>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">
                Flat 15% off selected medicines, vitamins, devices and personal care until 15 Nov.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <Link to="/offers/diwali-15" className="flex items-center gap-1.5 text-[10.5px] font-bold text-coral-600 hover:text-coral-700">
                Explore the offer <ArrowRight size={13} />
              </Link>
              {art[0] ? (
                <div className="h-12 w-12 overflow-hidden rounded-lg bg-cream">
                  <PackArt product={art[0]} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <TrustStrip />
      </div>
    </section>
  );
}

function CategoryCircles() {
  const { categories } = useCatalog();
  return (
    <section className="shell mt-8">
      <SectionHeading
        eyebrow="Shop by category"
        title="Everything for your family's health"
        action="View all categories"
        actionTo="/shop"
      />
      <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:grid-cols-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/shop?category=${category.slug}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-transparent p-2 text-center transition hover:border-line hover:bg-white hover:shadow-soft"
          >
            <span
              className={cn(
                "grid h-14 w-14 place-items-center rounded-full transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md sm:h-16 sm:w-16",
                categoryTones[category.tone] ?? "bg-apollo-50 text-apollo-700",
              )}
            >
              <CategoryIcon name={category.icon} size={24} />
            </span>
            <span className="text-[10.5px] font-semibold leading-tight text-ink/80 group-hover:text-apollo-800 sm:text-[11.5px]">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function DiwaliSection() {
  const { liveOffer, offerProducts } = useCatalog();
  const products = useMemo(
    () => [...offerProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 8),
    [offerProducts],
  );

  if (!liveOffer || !products.length) return null;

  return (
    <section className="shell mt-10">
      <div className="relative overflow-hidden rounded-3xl diwali-pattern p-4 sm:p-6 lg:p-7">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
        <DiyaArt className="pointer-events-none absolute -bottom-10 right-2 h-60 w-60 opacity-20" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.18em] text-amber-100">
              <Sparkles size={10} /> {liveOffer.eyebrow}
            </div>
            <h2 className="mt-2.5 text-[26px] font-extrabold leading-tight text-white sm:text-[34px]">
              {liveOffer.title}{" "}
              <span className="text-amber-300">— Flat {liveOffer.percent}% OFF</span>
            </h2>
            <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-white/65 sm:text-xs">
              {liveOffer.subtitle} Discount applied automatically on marked items at checkout.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
            <OfferCountdown endsAt={liveOffer.endDate} />
            <Link
              to={`/offers/${liveOffer.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[10px] font-bold text-[#5b1a12] transition hover:bg-amber-100"
            >
              View all {offerProducts.length} items <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-white/45">
          <span className="flex items-center gap-1"><BadgeCheck size={11} /> Auto-applied — no coupon needed</span>
          <span className="flex items-center gap-1"><CalendarDays size={11} /> Valid till 15 Nov 2026</span>
          <span className="flex items-center gap-1"><Truck size={11} /> Free delivery above ₹499</span>
        </div>
      </div>
    </section>
  );
}

const tabs = [
  { id: "all", label: "Bestsellers" },
  { id: "medicines", label: "Medicines" },
  { id: "wellness", label: "Wellness" },
  { id: "devices", label: "Devices" },
] as const;

function Bestsellers() {
  const { products } = useCatalog();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");

  const list = useMemo(() => {
    const active = products.filter((product) => product.active);
    const filtered = tab === "all" ? active : active.filter((product) => product.categoryId === tab);
    return [...filtered].sort((a, b) => b.reviews - a.reviews).slice(0, 10);
  }, [products, tab]);

  return (
    <section className="shell mt-10">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow mb-1.5">Loved by our neighbours</p>
          <h2 className="text-[20px] font-extrabold leading-tight text-apollo-900 sm:text-[25px]">This week's bestsellers</h2>
          <p className="mt-1 text-xs text-muted">The products Adarsh Nagar keeps coming back for.</p>
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-white p-1 ring-1 ring-line">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-[10.5px] font-semibold transition",
                tab === item.id ? "bg-apollo-700 text-white shadow-sm" : "text-muted hover:bg-cream hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <Link to={tab === "all" ? "/shop" : `/shop?category=${tab}`} className="btn-outline px-5 py-2 text-[11px]">
          See all products <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}

const concerns = [
  { name: "Pain relief", tag: "pain", icon: Zap, blurb: "Headache, body ache & fever", tone: "from-amber-50 to-orange-50 text-amber-700" },
  { name: "Immunity", tag: "immunity", icon: ShieldCheck, blurb: "Vitamins, kadha & more", tone: "from-apollo-50 to-emerald-50 text-apollo-700" },
  { name: "Diabetes care", tag: "diabetes", icon: Droplets, blurb: "Sugar control essentials", tone: "from-sky-50 to-cyan-50 text-sky-700" },
  { name: "Heart care", tag: "heart", icon: HeartPulse, blurb: "BP monitors & omega-3", tone: "from-coral-50 to-rose-50 text-coral-600" },
  { name: "Skin & hair", tag: "skin", icon: Sparkles, blurb: "Derma-friendly picks", tone: "from-fuchsia-50 to-pink-50 text-fuchsia-700" },
  { name: "Baby care", tag: "baby", icon: Baby, blurb: "Gentle everyday care", tone: "from-violet-50 to-purple-50 text-violet-700" },
];

function Concerns() {
  return (
    <section className="shell mt-10">
      <SectionHeading eyebrow="Health concerns" title="Shop by what you need" action="Browse all" actionTo="/shop" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {concerns.map((concern) => (
          <Link
            key={concern.tag}
            to={`/shop?concern=${concern.tag}`}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white bg-gradient-to-br p-4 transition hover:-translate-y-0.5 hover:shadow-card",
              concern.tone,
            )}
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/80 shadow-sm">
              <concern.icon size={18} strokeWidth={2} />
            </span>
            <p className="mt-3 text-xs font-bold text-ink">{concern.name}</p>
            <p className="mt-0.5 text-[9.5px] leading-snug text-ink/50">{concern.blurb}</p>
            <ArrowRight size={14} className="absolute right-3 top-3 opacity-0 transition group-hover:opacity-60" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function PromoStrip() {
  return (
    <section className="shell mt-10">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-apollo-700 to-apollo-950 p-6 text-white sm:p-7">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[22px] border-white/5" />
          <Truck size={28} className="text-apollo-200" />
          <h3 className="mt-3 text-xl font-extrabold">Free delivery above ₹499</h3>
          <p className="mt-1.5 max-w-md text-[11px] leading-relaxed text-white/60">
            Express delivery in 90 minutes across Adarsh Nagar, Azadpur, Model Town and nearby areas. Cold-chain items
            packed with care.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-semibold text-white/75 ring-1 ring-white/10">
              90-min express
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-semibold text-white/75 ring-1 ring-white/10">
              Same-day slots
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-semibold text-white/75 ring-1 ring-white/10">
              Contactless option
            </span>
          </div>
          <Link to="/shop" className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold text-apollo-100 hover:text-white">
            Start shopping <ArrowRight size={13} />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 sm:p-7">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sand" />
          <Stethoscope size={28} className="text-apollo-600" />
          <h3 className="mt-3 text-xl font-extrabold text-apollo-950">Talk to a pharmacist — free</h3>
          <p className="mt-1.5 max-w-md text-[11px] leading-relaxed text-muted">
            Confused about a salt, a dose or a device? Call or WhatsApp us between 8am and 11pm. No appointment, no
            consultation fee.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="tel:+919871040480" className="btn-outline px-3 py-2 text-[10.5px]">
              <Phone size={13} /> Call the store
            </a>
            <a
              href="https://wa.me/919871040480?text=Hi%20City%20Pharmacy%2C%20I%20have%20a%20health%20question."
              target="_blank"
              rel="noreferrer"
              className="btn-primary px-3 py-2 text-[10.5px]"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  const stats = [
    { value: "24×7", label: "Open in Adarsh Nagar" },
    { value: "25k+", label: "Families served" },
    { value: "4.8/5", label: "Neighbourhood rating" },
    { value: "90 min", label: "Express delivery" },
  ];
  return (
    <section className="shell mt-10">
      <div className="grid grid-cols-2 divide-line rounded-2xl border border-line bg-white py-4 sm:grid-cols-4 sm:divide-x">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-2 text-center">
            <p className="text-xl font-extrabold tracking-tight text-apollo-800 sm:text-2xl">{stat.value}</p>
            <p className="mt-0.5 text-[9.5px] font-medium text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StoreSection() {
  const { settings } = useCatalog();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.mapQuery)}`;

  return (
    <section className="shell mt-10">
      <div className="overflow-hidden rounded-3xl border border-line bg-white">
        <div className="grid lg:grid-cols-[0.78fr_1.05fr_1fr]">
          <div className="relative min-h-[380px] lg:min-h-[430px]">
            <OwnerSlideshow className="absolute inset-0" />
          </div>

          <div className="p-5 sm:p-7">
            <p className="eyebrow">Visit our store</p>
            <h2 className="mt-1.5 text-[22px] font-extrabold leading-tight text-apollo-950 sm:text-[27px]">
              The pharmacy behind the website.
            </h2>
            <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted">
              City Pharmacy is a family-run neighbourhood chemist run by <strong className="text-ink">Akshat Sabharwal</strong>.
              Our promise is simple: genuine medicines, fair prices and a pharmacist who actually knows your name.
            </p>

            <div className="mt-4 space-y-2.5 rounded-2xl bg-cream p-3.5 text-[11px]">
              <p className="flex items-start gap-2 text-ink/75">
                <MapPin size={14} className="mt-0.5 shrink-0 text-apollo-600" />
                <span>
                  {settings.addressLine1}, {settings.addressLine2}, {settings.city} – {settings.pincode}
                </span>
              </p>
              <p className="flex items-center gap-2 text-ink/75">
                <Clock3 size={14} className="shrink-0 text-apollo-600" /> {settings.hours} · {settings.deliveryEta} delivery
              </p>
              <p className="flex items-center gap-2 text-ink/75">
                <ShieldCheck size={14} className="shrink-0 text-apollo-600" /> Drug Licence {settings.licence}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn-primary px-3.5 py-2 text-[10.5px]">
                <MapPin size={13} /> Get directions
              </a>
              <a href="tel:+919871040480" className="btn-outline px-3.5 py-2 text-[10.5px]">
                <Phone size={13} /> {settings.phone.slice(0, 5)} {settings.phone.slice(5)}
              </a>
            </div>
          </div>

          <div className="relative min-h-[280px] bg-cream p-2">
            <StoreMap className="h-full min-h-[264px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "How do I order medicines from City Pharmacy online?",
    a: "Search for your medicine or upload a prescription, add items to your cart and sign in with Google. Choose a delivery slot, confirm your address and place the order. Our pharmacist verifies prescription medicines before dispatch.",
  },
  {
    q: "Is the 15% Diwali discount applied automatically?",
    a: "Yes. Every product marked with the Diwali 15% badge gets a flat 15% discount at checkout. No coupon code is needed. The offer runs from 20 October to 15 November 2026 and cannot be combined with other discounts.",
  },
  {
    q: "Which areas do you deliver to?",
    a: "We deliver across Adarsh Nagar, Azadpur, Model Town, Shalimar Bagh, Ashok Vihar and nearby parts of North Delhi. Express orders usually arrive within 90 minutes. You can also collect your order from the store.",
  },
  {
    q: "Can I upload a prescription instead of searching for medicines?",
    a: "Absolutely. Use the Upload Prescription page to share your details and prescription. Our licensed pharmacist will read it, confirm availability and call you back within 15 minutes during store hours (8am–11pm).",
  },
  {
    q: "Are the medicines genuine?",
    a: "Every product is sourced from authorised distributors and stored under the conditions recommended by the manufacturer. Our drug licence is displayed at the store and in the website footer. Cold-chain products are packed with temperature-controlled gel packs.",
  },
  {
    q: "What are the delivery charges?",
    a: "Delivery is free on orders above ₹499. Below that, a flat ₹49 delivery fee applies. There is no extra charge for cash on delivery or UPI at the doorstep.",
  },
  {
    q: "Can I return a product?",
    a: "Unopened, non-prescription products can be returned within 7 days with the original bill. For safety reasons, opened medicines, cold-chain products and prescription items cannot be returned. Read our Returns policy for details.",
  },
];

function FaqSection() {
  return (
    <section className="shell mt-10">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-5 sm:p-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Good to know</p>
              <h2 className="mt-1 text-[21px] font-extrabold text-apollo-950">Frequently asked questions</h2>
            </div>
            <span className="hidden rounded-full bg-apollo-50 px-2.5 py-1 text-[9px] font-bold text-apollo-700 sm:inline-flex">
              24×7 support
            </span>
          </div>
          <Accordion items={faqs} />
        </div>

        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl bg-sand p-5">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-200/50" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-amber-800">Have a question?</p>
            <h3 className="mt-1.5 text-lg font-extrabold leading-tight text-apollo-950">We're a phone call away.</h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink/55">
              Ask about a medicine, a delivery or your order. A real person from the store will answer.
            </p>
            <div className="mt-4 space-y-2">
              <a href="tel:+919871040480" className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-[11px] font-bold text-apollo-800 shadow-sm transition hover:bg-apollo-50">
                <span className="flex items-center gap-2"><Phone size={14} /> +91 98710 40480</span>
                <ArrowRight size={13} />
              </a>
              <Link to="/enquiry" className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-[11px] font-bold text-apollo-800 shadow-sm transition hover:bg-apollo-50">
                <span className="flex items-center gap-2"><MessageCircle size={14} /> Send a patient enquiry</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-apollo-50 text-apollo-700">
                <PackageCheck size={18} />
              </span>
              <div>
                <p className="text-[11px] font-bold text-ink">Prescription refill?</p>
                <p className="text-[9.5px] text-muted">We remember your regular medicines.</p>
              </div>
            </div>
            <p className="mt-2.5 text-[10.5px] leading-relaxed text-muted">
              Call the store or send a WhatsApp message with your name and phone number. We'll check your last order and
              arrange a refill.
            </p>
            <Link to="/prescription" className="mt-3 inline-flex items-center gap-1.5 text-[10.5px] font-bold text-apollo-700 hover:text-apollo-900">
              Request a refill <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  usePageMeta(
    "City Pharmacy | Online Pharmacy in Adarsh Nagar, Delhi",
    "Order genuine medicines, wellness essentials and health devices online from City Pharmacy, Adarsh Nagar. Flat 15% OFF this Diwali on selected items. Free delivery above ₹499.",
  );

  return (
    <div className="pb-10">
      <Hero />
      <CategoryCircles />
      <DiwaliSection />
      <Bestsellers />
      <Concerns />
      <PromoStrip />
      <StatsBand />
      <StoreSection />
      <FaqSection />
    </div>
  );
}
