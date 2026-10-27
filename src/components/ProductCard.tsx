import { Link } from "react-router-dom";
import { Plus, ShieldCheck, Star, AlertTriangle } from "lucide-react";
import { PackArt } from "@/components/PackArt";
import { QuantityStepper } from "@/components/QuantityStepper";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { getUnitPricing } from "@/lib/pricing";
import { cn, compactNumber, inr } from "@/lib/utils";
import type { Product } from "@/types";

export function RatingStars({ rating, reviews }: { rating: number; reviews?: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="flex items-center gap-1 text-[11px] font-semibold text-apollo-800">
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={11}
            className={i < rounded ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"}
          />
        ))}
      </span>
      <span>{rating.toFixed(1)}</span>
      {typeof reviews === "number" ? (
        <span className="font-normal text-muted">({compactNumber(reviews)})</span>
      ) : null}
    </span>
  );
}

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { offer } = useCatalog();
  const { addItem, getQty, setQty, removeItem } = useCart();
  const pricing = getUnitPricing(product, offer);
  const qty = getQty(product.id);
  const discount = Math.max(0, Math.round(((product.mrp - pricing.unitPrice) / product.mrp) * 100));
  const lowStock = product.stock > 0 && product.stock <= 8;
  const outOfStock = product.stock <= 0;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-apollo-200 hover:shadow-card",
        className,
      )}
    >
      <div className="relative m-2 mb-0 overflow-hidden rounded-xl bg-cream">
        <Link to={`/product/${product.slug}`} aria-label={product.name} className="block aspect-[1.06]">
          <PackArt product={product} className="transition-transform duration-500 group-hover:scale-[1.04]" />
        </Link>

        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {pricing.offerApplied ? (
            <span className="rounded-md bg-coral-600 px-1.5 py-1 text-[9.5px] font-bold uppercase leading-none tracking-wide text-white shadow-sm">
              {pricing.offerPercent}% Diwali off
            </span>
          ) : discount > 0 ? (
            <span className="rounded-md bg-apollo-700 px-1.5 py-1 text-[9.5px] font-bold uppercase leading-none tracking-wide text-white">
              {discount}% off
            </span>
          ) : null}
          {product.rx ? (
            <span className="flex items-center gap-0.5 rounded-md border border-apollo-200 bg-white/95 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wide text-apollo-800">
              <ShieldCheck size={10} /> Rx
            </span>
          ) : null}
        </div>

        {lowStock ? (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700 ring-1 ring-amber-200">
            <AlertTriangle size={9} /> {product.stock} left
          </span>
        ) : null}
        {outOfStock ? (
          <span className="absolute inset-x-2 bottom-2 rounded-lg bg-ink/80 py-1.5 text-center text-[10px] font-semibold text-white">
            Out of stock
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3 pt-2.5">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-apollo-600">{product.brand}</p>
        <Link
          to={`/product/${product.slug}`}
          className="mt-1 line-clamp-2 min-h-[34px] text-[13px] font-semibold leading-[1.32] text-ink transition hover:text-apollo-700"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-[10.5px] text-muted">{product.packSize}</p>

        <div className="mt-1.5">
          <RatingStars rating={product.rating} reviews={product.reviews} />
        </div>

        <div className="mt-auto pt-2.5">
          <div className="flex items-end gap-1.5">
            <span className="text-[16px] font-extrabold tracking-tight text-ink">{inr(pricing.unitPrice)}</span>
            {product.mrp > pricing.unitPrice ? (
              <span className="pb-0.5 text-[11px] text-muted line-through">{inr(product.mrp)}</span>
            ) : null}
            {product.mrp > pricing.unitPrice ? (
              <span className="pb-0.5 text-[10px] font-bold text-coral-600">{discount}% off</span>
            ) : null}
          </div>

          <div className="mt-2">
            {outOfStock ? (
              <button type="button" disabled className="btn-outline w-full py-1.5 text-[11.5px] opacity-60">
                Notify me
              </button>
            ) : qty > 0 ? (
              <QuantityStepper
                value={qty}
                onChange={(next) => (next <= 0 ? removeItem(product.id) : setQty(product.id, next))}
                max={product.stock}
                size="sm"
                className="w-full justify-between"
              />
            ) : (
              <button
                type="button"
                onClick={() => addItem(product.id)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-apollo-300 bg-white py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-apollo-700 transition hover:border-apollo-600 hover:bg-apollo-700 hover:text-white"
              >
                <Plus size={13} strokeWidth={2.8} /> Add
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
