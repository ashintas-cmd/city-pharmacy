import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Gift,
  Sparkles,
  Tag,
  Truck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/PageHead";
import { ProductCard } from "@/components/ProductCard";
import { PackArt } from "@/components/PackArt";
import { OfferCountdown } from "@/components/OfferCountdown";
import { EmptyState } from "@/components/EmptyState";
import { useCatalog } from "@/context/CatalogContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { cn } from "@/lib/utils";

export function OffersPage() {
  const { slug } = useParams();
  const { offer, liveOffer, offerProducts, categories } = useCatalog();
  const [activeCategory, setActiveCategory] = useState("all");

  const current = offer;
  const isLive = Boolean(liveOffer);
  const invalidSlug = slug && slug !== "diwali-15" && slug !== current?.slug;

  const categoriesInOffer = useMemo(() => {
    const ids = new Set(offerProducts.map((product) => product.categoryId));
    return categories.filter((category) => ids.has(category.id));
  }, [offerProducts, categories]);

  const products = useMemo(() => {
    const list = activeCategory === "all" ? offerProducts : offerProducts.filter((product) => product.categoryId === activeCategory);
    return [...list].sort((a, b) => b.reviews - a.reviews);
  }, [offerProducts, activeCategory]);

  usePageMeta(
    "Diwali Dhamaka · Flat 15% OFF | City Pharmacy",
    "City Pharmacy's Diwali offer: flat 15% off on selected medicines, wellness, personal care and health devices. Discount auto-applied at checkout. Valid till 15 Nov 2026.",
  );

  if (invalidSlug || !current) {
    return (
      <div className="shell py-16">
        <EmptyState
          title="This offer isn't available"
          description="The offer you're looking for has ended or the link is incorrect. Explore our current Diwali savings instead."
          action="See current offers"
          actionTo="/offers"
        />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="relative overflow-hidden diwali-pattern">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-coral-500/10 blur-3xl" />
        <div className="shell relative py-7 sm:py-10">
          <Breadcrumbs items={[{ label: "Offers", to: "/offers" }, { label: current.title }]} />
          <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-amber-100">
                <Sparkles size={11} /> {current.eyebrow}
              </div>
              <h1 className="mt-3 text-[34px] font-extrabold leading-[0.98] tracking-tight text-white sm:text-[52px]">
                {current.title}
                <span className="mt-1 block text-amber-300">Flat {current.percent}% OFF</span>
              </h1>
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 sm:text-[13px]">
                {current.subtitle} The discount is applied automatically on every marked item — no coupon code, no
                minimum order.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a href="#offer-products" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-4 py-2.5 text-[11.5px] font-bold text-[#4a1a0a] shadow-lg transition hover:bg-amber-200">
                  Shop eligible items <ChevronRight size={14} />
                </a>
                <Link to="/shop" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-[11.5px] font-semibold text-white transition hover:bg-white/10">
                  Browse full catalogue
                </Link>
              </div>

              {isLive ? (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/45">Offer ends in</span>
                  <OfferCountdown endsAt={current.endDate} />
                </div>
              ) : (
                <p className="mt-5 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/70">
                  This offer has ended. Products are available at their regular price.
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[9.5px] font-medium text-white/50">
                <span className="flex items-center gap-1"><BadgeCheck size={11} /> Auto-applied</span>
                <span className="flex items-center gap-1"><CalendarDays size={11} /> 20 Oct – 15 Nov 2026</span>
                <span className="flex items-center gap-1"><Truck size={11} /> Free delivery above ₹499</span>
              </div>
            </div>

            <div className="hidden shrink-0 items-end gap-3 lg:flex">
              {offerProducts.slice(0, 2).map((product, index) => (
                <div
                  key={product.id}
                  className={cn(
                    "w-[170px] overflow-hidden rounded-2xl bg-white p-2 shadow-float",
                    index === 0 ? "-rotate-6" : "rotate-3 translate-y-4",
                  )}
                >
                  <div className="overflow-hidden rounded-xl bg-cream">
                    <PackArt product={product} />
                  </div>
                  <p className="mt-1.5 line-clamp-1 px-1 text-[9px] font-semibold text-muted">{product.name}</p>
                </div>
              ))}
              <div className="grid h-24 w-24 -translate-x-1/2 place-items-center rounded-full bg-coral-500 text-center shadow-float ring-8 ring-white/5">
                <div>
                  <p className="text-2xl font-extrabold leading-none text-white">{current.percent}%</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/80">off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shell -mt-0">
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { icon: Tag, title: "No coupon needed", text: "Discount applied at checkout" },
            { icon: Gift, title: `${offerProducts.length} selected items`, text: "Across 6 categories" },
            { icon: Truck, title: "Free delivery ₹499+", text: "Express in 90 minutes" },
            { icon: BadgeCheck, title: "Genuine products", text: "Sourced from authorised distributors" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-2 rounded-xl border border-line bg-white p-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-coral-50 text-coral-600">
                <item.icon size={15} />
              </span>
              <div>
                <p className="text-[10.5px] font-bold text-ink">{item.title}</p>
                <p className="mt-0.5 text-[9px] text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div id="offer-products" className="mt-7 scroll-mt-36">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">The Diwali edit</p>
              <h2 className="mt-1 text-[22px] font-extrabold text-apollo-950 sm:text-[28px]">
                {offerProducts.length} items with 15% off
              </h2>
              <p className="mt-1 text-xs text-muted">Prices below already include the Diwali discount.</p>
            </div>
            <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-white p-1 ring-1 ring-line">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition",
                  activeCategory === "all" ? "bg-apollo-700 text-white" : "text-muted hover:bg-cream",
                )}
              >
                All ({offerProducts.length})
              </button>
              {categoriesInOffer.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition",
                    activeCategory === category.id ? "bg-apollo-700 text-white" : "text-muted hover:bg-cream",
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="card p-5 sm:p-6">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-1 text-lg font-extrabold text-apollo-950">Your 15% Diwali savings, in 3 steps</h2>
            <ol className="mt-4 space-y-3">
              {[
                { title: "Pick any marked item", text: "Look for the “15% Diwali off” badge on products across the store." },
                { title: "Add it to your cart", text: "The Diwali price is shown immediately — no code to remember." },
                { title: "Checkout & save", text: "The 15% discount appears as a separate line in your order summary." },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-coral-600 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[11.5px] font-semibold text-ink">{step.title}</p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <p className="eyebrow">Offer terms</p>
            <h2 className="mt-1 text-lg font-extrabold text-apollo-950">The fine print</h2>
            <ul className="mt-3 space-y-2">
              {current.terms.map((term) => (
                <li key={term} className="flex gap-2 text-[10px] leading-relaxed text-muted">
                  <Check size={12} className="mt-0.5 shrink-0 text-apollo-600" />
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
