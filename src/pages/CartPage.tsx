import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Minus,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Store,
  Trash2,
  Truck,
  Upload,
} from "lucide-react";
import { Breadcrumbs } from "@/components/PageHead";
import { PackArt } from "@/components/PackArt";
import { QuantityStepper } from "@/components/QuantityStepper";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { inr } from "@/lib/utils";

export function CartPage() {
  const { lines, pricing, setQty, removeItem, count } = useCart();
  const { settings, liveOffer, products } = useCatalog();
  const navigate = useNavigate();

  usePageMeta("Your cart | City Pharmacy", "Review your City Pharmacy order, check Diwali savings and proceed to secure checkout.");

  const recommended = products
    .filter((product) => product.active && !lines.some((line) => line.product.id === product.id))
    .filter((product) => lines.some((line) => line.product.categoryId === product.categoryId))
    .slice(0, 5);

  const progress = Math.min(100, Math.round((pricing.subtotal / settings.freeDeliveryAbove) * 100));

  if (!count) {
    return (
      <div className="shell py-14">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add medicines, wellness picks or health devices and your Diwali 15% savings will be applied automatically."
          action="Start shopping"
          actionTo="/shop"
          secondary={
            <Link to="/offers/diwali-15" className="text-[11px] font-semibold text-coral-600 hover:underline">
              See the Diwali 15% offer
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="border-b border-line bg-white">
        <div className="shell py-5">
          <Breadcrumbs items={[{ label: "Cart" }]} />
          <div className="mt-1.5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-apollo-950 sm:text-3xl">Your cart</h1>
              <p className="mt-1 text-xs text-muted">
                {count} {count === 1 ? "item" : "items"} · Delivered from our Adarsh Nagar store
              </p>
            </div>
            <Link to="/shop" className="hidden items-center gap-1 text-[11px] font-semibold text-apollo-700 hover:text-apollo-900 sm:flex">
              <ChevronLeft size={14} /> Continue shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="shell mt-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="rounded-xl border border-line bg-white p-3">
              <div className="flex items-center justify-between gap-2 text-[10.5px]">
                <p className="flex items-center gap-1.5 font-medium text-ink/75">
                  <Truck size={14} className="text-apollo-600" />
                  {pricing.freeDeliveryGap > 0 ? (
                    <>Add <strong className="text-apollo-800">{inr(pricing.freeDeliveryGap)}</strong> more for free delivery</>
                  ) : (
                    <span className="font-semibold text-apollo-700">You've unlocked free delivery</span>
                  )}
                </p>
                <span className="text-[9.5px] text-muted">{inr(settings.freeDeliveryAbove)}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-apollo-50">
                <div className="h-full rounded-full bg-gradient-to-r from-apollo-500 to-apollo-700 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {pricing.offerDiscount > 0 ? (
              <div className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-coral-50 to-amber-50 p-3 ring-1 ring-coral-100">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral-600 text-white">
                  <Sparkles size={15} />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-coral-800">
                    Diwali {liveOffer?.percent}% OFF is applied — you're saving {inr(pricing.savings)} in total
                  </p>
                  <p className="text-[9.5px] text-coral-600/80">Discount shown in your order summary. No code needed.</p>
                </div>
              </div>
            ) : null}

            <div className="space-y-2.5">
              {lines.map(({ product, qty, unitPrice, offerApplied }) => (
                <div key={product.id} className="card relative flex gap-3 p-3">
                  <Link to={`/product/${product.slug}`} className="h-[86px] w-[86px] shrink-0 overflow-hidden rounded-xl bg-cream">
                    <PackArt product={product} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-apollo-600">{product.brand}</p>
                    <Link to={`/product/${product.slug}`} className="mt-0.5 line-clamp-2 text-[12px] font-semibold leading-tight text-ink hover:text-apollo-700">
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-[9.5px] text-muted">{product.packSize}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {offerApplied ? (
                        <span className="rounded bg-coral-50 px-1.5 py-0.5 text-[8px] font-bold uppercase text-coral-700">
                          Diwali {liveOffer?.percent}% off
                        </span>
                      ) : null}
                      {product.rx ? <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[8px] font-bold text-amber-700">Rx</span> : null}
                      {product.stock <= 8 ? <span className="text-[8.5px] font-medium text-amber-700">Only {product.stock} left</span> : null}
                    </div>
                    <div className="mt-1.5 flex items-end gap-1.5">
                      <span className="text-sm font-extrabold text-ink">{inr(unitPrice)}</span>
                      {product.mrp > unitPrice ? <span className="pb-0.5 text-[10px] text-muted line-through">{inr(product.mrp)}</span> : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="grid h-7 w-7 place-items-center rounded-lg text-muted transition hover:bg-coral-50 hover:text-coral-600"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                    <QuantityStepper value={qty} onChange={(next) => setQty(product.id, next)} max={product.stock} size="sm" />
                    <p className="text-[12px] font-bold text-apollo-800">{inr(unitPrice * qty)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/shop" className="btn-outline px-3 py-2 text-[10.5px]">
                <ChevronLeft size={13} /> Continue shopping
              </Link>
              <Link to="/prescription" className="btn-ghost px-3 py-2 text-[10.5px]">
                <Upload size={13} /> Have a prescription?
              </Link>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, text: "100% genuine products" },
                { icon: Truck, text: "90-minute delivery" },
                { icon: PackageCheck, text: "Easy 7-day returns" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 rounded-xl border border-line bg-white px-2.5 py-2 text-[9.5px] font-medium text-muted">
                  <item.icon size={13} className="text-apollo-600" /> {item.text}
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="sticky top-[152px] space-y-3">
              <div className="card p-5">
                <h2 className="text-base font-bold text-apollo-950">Order summary</h2>
                <div className="mt-3 space-y-2 text-[11px]">
                  <div className="flex justify-between text-muted">
                    <span>MRP total</span>
                    <span className="text-ink">{inr(pricing.mrpTotal)}</span>
                  </div>
                  {pricing.productSavings > 0 ? (
                    <div className="flex justify-between text-muted">
                      <span>Product savings</span>
                      <span className="font-semibold text-apollo-700">− {inr(pricing.productSavings)}</span>
                    </div>
                  ) : null}
                  {pricing.offerDiscount > 0 ? (
                    <div className="flex justify-between text-coral-600">
                      <span className="flex items-center gap-1"><Sparkles size={11} /> Diwali discount</span>
                      <span className="font-semibold">− {inr(pricing.offerDiscount)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-muted">
                    <span>Delivery fee</span>
                    <span className={pricing.deliveryFee === 0 ? "font-semibold text-apollo-700" : "text-ink"}>
                      {pricing.deliveryFee === 0 ? "FREE" : inr(pricing.deliveryFee)}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-line pt-2.5">
                    <div className="flex items-end justify-between">
                      <span className="text-sm font-bold text-ink">Total payable</span>
                      <span className="text-xl font-extrabold text-apollo-900">{inr(pricing.total)}</span>
                    </div>
                    {pricing.savings > 0 ? (
                      <p className="mt-1 text-right text-[10px] font-semibold text-apollo-700">You save {inr(pricing.savings)}</p>
                    ) : null}
                  </div>
                </div>

                <button type="button" onClick={() => navigate("/checkout")} className="btn-primary mt-4 w-full py-3 text-xs">
                  Proceed to checkout <ArrowRight size={15} />
                </button>

                <div className="mt-3 space-y-1.5 text-[9.5px] text-muted">
                  <p className="flex items-center gap-1.5"><Truck size={12} className="text-apollo-600" /> Delivery in {settings.deliveryEta} · Free above {inr(settings.freeDeliveryAbove)}</p>
                  <p className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-apollo-600" /> Secure checkout · Google sign-in</p>
                  <p className="flex items-center gap-1.5"><Store size={12} className="text-apollo-600" /> Free store pickup in 20 minutes</p>
                </div>
              </div>

              <div className="rounded-xl bg-sand p-3.5">
                <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-900">
                  <Stethoscope size={13} /> Need a pharmacist?
                </p>
                <p className="mt-1 text-[9.5px] leading-relaxed text-amber-900/60">
                  Call +91 {settings.phone.slice(0, 5)} {settings.phone.slice(5)} for dosage or substitute advice before you order.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {recommended.length ? (
          <section className="mt-9">
            <SectionHeading eyebrow="Complete your order" title="You might also need" action="View all" actionTo="/shop" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
