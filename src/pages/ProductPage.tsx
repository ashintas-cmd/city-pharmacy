import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  HeartPulse,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Store,
  Truck,
  Upload,
  Zap,
} from "lucide-react";
import { Breadcrumbs } from "@/components/PageHead";
import { PackArt } from "@/components/PackArt";
import { ProductCard, RatingStars } from "@/components/ProductCard";
import { QuantityStepper } from "@/components/QuantityStepper";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getUnitPricing } from "@/lib/pricing";
import { cn, compactNumber, inr } from "@/lib/utils";
import type { Product } from "@/types";

function DeliveryCheck({ pincode }: { pincode: string }) {
  const { settings } = useCatalog();
  const [value, setValue] = useState(pincode);
  const [result, setResult] = useState<"idle" | "ok" | "far">("idle");

  return (
    <div className="rounded-xl border border-line bg-cream/70 p-3">
      <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-ink">
        <Truck size={13} className="text-apollo-700" /> Check delivery availability
      </p>
      <div className="mt-2 flex gap-1.5">
        <div className="relative flex-1">
          <MapPin size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={value}
            onChange={(event) => {
              setValue(event.target.value.replace(/\D/g, "").slice(0, 6));
              setResult("idle");
            }}
            placeholder="Enter 6-digit pincode"
            className="h-8 w-full rounded-lg border border-line bg-white pl-7 pr-2 text-[10.5px] outline-none focus:border-apollo-400"
            inputMode="numeric"
          />
        </div>
        <button
          type="button"
          onClick={() => setResult(value === settings.pincode || value.startsWith("110") ? "ok" : "far")}
          disabled={value.length !== 6}
          className="rounded-lg bg-apollo-700 px-2.5 text-[10px] font-semibold text-white disabled:opacity-50"
        >
          Check
        </button>
      </div>
      {result === "ok" ? (
        <p className="mt-1.5 flex items-center gap-1 text-[9.5px] font-medium text-apollo-700">
          <Check size={11} /> Delivers today by 9 PM · Free over {inr(settings.freeDeliveryAbove)}
        </p>
      ) : result === "far" ? (
        <p className="mt-1.5 text-[9.5px] font-medium text-amber-700">
          We currently deliver nearby {settings.pincode}. Call us to arrange a courier.
        </p>
      ) : (
        <p className="mt-1.5 text-[9px] text-muted">Express delivery from our Adarsh Nagar store.</p>
      )}
    </div>
  );
}

export function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProduct, getCategory, offer, liveOffer, products, settings, loading } = useCatalog();
  const { addItem, getQty, setQty } = useCart();
  const { user } = useAuth();
  const [qty, setLocalQty] = useState(1);

  const product = slug ? getProduct(slug) : undefined;
  const category = product ? getCategory(product.categoryId) : undefined;
  const pricing = product ? getUnitPricing(product, offer) : null;
  const discount = product && pricing ? Math.round(((product.mrp - pricing.unitPrice) / product.mrp) * 100) : 0;
  const inCart = product ? getQty(product.id) : 0;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setLocalQty(1);
  }, [slug]);

  usePageMeta(
    product ? `${product.name} · ${product.brand} | City Pharmacy` : "Product | City Pharmacy",
    product ? `Buy ${product.name} (${product.packSize}) online from City Pharmacy, Adarsh Nagar, Delhi. ${pricing?.offerApplied ? `Flat ${pricing.offerPercent}% Diwali discount applied.` : ""}` : undefined,
  );

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.active && item.categoryId === product.categoryId && item.id !== product.id)
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 5);
  }, [product, products]);

  if (loading && !product) {
    return (
      <div className="shell py-12">
        <div className="h-64 animate-pulse rounded-3xl bg-white" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="shell py-16">
        <EmptyState
          title="We couldn't find that product"
          description="It may have been moved or is temporarily unavailable. Explore our full catalogue instead."
          action="Back to shop"
          actionTo="/shop"
        />
      </div>
    );
  }

  const addNow = () => {
    addItem(product.id, qty);
    setLocalQty(1);
  };

  const buyNow = () => {
    addItem(product.id, qty);
    navigate("/checkout");
  };

  return (
    <div className="pb-12">
      <div className="border-b border-line bg-white">
        <div className="shell py-3">
          <Breadcrumbs
            items={[
              { label: "Shop", to: "/shop" },
              ...(category ? [{ label: category.name, to: `/shop?category=${category.slug}` }] : []),
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="shell mt-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-white">
              <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
                {pricing?.offerApplied ? (
                  <span className="rounded-lg bg-coral-600 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    {pricing.offerPercent}% Diwali off
                  </span>
                ) : null}
                {product.rx ? (
                  <span className="rounded-lg border border-apollo-200 bg-white/95 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-apollo-800">
                    Prescription required
                  </span>
                ) : null}
              </div>
              <div className="mx-auto aspect-square max-h-[520px] w-full max-w-[520px]">
                <PackArt product={product} variant="detail" />
              </div>
              <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1.5 text-[9px] font-semibold text-apollo-800 shadow-sm backdrop-blur">
                <BadgeCheck size={11} /> Genuine · Pack image for illustration
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: ShieldCheck, label: "100% genuine" },
                { icon: Truck, label: "90-min delivery" },
                { icon: RotateCcw, label: "7-day returns" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-white px-2 py-3 text-center">
                  <item.icon size={17} className="text-apollo-600" />
                  <span className="text-[9px] font-semibold text-ink/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-apollo-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-apollo-700">
                {product.brand}
              </span>
              <span className="rounded-full bg-cream px-2.5 py-1 text-[9px] font-medium text-muted">{category?.name}</span>
              {product.rx ? (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-700">Rx</span>
              ) : (
                <span className="rounded-full bg-apollo-50 px-2.5 py-1 text-[9px] font-bold text-apollo-700">OTC</span>
              )}
            </div>

            <h1 className="mt-2.5 text-[26px] font-extrabold leading-tight tracking-tight text-apollo-950 sm:text-[30px]">
              {product.name}
            </h1>
            <p className="mt-1 text-xs text-muted">
              {product.packSize} · Sold by City Pharmacy, Adarsh Nagar
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-3">
              <RatingStars rating={product.rating} reviews={product.reviews} />
              <span className="flex items-center gap-1 text-[10px] font-medium text-apollo-700">
                <BadgeCheck size={12} /> {compactNumber(product.reviews)} verified buyers
              </span>
              <span className="h-3 w-px bg-line" />
              <span className={cn("text-[10px] font-semibold", product.stock > 8 ? "text-apollo-700" : product.stock > 0 ? "text-amber-700" : "text-coral-600")}>
                {product.stock > 8 ? "In stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of stock"}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-end gap-2">
                <span className="text-[30px] font-extrabold leading-none tracking-tight text-ink">{inr(pricing?.unitPrice ?? product.price)}</span>
                {product.mrp > (pricing?.unitPrice ?? product.price) ? (
                  <>
                    <span className="pb-0.5 text-sm text-muted line-through">{inr(product.mrp)}</span>
                    <span className="mb-0.5 rounded-md bg-coral-50 px-1.5 py-0.5 text-[11px] font-bold text-coral-700">{discount}% off</span>
                  </>
                ) : null}
              </div>
              <p className="mt-1 text-[10px] text-muted">Inclusive of all taxes · MRP is set by the manufacturer</p>

              {pricing?.offerApplied && liveOffer ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-coral-50 to-amber-50 px-3 py-2.5 ring-1 ring-coral-100">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-coral-600 text-white">
                    <Sparkles size={13} />
                  </span>
                  <div className="text-[10.5px] leading-tight">
                    <p className="font-bold text-coral-800">
                      Diwali {pricing.offerPercent}% OFF applied · You save {inr(pricing.offerSavings)}
                    </p>
                    <p className="text-[9px] text-coral-600/80">Auto-applied. No coupon required.</p>
                  </div>
                  <Link to={`/offers/${liveOffer.slug}`} className="ml-auto hidden text-[9px] font-bold text-coral-700 hover:underline sm:block">
                    View offer
                  </Link>
                </div>
              ) : null}

              {product.rx ? (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-800 ring-1 ring-amber-100">
                  <Upload size={13} className="mt-0.5 shrink-0" />
                  <span>
                    This medicine needs a valid prescription. Add it to your cart, then upload or WhatsApp your
                    prescription — our pharmacist will verify before dispatch.
                  </span>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <QuantityStepper value={qty} onChange={setLocalQty} max={Math.max(1, product.stock)} size="lg" />
                <button
                  type="button"
                  onClick={inCart > 0 ? () => setQty(product.id, qty) : addNow}
                  disabled={product.stock <= 0}
                  className="btn-primary h-12 flex-1 px-5 sm:flex-none"
                >
                  <ShoppingBag size={16} />
                  {product.stock <= 0 ? "Out of stock" : inCart > 0 ? "Update cart" : "Add to cart"}
                </button>
                <button
                  type="button"
                  onClick={buyNow}
                  disabled={product.stock <= 0}
                  className="btn-outline h-12 flex-1 px-5 sm:flex-none"
                >
                  <Zap size={15} /> Buy now
                </button>
              </div>
              {inCart > 0 ? (
                <p className="mt-2 text-[10px] font-medium text-apollo-700">
                  {inCart} {inCart === 1 ? "unit" : "units"} already in your cart ·{" "}
                  <Link to="/cart" className="font-bold underline decoration-apollo-300 underline-offset-2">
                    View cart
                  </Link>
                </p>
              ) : null}

              <div className="mt-3">
                <DeliveryCheck pincode={settings.pincode} />
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-sm font-bold text-apollo-950">Why this product</h2>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {product.highlights?.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-[11px] leading-relaxed text-ink/70">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-apollo-50 text-apollo-700">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 rounded-xl bg-cream p-3">
              <a href={`tel:+91${settings.phone}`} className="flex items-center gap-1.5 text-[10px] font-semibold text-apollo-800">
                <Stethoscope size={13} /> Ask a pharmacist
              </a>
              <span className="hidden h-3 w-px bg-line sm:block" />
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi City Pharmacy, I have a question about ${product.name}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-semibold text-apollo-800"
              >
                WhatsApp the store <ChevronRight size={11} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="text-base font-bold text-apollo-950">Product details</h2>
              <p className="mt-2 text-[12px] leading-relaxed text-ink/65">{product.description}</p>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-xl bg-cream p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Composition / pack</p>
                  <p className="mt-1 text-[11px] font-medium text-ink">{product.packSize} · {product.brand}</p>
                </div>
                <div className="rounded-xl bg-cream p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Storage</p>
                  <p className="mt-1 text-[11px] font-medium text-ink">Store below 30°C, away from direct sunlight and moisture.</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-apollo-900">How to use</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    Use as directed on the pack or by your doctor. Do not exceed the recommended dose. For
                    prescription medicines, follow the dosage written on your prescription.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-apollo-900">Safety information</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    Keep out of reach of children. Check the expiry date before use. If you are pregnant, breastfeeding
                    or taking other medicines, speak to our pharmacist or your doctor first. This information is not a
                    substitute for professional medical advice.
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="text-base font-bold text-apollo-950">Delivery & returns</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Truck, title: "90-minute express", text: "Adarsh Nagar & nearby areas. Free above ₹499." },
                  { icon: Store, title: "Store pickup", text: "Ready in 20 minutes from our main market store." },
                  { icon: RotateCcw, title: "7-day returns", text: "Unopened, non-prescription items with the bill." },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-line p-3">
                    <item.icon size={16} className="text-apollo-600" />
                    <p className="mt-2 text-[11px] font-bold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-[9.5px] leading-relaxed text-muted">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="card p-5">
              <p className="eyebrow">Our promise</p>
              <h2 className="mt-1 text-base font-bold text-apollo-950">From our shelf to your door</h2>
              <ul className="mt-3 space-y-2.5">
                {[
                  { icon: ShieldCheck, title: "Batch-verified stock", text: "Every pack checked on arrival." },
                  { icon: HeartPulse, title: "Pharmacist reviewed", text: "Rx orders verified before dispatch." },
                  { icon: Clock3, title: "Open 24 × 7", text: "Emergency medicines, anytime." },
                ].map((item) => (
                  <li key={item.title} className="flex gap-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-apollo-50 text-apollo-700">
                      <item.icon size={14} />
                    </span>
                    <span>
                      <span className="block text-[11px] font-semibold text-ink">{item.title}</span>
                      <span className="block text-[9.5px] text-muted">{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-apollo-900 p-5 text-white">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full border-[16px] border-white/5" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-apollo-200">Need help choosing?</p>
              <h3 className="mt-1.5 text-base font-extrabold">Talk to our pharmacist</h3>
              <p className="mt-1 text-[10.5px] leading-relaxed text-white/60">
                Free guidance on dosage, substitutes and interactions. No appointment needed.
              </p>
              <a href={`tel:+91${settings.phone}`} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[10px] font-bold text-apollo-900">
                Call {settings.phone.slice(0, 5)} {settings.phone.slice(5)}
              </a>
            </div>
          </div>
        </div>

        {related.length ? (
          <section className="mt-10">
            <SectionHeading
              eyebrow="You may also need"
              title={`More from ${category?.name ?? "our shelves"}`}
              action="View category"
              actionTo={category ? `/shop?category=${category.slug}` : "/shop"}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {related.map((item: Product) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
