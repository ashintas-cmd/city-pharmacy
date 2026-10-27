import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgePercent,
  CalendarDays,
  Check,
  Eye,
  Power,
  Save,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { saveOffer, saveProduct } from "@/lib/firestore";
import { formatDate, inr } from "@/lib/utils";
import { isOfferLive } from "@/lib/pricing";
import type { Offer } from "@/types";

export function AdminOffer() {
  const { offer, products, refresh, categories } = useCatalog();
  const toast = useToast();
  const [form, setForm] = useState<Offer | null>(offer);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (offer) setForm(offer);
  }, [offer]);

  const eligible = useMemo(
    () => products.filter((product) => product.active && product.offerEligible),
    [products],
  );
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products.filter((product) => product.active);
    return products.filter((product) => product.active && [product.name, product.brand, product.categoryId].join(" ").toLowerCase().includes(q));
  }, [products, search]);

  if (!form) {
    return (
      <div>
        <AdminPageHeader title="Diwali offer" description="Control the 15% Diwali discount" />
        <div className="rounded-2xl border border-line bg-white p-8 text-center">
          <p className="text-sm font-semibold text-ink">No offer document found</p>
          <p className="mt-1 text-[10.5px] text-muted">Create an offer named <code>diwali-15</code> in Firestore, or restore the demo catalogue from Settings.</p>
        </div>
      </div>
    );
  }

  const update = (key: keyof Offer, value: string | number | boolean | string[]) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  };

  const save = async () => {
    if (!form.title.trim() || !form.subtitle.trim()) {
      toast.error("Offer title and subtitle are required");
      return;
    }
    if (!Number(form.percent) || Number(form.percent) < 1 || Number(form.percent) > 90) {
      toast.error("Enter a discount between 1% and 90%");
      return;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      toast.error("End date must be after the start date");
      return;
    }
    setSaving(true);
    try {
      const payload: Offer = {
        ...form,
        percent: Math.round(Number(form.percent)),
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        terms: form.terms.map((term) => term.trim()).filter(Boolean),
      };
      await saveOffer(payload);
      await refresh();
      toast.success("Offer saved", "The storefront will reflect the changes immediately.");
    } catch (error) {
      console.error(error);
      toast.error("Could not save the offer");
    } finally {
      setSaving(false);
    }
  };

  const toggleProduct = async (productId: string, current: boolean) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    setTogglingId(productId);
    try {
      await saveProduct({ ...product, offerEligible: !current });
      await refresh();
    } catch {
      toast.error("Could not update the product");
    } finally {
      setTogglingId(null);
    }
  };

  const live = isOfferLive(form);
  const startInput = form.startDate.slice(0, 10);
  const endInput = form.endDate.slice(0, 10);
  const averagePrice = eligible.length ? Math.round(eligible.reduce((sum, product) => sum + product.price, 0) / eligible.length) : 0;

  return (
    <div>
      <AdminPageHeader title="Diwali offer" description="Set the discount, dates and eligible products. Changes go live instantly.">
        <Link to="/offers/diwali-15" className="btn-outline px-3 py-2 text-[10.5px]"><Eye size={13} /> Preview offer</Link>
        <button type="button" onClick={save} disabled={saving} className="btn-primary px-3 py-2 text-[10.5px]"><Save size={13} /> {saving ? "Saving…" : "Save offer"}</button>
      </AdminPageHeader>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ring-1 ${live ? "bg-apollo-50 text-apollo-700 ring-apollo-200" : "bg-amber-50 text-amber-700 ring-amber-200"}`}>
          <Power size={10} /> {live ? "Offer is live" : form.active ? "Outside date window" : "Offer paused"}
        </span>
        <span className="text-[9.5px] text-muted">{eligible.length} eligible products · {form.percent}% off</span>
        <span className="text-[9.5px] text-muted">· Ends {formatDate(form.endDate)}</span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-coral-50 text-coral-600"><BadgePercent size={16} /></span>
            <div>
              <h3 className="text-[13px] font-bold text-apollo-950">Campaign settings</h3>
              <p className="text-[9px] text-muted">Shown across the storefront and on the offers page.</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="label">Campaign title</span>
              <input value={form.title} onChange={(event) => update("title", event.target.value)} className="field" />
            </label>
            <label className="block">
              <span className="label">Eyebrow</span>
              <input value={form.eyebrow} onChange={(event) => update("eyebrow", event.target.value)} className="field" />
            </label>
            <label className="block">
              <span className="label">Badge text</span>
              <input value={form.badge} onChange={(event) => update("badge", event.target.value)} className="field" />
            </label>
            <label className="block sm:col-span-2">
              <span className="label">Subtitle</span>
              <textarea value={form.subtitle} onChange={(event) => update("subtitle", event.target.value)} rows={2} className="field resize-none" />
            </label>
            <label className="block">
              <span className="label">Discount %</span>
              <div className="relative">
                <input type="number" min="1" max="90" value={form.percent} onChange={(event) => update("percent", Number(event.target.value))} className="field pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted">%</span>
              </div>
            </label>
            <label className="flex items-end gap-2 pb-2">
              <input type="checkbox" checked={form.active} onChange={(event) => update("active", event.target.checked)} className="h-3.5 w-3.5 accent-apollo-700" />
              <span className="text-[10.5px] font-medium text-ink/75">Offer enabled</span>
            </label>
            <label className="block">
              <span className="label">Starts on</span>
              <input type="date" value={startInput} onChange={(event) => update("startDate", `${event.target.value}T00:00:00+05:30`)} className="field" />
            </label>
            <label className="block">
              <span className="label">Ends on</span>
              <input type="date" value={endInput} onChange={(event) => update("endDate", `${event.target.value}T23:59:59+05:30`)} className="field" />
            </label>
            <label className="block sm:col-span-2">
              <span className="label">Terms (one per line)</span>
              <textarea value={form.terms.join("\n")} onChange={(event) => update("terms", event.target.value.split("\n"))} rows={4} className="field resize-none" />
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl diwali-pattern p-5 text-white">
            <Sparkles size={20} className="text-amber-300" />
            <p className="mt-2 text-[8.5px] font-bold uppercase tracking-[0.18em] text-amber-200">{form.eyebrow || "Festival offer"}</p>
            <h3 className="mt-1 text-2xl font-extrabold">{form.title || "Diwali Dhamaka"}</h3>
            <p className="text-lg font-extrabold text-amber-300">Flat {form.percent}% OFF</p>
            <p className="mt-1 line-clamp-2 text-[9.5px] text-white/60">{form.subtitle}</p>
            <div className="mt-3 flex items-center gap-2 text-[8.5px] text-white/55">
              <CalendarDays size={11} /> {formatDate(form.startDate)} – {formatDate(form.endDate)}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`rounded-full px-2 py-1 text-[8px] font-bold uppercase ${live ? "bg-white text-[#5b1a12]" : "bg-white/15 text-white/70"}`}>{live ? "Live now" : "Not live"}</span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[8px] font-semibold text-white/70">{eligible.length} items</span>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Customer savings</p>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-2xl font-extrabold text-apollo-900">{form.percent}%</p>
                <p className="text-[9px] text-muted">on {eligible.length} selected products</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted">Typical saving</p>
                <p className="text-sm font-bold text-coral-600">~{inr(Math.round((averagePrice * form.percent) / 100))}</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream">
              <div className="h-full rounded-full bg-gradient-to-r from-coral-500 to-amber-400" style={{ width: `${Math.min(100, (eligible.length / Math.max(1, products.filter((p) => p.active).length)) * 100)}%` }} />
            </div>
            <p className="mt-1.5 text-[8.5px] text-muted">{eligible.length} of {products.filter((p) => p.active).length} live products are in the offer.</p>
          </div>

          {eligible[0] ? (
            <div>
              <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-muted">Storefront preview</p>
              <div className="max-w-[220px]"><ProductCard product={eligible[0]} /></div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-3">
          <div>
            <h3 className="text-[13px] font-bold text-apollo-950">Eligible products</h3>
            <p className="text-[9px] text-muted">Tick products to include them in the {form.percent}% discount.</p>
          </div>
          <div className="relative w-full max-w-[260px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="h-8 w-full rounded-lg border border-line bg-cream/50 pl-8 pr-2 text-[10px] outline-none focus:border-apollo-400" />
          </div>
        </div>
        <div className="grid max-h-[520px] gap-1 overflow-y-auto p-2 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <label key={product.id} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2 transition ${product.offerEligible ? "border-coral-200 bg-coral-50/40" : "border-line hover:bg-cream"}`}>
              <input
                type="checkbox"
                checked={product.offerEligible}
                disabled={togglingId === product.id}
                onChange={() => toggleProduct(product.id, product.offerEligible)}
                className="h-3.5 w-3.5 shrink-0 accent-coral-600"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-semibold text-ink">{product.name}</p>
                <p className="text-[8.5px] text-muted">{categories.find((c) => c.id === product.categoryId)?.name} · {inr(product.price)}</p>
              </div>
              {product.offerEligible ? <span className="flex shrink-0 items-center gap-0.5 rounded bg-white px-1.5 py-0.5 text-[7.5px] font-bold text-coral-600"><Tag size={8} /> {form.percent}%</span> : null}
              {togglingId === product.id ? <span className="text-[7.5px] text-muted">…</span> : null}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-apollo-100 bg-apollo-50/50 p-3 text-[9.5px] leading-relaxed text-apollo-900/70">
        <p className="flex items-center gap-1.5 font-bold"><Check size={12} /> How pricing works</p>
        <p className="mt-0.5">The {form.percent}% discount is calculated on the current selling price and shown as a separate “Diwali discount” line at checkout. MRP remains unchanged. The offer only applies while it is enabled and today is between {formatDate(form.startDate)} and {formatDate(form.endDate)}.</p>
      </div>
    </div>
  );
}
