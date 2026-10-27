import { useMemo, useState } from "react";
import {
  BadgePercent,
  Eye,
  EyeOff,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Modal } from "@/components/Modal";
import { PackArt } from "@/components/PackArt";
import { EmptyState } from "@/components/EmptyState";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { deleteProduct, saveProduct } from "@/lib/firestore";
import { cn, inr, slugify } from "@/lib/utils";
import type { ArtType, Product } from "@/types";

type ProductForm = {
  name: string;
  brand: string;
  categoryId: string;
  packSize: string;
  mrp: string;
  price: string;
  stock: string;
  rating: string;
  reviews: string;
  rx: boolean;
  offerEligible: boolean;
  active: boolean;
  artType: ArtType;
  artHue: number;
  description: string;
  highlights: string;
  tags: string;
};

const artTypes: ArtType[] = ["box", "bottle", "tube", "device", "jar", "sachet", "strip"];

const emptyForm = (categoryId: string): ProductForm => ({
  name: "",
  brand: "",
  categoryId,
  packSize: "",
  mrp: "",
  price: "",
  stock: "25",
  rating: "4.6",
  reviews: "0",
  rx: false,
  offerEligible: false,
  active: true,
  artType: "box",
  artHue: 168,
  description: "",
  highlights: "",
  tags: "",
});

export function AdminProducts() {
  const { products, categories, refresh } = useCatalog();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [onlyOffer, setOnlyOffer] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm(categories[0]?.id ?? "medicines"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products
      .filter((product) => {
        if (categoryFilter !== "all" && product.categoryId !== categoryFilter) return false;
        if (onlyOffer && !product.offerEligible) return false;
        if (!q) return true;
        return [product.name, product.brand, product.id, product.categoryId].join(" ").toLowerCase().includes(q);
      })
      .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name));
  }, [products, search, categoryFilter, onlyOffer]);

  const counts = useMemo(
    () => ({
      total: products.length,
      active: products.filter((product) => product.active).length,
      offer: products.filter((product) => product.offerEligible).length,
      low: products.filter((product) => product.stock > 0 && product.stock <= 8).length,
      out: products.filter((product) => product.stock <= 0).length,
    }),
    [products],
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm(categories[0]?.id ?? "medicines"));
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      brand: product.brand,
      categoryId: product.categoryId,
      packSize: product.packSize,
      mrp: String(product.mrp),
      price: String(product.price),
      stock: String(product.stock),
      rating: String(product.rating),
      reviews: String(product.reviews),
      rx: product.rx,
      offerEligible: product.offerEligible,
      active: product.active,
      artType: product.art.type,
      artHue: product.art.hue,
      description: product.description,
      highlights: (product.highlights ?? []).join("\n"),
      tags: (product.tags ?? []).join(", "),
    });
    setErrors({});
    setFormOpen(true);
  };

  const update = (key: keyof ProductForm, value: string | boolean | number) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const save = async () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Product name is required.";
    if (!form.brand.trim()) next.brand = "Brand is required.";
    if (!form.packSize.trim()) next.packSize = "Pack size is required.";
    if (!Number(form.mrp) || Number(form.mrp) <= 0) next.mrp = "Enter a valid MRP.";
    if (!Number(form.price) || Number(form.price) <= 0) next.price = "Enter a valid selling price.";
    if (Number(form.price) > Number(form.mrp)) next.price = "Selling price cannot exceed MRP.";
    if (Number(form.stock) < 0) next.stock = "Stock cannot be negative.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const baseSlug = slugify(form.name);
      let id = editing?.id ?? baseSlug;
      if (!editing) {
        let suffix = 2;
        while (products.some((product) => product.id === id)) {
          id = `${baseSlug}-${suffix}`;
          suffix += 1;
        }
      }
      const product: Product = {
        id,
        slug: id,
        name: form.name.trim(),
        brand: form.brand.trim(),
        categoryId: form.categoryId,
        packSize: form.packSize.trim(),
        mrp: Math.round(Number(form.mrp)),
        price: Math.round(Number(form.price)),
        stock: Math.max(0, Math.round(Number(form.stock))),
        rating: Math.min(5, Math.max(0, Number(form.rating) || 4.5)),
        reviews: Math.max(0, Math.round(Number(form.reviews) || 0)),
        rx: form.rx,
        offerEligible: form.offerEligible,
        active: form.active,
        art: { type: form.artType, hue: form.artHue },
        description: form.description.trim() || `${form.name} from ${form.brand}, available at City Pharmacy, Adarsh Nagar.`,
        highlights: form.highlights.split("\n").map((line) => line.trim()).filter(Boolean),
        tags: form.tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean),
        ...(editing?.createdAt ? { createdAt: editing.createdAt } : {}),
      };
      await saveProduct(product);
      await refresh();
      toast.success(editing ? "Product updated" : "Product added", `${product.name} is now in the catalogue.`);
      setFormOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Could not save the product", "Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      await saveProduct({ ...product, active: !product.active });
      await refresh();
      toast.success(product.active ? "Product hidden" : "Product published", product.name);
    } catch {
      toast.error("Could not update the product");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      await refresh();
      toast.success("Product deleted", deleteTarget.name);
      setDeleteTarget(null);
    } catch {
      toast.error("Could not delete the product");
    } finally {
      setDeleting(false);
    }
  };

  const previewProduct = {
    name: form.name || "New product",
    brand: form.brand || "City Pharmacy",
    packSize: form.packSize || "1 pack",
    art: { type: form.artType, hue: form.artHue },
  };

  return (
    <div>
      <AdminPageHeader title="Products" description={`${counts.active} live · ${counts.offer} in Diwali offer · ${counts.low} low stock`}>
        <button type="button" onClick={() => void refresh()} className="btn-outline px-3 py-2 text-[10.5px]"><RefreshCw size={13} /> Refresh</button>
        <button type="button" onClick={openAdd} className="btn-primary px-3 py-2 text-[10.5px]"><Plus size={13} /> Add product</button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          { label: "Total products", value: counts.total, tone: "text-apollo-800" },
          { label: "Live", value: counts.active, tone: "text-apollo-700" },
          { label: "Diwali offer", value: counts.offer, tone: "text-coral-600" },
          { label: "Low stock", value: counts.low, tone: "text-amber-700" },
          { label: "Out of stock", value: counts.out, tone: "text-coral-600" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-line bg-white p-3">
            <p className="text-[8.5px] font-bold uppercase tracking-wider text-muted">{item.label}</p>
            <p className={cn("mt-1 text-xl font-extrabold", item.tone)}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <div className="relative w-full max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products or brands" className="h-8 w-full rounded-lg border border-line bg-cream/50 pl-8 pr-2 text-[10.5px] outline-none focus:border-apollo-400" />
          </div>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-8 rounded-lg border border-line bg-white px-2 text-[10px] outline-none">
            <option value="all">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[9.5px] font-medium text-muted">
            <input type="checkbox" checked={onlyOffer} onChange={(event) => setOnlyOffer(event.target.checked)} className="h-3 w-3 accent-coral-600" /> Diwali only
          </label>
          <p className="ml-auto text-[9px] text-muted">{filtered.length} products</p>
        </div>

        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left">
              <thead className="bg-cream/70 text-[8.5px] font-bold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-3 py-2.5">Product</th>
                  <th className="px-3 py-2.5">Category</th>
                  <th className="px-3 py-2.5">Price</th>
                  <th className="px-3 py-2.5">Stock</th>
                  <th className="px-3 py-2.5">Offer</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-[10.5px]">
                {filtered.map((product) => (
                  <tr key={product.id} className="transition hover:bg-apollo-50/20">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream"><PackArt product={product} /></div>
                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate font-semibold text-ink">{product.name}</p>
                          <p className="text-[8.5px] text-muted">{product.brand} · {product.packSize}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[9px] text-muted">{categories.find((category) => category.id === product.categoryId)?.name ?? product.categoryId}</td>
                    <td className="px-3 py-2">
                      <p className="font-bold text-apollo-800">{inr(product.price)}</p>
                      <p className="text-[8px] text-muted line-through">{inr(product.mrp)}</p>
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn("rounded-full px-2 py-0.5 text-[8.5px] font-bold", product.stock <= 0 ? "bg-coral-50 text-coral-700" : product.stock <= 8 ? "bg-amber-50 text-amber-700" : "bg-apollo-50 text-apollo-700")}>
                        {product.stock <= 0 ? "Out" : `${product.stock} left`}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {product.offerEligible ? <span className="inline-flex items-center gap-1 rounded-full bg-coral-50 px-2 py-0.5 text-[8px] font-bold uppercase text-coral-700"><BadgePercent size={9} /> 15%</span> : <span className="text-[9px] text-muted">—</span>}
                    </td>
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => toggleActive(product)} className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase", product.active ? "bg-apollo-50 text-apollo-700" : "bg-neutral-100 text-muted")}>
                        {product.active ? <Eye size={9} /> : <EyeOff size={9} />} {product.active ? "Live" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => openEdit(product)} className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-apollo-50 hover:text-apollo-700" aria-label="Edit product"><Pencil size={12} /></button>
                        <button type="button" onClick={() => setDeleteTarget(product)} className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-coral-50 hover:text-coral-600" aria-label="Delete product"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Package} title="No products match" description="Try another category or search term, or add a new product." action="Add product" actionTo="/admin/products" />
        )}
      </div>

      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[9.5px] leading-relaxed text-amber-900">
        <p className="flex items-center gap-1.5 font-bold"><TriangleAlert size={12} /> Stock and prices update the live storefront immediately.</p>
        <p className="mt-0.5 text-amber-900/70">Products marked “Offer” receive the 15% Diwali discount automatically. Hiding a product removes it from the storefront but keeps its order history.</p>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit product" : "Add a product"}
        description="Changes are written to Firestore and appear on the storefront right away."
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-2">
            <p className="hidden text-[9px] text-muted sm:block">{editing ? `ID: ${editing.id}` : "A product ID is generated automatically."}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setFormOpen(false)} className="btn-outline px-4 py-2 text-[10.5px]">Cancel</button>
              <button type="button" onClick={save} disabled={saving} className="btn-primary px-4 py-2 text-[10.5px]">{saving ? "Saving…" : editing ? "Save changes" : "Add product"}</button>
            </div>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
          <div>
            <div className="overflow-hidden rounded-xl border border-line bg-cream">
              <PackArt product={previewProduct} />
            </div>
            <label className="mt-2 block">
              <span className="label">Art type</span>
              <select value={form.artType} onChange={(event) => update("artType", event.target.value as ArtType)} className="field py-1.5 text-[10px]">
                {artTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
            <label className="mt-2 block">
              <span className="label">Pack colour</span>
              <input type="range" min={0} max={360} value={form.artHue} onChange={(event) => update("artHue", Number(event.target.value))} className="h-1.5 w-full accent-apollo-700" />
              <span className="mt-1 flex items-center gap-1.5 text-[8.5px] text-muted"><span className="h-3 w-3 rounded-full" style={{ background: `hsl(${form.artHue} 48% 42%)` }} /> Hue {form.artHue}°</span>
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="label">Product name *</span>
                <input value={form.name} onChange={(event) => update("name", event.target.value)} className="field" placeholder="e.g. Paracetamol 650mg Tablets" />
                {errors.name ? <p className="mt-1 text-[9px] text-coral-600">{errors.name}</p> : null}
              </label>
              <label className="block">
                <span className="label">Brand *</span>
                <input value={form.brand} onChange={(event) => update("brand", event.target.value)} className="field" />
                {errors.brand ? <p className="mt-1 text-[9px] text-coral-600">{errors.brand}</p> : null}
              </label>
              <label className="block">
                <span className="label">Category *</span>
                <select value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)} className="field">
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="label">Pack size *</span>
                <input value={form.packSize} onChange={(event) => update("packSize", event.target.value)} className="field" placeholder="e.g. 15 tablets" />
                {errors.packSize ? <p className="mt-1 text-[9px] text-coral-600">{errors.packSize}</p> : null}
              </label>
              <label className="block">
                <span className="label">Stock *</span>
                <input type="number" value={form.stock} onChange={(event) => update("stock", event.target.value)} className="field" />
                {errors.stock ? <p className="mt-1 text-[9px] text-coral-600">{errors.stock}</p> : null}
              </label>
              <label className="block">
                <span className="label">MRP (₹) *</span>
                <input type="number" value={form.mrp} onChange={(event) => update("mrp", event.target.value)} className="field" />
                {errors.mrp ? <p className="mt-1 text-[9px] text-coral-600">{errors.mrp}</p> : null}
              </label>
              <label className="block">
                <span className="label">Selling price (₹) *</span>
                <input type="number" value={form.price} onChange={(event) => update("price", event.target.value)} className="field" />
                {errors.price ? <p className="mt-1 text-[9px] text-coral-600">{errors.price}</p> : null}
              </label>
              <label className="block">
                <span className="label">Rating</span>
                <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(event) => update("rating", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="label">Reviews</span>
                <input type="number" value={form.reviews} onChange={(event) => update("reviews", event.target.value)} className="field" />
              </label>
            </div>

            <label className="block">
              <span className="label">Description</span>
              <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={2} className="field resize-none" />
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block">
                <span className="label">Highlights (one per line)</span>
                <textarea value={form.highlights} onChange={(event) => update("highlights", event.target.value)} rows={3} className="field resize-none" />
              </label>
              <label className="block">
                <span className="label">Tags (comma separated)</span>
                <textarea value={form.tags} onChange={(event) => update("tags", event.target.value)} rows={3} className="field resize-none" placeholder="pain, fever, immunity" />
              </label>
            </div>

            <div className="flex flex-wrap gap-3 rounded-xl bg-cream p-3">
              <label className="flex cursor-pointer items-center gap-1.5 text-[10px] font-medium text-ink/75">
                <input type="checkbox" checked={form.active} onChange={(event) => update("active", event.target.checked)} className="h-3.5 w-3.5 accent-apollo-700" /> Live on storefront
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 text-[10px] font-medium text-ink/75">
                <input type="checkbox" checked={form.rx} onChange={(event) => update("rx", event.target.checked)} className="h-3.5 w-3.5 accent-apollo-700" /> Prescription required
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 text-[10px] font-medium text-coral-700">
                <input type="checkbox" checked={form.offerEligible} onChange={(event) => update("offerEligible", event.target.checked)} className="h-3.5 w-3.5 accent-coral-600" /> Include in Diwali 15% offer
              </label>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete this product?"
        description="This removes the product from Firestore permanently. Past orders are not affected."
        size="sm"
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={() => setDeleteTarget(null)} className="btn-outline flex-1 py-2 text-[11px]">Cancel</button>
            <button type="button" onClick={confirmDelete} disabled={deleting} className="btn-coral flex-1 py-2 text-[11px]">{deleting ? "Deleting…" : "Delete product"}</button>
          </div>
        }
      >
        {deleteTarget ? (
          <div className="flex items-center gap-3 rounded-xl bg-cream p-3">
            <div className="h-12 w-12 overflow-hidden rounded-lg bg-white"><PackArt product={deleteTarget} /></div>
            <div>
              <p className="text-[11px] font-bold text-ink">{deleteTarget.name}</p>
              <p className="text-[9px] text-muted">{deleteTarget.brand} · {deleteTarget.packSize}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
