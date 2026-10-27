import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  Filter,
  RotateCcw,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { PageHead } from "@/components/PageHead";
import { ProductCard } from "@/components/ProductCard";
import { Modal } from "@/components/Modal";
import { EmptyState } from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Skeletons";
import { CategoryIcon, categoryTones } from "@/components/CategoryIcon";
import { useCatalog } from "@/context/CatalogContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getUnitPricing } from "@/lib/pricing";
import { cn, inr } from "@/lib/utils";
import type { Product } from "@/types";

const MAX_PRICE = 3000;

const sortOptions = [
  { value: "popular", label: "Most popular" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
  { value: "discount", label: "Biggest discount" },
  { value: "name", label: "Name: A to Z" },
];

const concernLabels: Record<string, string> = {
  pain: "Pain relief",
  immunity: "Immunity",
  diabetes: "Diabetes care",
  heart: "Heart care",
  skin: "Skin & hair",
  baby: "Baby care",
  digestion: "Digestion",
  cold: "Cold & cough",
  fitness: "Fitness",
  bones: "Bone health",
  joints: "Joint care",
  hair: "Hair care",
  sleep: "Sleep & stress",
  devices: "Health devices",
};

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-line py-3 last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-bold uppercase tracking-wider text-apollo-900">
        {title}
        <ChevronDown size={14} className="text-muted transition group-open:rotate-180" />
      </summary>
      <div className="mt-2.5">{children}</div>
    </details>
  );
}

export function ShopPage() {
  const { categories, products, liveOffer, loading, offer } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilters, setMobileFilters] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const q = searchParams.get("q") ?? "";
  const categorySlug = searchParams.get("category") ?? "";
  const concern = searchParams.get("concern") ?? "";
  const selectedBrands = (searchParams.get("brand") ?? "").split(",").filter(Boolean);
  const maxPrice = Number(searchParams.get("maxPrice")) || MAX_PRICE;
  const offerOnly = searchParams.get("offer") === "1";
  const rxFree = searchParams.get("rx") === "free";
  const inStockOnly = searchParams.get("stock") === "1";
  const sort = searchParams.get("sort") ?? "popular";

  const category = categories.find((item) => item.id === categorySlug || item.slug === categorySlug);
  const brands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of products) {
      if (!product.active) continue;
      counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const toggleBrand = (brand: string) => {
    const next = new Set(selectedBrands);
    if (next.has(brand)) next.delete(brand);
    else next.add(brand);
    setParam("brand", Array.from(next).join(",") || null);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    setSearchParams(next, { replace: true });
  };

  const activeFilterCount = [
    Boolean(selectedBrands.length),
    maxPrice < MAX_PRICE,
    offerOnly,
    rxFree,
    inStockOnly,
    Boolean(concern),
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = products.filter((product) => product.active);

    if (categorySlug) {
      list = list.filter((product) => product.categoryId === categorySlug || categories.find((c) => c.slug === categorySlug)?.id === product.categoryId);
    }
    if (query) {
      list = list.filter((product) => {
        const haystack = [
          product.name,
          product.brand,
          product.packSize,
          product.description,
          ...(product.tags ?? []),
          categories.find((c) => c.id === product.categoryId)?.name ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return query.split(/\s+/).every((term) => haystack.includes(term));
      });
    }
    if (concern) {
      list = list.filter((product) => product.tags?.includes(concern));
    }
    if (selectedBrands.length) {
      list = list.filter((product) => selectedBrands.includes(product.brand));
    }
    if (maxPrice < MAX_PRICE) {
      list = list.filter((product) => getUnitPricing(product, offer).unitPrice <= maxPrice);
    }
    if (offerOnly) {
      list = list.filter((product) => product.offerEligible && Boolean(liveOffer));
    }
    if (rxFree) {
      list = list.filter((product) => !product.rx);
    }
    if (inStockOnly) {
      list = list.filter((product) => product.stock > 0);
    }

    const priceOf = (product: Product) => getUnitPricing(product, offer).unitPrice;
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => priceOf(a) - priceOf(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => priceOf(b) - priceOf(a));
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        sorted.sort(
          (a, b) =>
            (b.mrp - priceOf(b)) / b.mrp - (a.mrp - priceOf(a)) / a.mrp,
        );
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => b.reviews - a.reviews);
    }
    return sorted;
  }, [products, categories, categorySlug, q, concern, selectedBrands, maxPrice, offerOnly, liveOffer, rxFree, inStockOnly, sort, offer]);

  const title = q ? `Search results for “${q}”` : category ? category.name : concern ? concernLabels[concern] ?? "Health concern" : "All products";
  const description = q
    ? `Showing products that match your search at City Pharmacy, Adarsh Nagar.`
    : category
      ? category.description
      : "Genuine medicines, wellness picks and health essentials from our Adarsh Nagar store.";

  usePageMeta(`${title} | City Pharmacy`, description);

  const filters = (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-apollo-900">Filters</p>
        {activeFilterCount > 0 || categorySlug ? (
          <button type="button" onClick={clearFilters} className="flex items-center gap-1 text-[9.5px] font-bold text-coral-600 hover:text-coral-700">
            <RotateCcw size={10} /> Clear all
          </button>
        ) : null}
      </div>

      <FilterGroup title="Categories">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setParam("category", null)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[11px] transition",
              !categorySlug ? "bg-apollo-50 font-semibold text-apollo-800" : "text-ink/70 hover:bg-cream",
            )}
          >
            All categories
            <span className="text-[9px] text-muted">{products.filter((p) => p.active).length}</span>
          </button>
          {categories.map((item) => {
            const count = products.filter((product) => product.active && product.categoryId === item.id).length;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setParam("category", item.slug)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[11px] transition",
                  category?.id === item.id ? "bg-apollo-50 font-semibold text-apollo-800" : "text-ink/70 hover:bg-cream",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className={cn("grid h-5 w-5 place-items-center rounded", categoryTones[item.tone])}>
                    <CategoryIcon name={item.icon} size={11} />
                  </span>
                  {item.name}
                </span>
                <span className="text-[9px] text-muted">{count}</span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="flex items-center justify-between text-[10.5px] text-muted">
          <span>₹0</span>
          <span className="font-bold text-apollo-800">Up to {inr(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={50}
          max={MAX_PRICE}
          step={50}
          value={maxPrice}
          onChange={(event) => setParam("maxPrice", event.target.value === String(MAX_PRICE) ? null : event.target.value)}
          className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-apollo-100 accent-apollo-700"
          aria-label="Maximum price"
        />
      </FilterGroup>

      <FilterGroup title="Brands">
        <div className="space-y-1.5">
          {(showAllBrands ? brands : brands.slice(0, 7)).map(([brand, count]) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2 text-[10.5px] text-ink/75">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="h-3.5 w-3.5 rounded border-line accent-apollo-700"
              />
              <span className="flex-1">{brand}</span>
              <span className="text-[9px] text-muted">{count}</span>
            </label>
          ))}
          {brands.length > 7 ? (
            <button type="button" onClick={() => setShowAllBrands((value) => !value)} className="text-[9.5px] font-bold text-apollo-600 hover:underline">
              {showAllBrands ? "Show fewer" : `Show all ${brands.length} brands`}
            </button>
          ) : null}
        </div>
      </FilterGroup>

      <FilterGroup title="Offers & availability">
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-coral-50/60 px-2 py-1.5 text-[10.5px] font-medium text-coral-700">
            <input type="checkbox" checked={offerOnly} onChange={() => setParam("offer", offerOnly ? null : "1")} className="h-3.5 w-3.5 accent-coral-600" />
            Diwali 15% OFF items
          </label>
          <label className="flex cursor-pointer items-center gap-2 px-2 text-[10.5px] text-ink/75">
            <input type="checkbox" checked={rxFree} onChange={() => setParam("rx", rxFree ? null : "free")} className="h-3.5 w-3.5 accent-apollo-700" />
            No prescription needed
          </label>
          <label className="flex cursor-pointer items-center gap-2 px-2 text-[10.5px] text-ink/75">
            <input type="checkbox" checked={inStockOnly} onChange={() => setParam("stock", inStockOnly ? null : "1")} className="h-3.5 w-3.5 accent-apollo-700" />
            In stock only
          </label>
        </div>
      </FilterGroup>

      <FilterGroup title="Health concern">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(concernLabels).slice(0, 10).map(([tag, label]) => (
            <button
              key={tag}
              type="button"
              onClick={() => setParam("concern", concern === tag ? null : tag)}
              className={cn(
                "rounded-full border px-2 py-1 text-[9.5px] font-medium transition",
                concern === tag ? "border-apollo-600 bg-apollo-700 text-white" : "border-line text-ink/65 hover:border-apollo-300",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <div className="pb-12">
      <PageHead
        title={title}
        description={description}
        breadcrumbs={[{ label: "Shop", to: category ? "/shop" : undefined }, ...(category ? [{ label: category.name }] : [])]}
      >
        {liveOffer ? (
          <Link to={`/offers/${liveOffer.slug}`} className="inline-flex items-center gap-1.5 self-start rounded-full bg-coral-50 px-3 py-1.5 text-[10px] font-bold text-coral-700 ring-1 ring-coral-100">
            <Sparkles size={11} /> Diwali 15% OFF auto-applied <Tag size={10} />
          </Link>
        ) : null}
      </PageHead>

      <div className="shell mt-5">
        <div className="grid gap-5 lg:grid-cols-[236px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-[152px] max-h-[calc(100vh-170px)] overflow-y-auto rounded-2xl border border-line bg-white p-3.5">
              {filters}
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-white p-2.5">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setMobileFilters(true)} className="btn-outline px-2.5 py-1.5 text-[10.5px] lg:hidden">
                  <SlidersHorizontal size={13} /> Filters
                  {activeFilterCount ? (
                    <span className="grid h-4 min-w-4 place-items-center rounded-full bg-apollo-700 px-1 text-[8px] font-bold text-white">{activeFilterCount}</span>
                  ) : null}
                </button>
                <p className="text-[11px] font-medium text-muted">
                  <span className="font-bold text-ink">{filtered.length}</span> products
                  {category ? <span> in {category.name}</span> : null}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Filter size={13} className="text-muted" />
                <select
                  value={sort}
                  onChange={(event) => setParam("sort", event.target.value === "popular" ? null : event.target.value)}
                  className="h-8 rounded-lg border border-line bg-white px-2 text-[10.5px] font-medium text-ink outline-none focus:border-apollo-400"
                  aria-label="Sort products"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {(selectedBrands.length || concern || offerOnly || rxFree || maxPrice < MAX_PRICE || inStockOnly) ? (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {selectedBrands.map((brand) => (
                  <button key={brand} type="button" onClick={() => toggleBrand(brand)} className="chip bg-apollo-50 text-apollo-800">
                    {brand} <X size={11} />
                  </button>
                ))}
                {maxPrice < MAX_PRICE ? (
                  <button type="button" onClick={() => setParam("maxPrice", null)} className="chip bg-apollo-50 text-apollo-800">
                    Under {inr(maxPrice)} <X size={11} />
                  </button>
                ) : null}
                {concern ? (
                  <button type="button" onClick={() => setParam("concern", null)} className="chip bg-apollo-50 text-apollo-800">
                    {concernLabels[concern] ?? concern} <X size={11} />
                  </button>
                ) : null}
                {offerOnly ? (
                  <button type="button" onClick={() => setParam("offer", null)} className="chip bg-coral-50 text-coral-700">
                    Diwali offer <X size={11} />
                  </button>
                ) : null}
                {rxFree ? (
                  <button type="button" onClick={() => setParam("rx", null)} className="chip bg-apollo-50 text-apollo-800">
                    No Rx <X size={11} />
                  </button>
                ) : null}
                {inStockOnly ? (
                  <button type="button" onClick={() => setParam("stock", null)} className="chip bg-apollo-50 text-apollo-800">
                    In stock <X size={11} />
                  </button>
                ) : null}
              </div>
            ) : null}

            <div className="mt-3">
              {loading ? (
                <GridSkeleton count={10} />
              ) : filtered.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={SearchX}
                  title="No products match those filters"
                  description="Try removing a filter or searching for a different medicine, brand or health concern."
                  action="Clear all filters"
                  actionTo="/shop"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal open={mobileFilters} onClose={() => setMobileFilters(false)} title="Filter products" description="Refine by category, price, brand or offer." size="sm" footer={
        <div className="flex gap-2">
          <button type="button" onClick={clearFilters} className="btn-outline flex-1 py-2 text-[11px]">Clear all</button>
          <button type="button" onClick={() => setMobileFilters(false)} className="btn-primary flex-1 py-2 text-[11px]">Show {filtered.length} products</button>
        </div>
      }>
        {filters}
      </Modal>
    </div>
  );
}
