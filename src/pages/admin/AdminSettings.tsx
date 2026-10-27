import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Clock3,
  Database,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Modal } from "@/components/Modal";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { saveSettings, seedCatalogToFirestore } from "@/lib/firestore";
import type { StoreSettings } from "@/types";

export function AdminSettings() {
  const { settings, refresh } = useCatalog();
  const toast = useToast();
  const [form, setForm] = useState<StoreSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [seedOpen, setSeedOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const update = (key: keyof StoreSettings, value: string | number) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.addressLine1.trim()) {
      toast.error("Store name, phone and address are required");
      return;
    }
    setSaving(true);
    try {
      await saveSettings({
        ...form,
        phone: form.phone.replace(/\D/g, "").slice(-10),
        deliveryFee: Math.max(0, Number(form.deliveryFee) || 0),
        freeDeliveryAbove: Math.max(0, Number(form.freeDeliveryAbove) || 0),
      });
      await refresh();
      toast.success("Store settings saved", "The storefront has been updated.");
    } catch (error) {
      console.error(error);
      toast.error("Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  const seed = async () => {
    setSeeding(true);
    try {
      await seedCatalogToFirestore();
      await refresh();
      toast.success("Demo catalogue restored", "56 products, categories, the offer and store settings are now in Firestore.");
      setSeedOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Could not restore the catalogue");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Store settings" description="These details appear across the storefront, footer and policies.">
        <button type="button" onClick={() => void refresh()} className="btn-outline px-3 py-2 text-[10.5px]"><RefreshCw size={13} /> Reload</button>
        <button type="button" onClick={save} disabled={saving} className="btn-primary px-3 py-2 text-[10.5px]"><Save size={13} /> {saving ? "Saving…" : "Save settings"}</button>
      </AdminPageHeader>

      <form onSubmit={save} className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-apollo-50 text-apollo-700"><Store size={16} /></span>
              <div>
                <h3 className="text-[13px] font-bold text-apollo-950">Store identity</h3>
                <p className="text-[9px] text-muted">Shown in the header, footer, invoices and policies.</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <label className="block">
                <span className="label">Store name</span>
                <input value={form.name} onChange={(event) => update("name", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="label">Owner</span>
                <input value={form.owner} onChange={(event) => update("owner", event.target.value)} className="field" />
              </label>
              <label className="block sm:col-span-2">
                <span className="label">Tagline</span>
                <input value={form.tagline} onChange={(event) => update("tagline", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="label">Phone</span>
                <input value={form.phone} onChange={(event) => update("phone", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="label">WhatsApp (with country code)</span>
                <input value={form.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="label">Email</span>
                <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="label">Support email</span>
                <input type="email" value={form.supportEmail} onChange={(event) => update("supportEmail", event.target.value)} className="field" />
              </label>
              <label className="block sm:col-span-2">
                <span className="label">Drug licence number</span>
                <input value={form.licence} onChange={(event) => update("licence", event.target.value)} className="field" />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-apollo-50 text-apollo-700"><MapPin size={16} /></span>
              <div>
                <h3 className="text-[13px] font-bold text-apollo-950">Address & hours</h3>
                <p className="text-[9px] text-muted">Used on the contact page and Google Maps link.</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="label">Address line 1</span>
                <input value={form.addressLine1} onChange={(event) => update("addressLine1", event.target.value)} className="field" />
              </label>
              <label className="block sm:col-span-2">
                <span className="label">Address line 2</span>
                <input value={form.addressLine2} onChange={(event) => update("addressLine2", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="label">City</span>
                <input value={form.city} onChange={(event) => update("city", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="label">State</span>
                <input value={form.state} onChange={(event) => update("state", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="label">Pincode</span>
                <input value={form.pincode} onChange={(event) => update("pincode", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="label">Opening hours</span>
                <input value={form.hours} onChange={(event) => update("hours", event.target.value)} className="field" />
              </label>
              <label className="block sm:col-span-2">
                <span className="label">Google Maps search query</span>
                <input value={form.mapQuery} onChange={(event) => update("mapQuery", event.target.value)} className="field" />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-apollo-50 text-apollo-700"><Truck size={16} /></span>
              <div>
                <h3 className="text-[13px] font-bold text-apollo-950">Delivery rules</h3>
                <p className="text-[9px] text-muted">These values are used to calculate cart totals.</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              <label className="block">
                <span className="label">Delivery fee (₹)</span>
                <input type="number" value={form.deliveryFee} onChange={(event) => update("deliveryFee", Number(event.target.value))} className="field" />
              </label>
              <label className="block">
                <span className="label">Free above (₹)</span>
                <input type="number" value={form.freeDeliveryAbove} onChange={(event) => update("freeDeliveryAbove", Number(event.target.value))} className="field" />
              </label>
              <label className="block">
                <span className="label">Delivery ETA</span>
                <input value={form.deliveryEta} onChange={(event) => update("deliveryEta", event.target.value)} className="field" />
              </label>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-[11px]"><Save size={14} /> {saving ? "Saving settings…" : "Save all settings"}</button>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl border border-apollo-100 bg-apollo-50/50 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-apollo-900"><ShieldCheck size={13} /> Firebase backend</p>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-apollo-900/65">
              This website stores everything in Google Cloud Firestore. Authentication supports Google sign-in and email/password.
            </p>
            <div className="mt-2 space-y-1 text-[9px] text-apollo-900/70">
              <p className="flex items-center justify-between"><span>Project</span><strong>city-pharmacy-ccfc3</strong></p>
              <p className="flex items-center justify-between"><span>Database</span><strong>Firestore (asia-south1)</strong></p>
              <p className="flex items-center justify-between"><span>Hosting</span><strong>Firebase Hosting</strong></p>
              <p className="flex items-center justify-between"><span>Auth</span><strong>Google + Email</strong></p>
            </div>
            <a href="https://console.firebase.google.com/project/city-pharmacy-ccfc3/firestore" target="_blank" rel="noreferrer" className="mt-2.5 inline-flex items-center gap-1 text-[9px] font-bold text-apollo-700 hover:underline">
              Open Firebase console <ExternalLink size={10} />
            </a>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-ink"><Clock3 size={13} className="text-apollo-600" /> Store snapshot</p>
            <div className="mt-2 space-y-1.5 text-[9.5px] text-muted">
              <p className="flex items-center gap-1.5"><Phone size={11} /> +91 {form.phone.slice(0, 5)} {form.phone.slice(5)}</p>
              <p className="flex items-center gap-1.5"><Mail size={11} /> {form.email}</p>
              <p className="flex items-center gap-1.5"><MapPin size={11} /> {form.addressLine1}, {form.city} {form.pincode}</p>
              <p className="flex items-center gap-1.5"><Truck size={11} /> Free delivery above ₹{form.freeDeliveryAbove}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-amber-900"><Database size={13} /> Demo catalogue</p>
            <p className="mt-1 text-[9.5px] leading-relaxed text-amber-900/70">
              Restore the original 56-product catalogue, categories, Diwali offer and these settings. Existing documents
              with the same IDs are overwritten.
            </p>
            <button type="button" onClick={() => setSeedOpen(true)} className="mt-2.5 rounded-lg bg-amber-900 px-3 py-2 text-[9.5px] font-bold text-white transition hover:bg-amber-950">
              Restore demo catalogue
            </button>
          </div>

          <div className="rounded-2xl border border-coral-100 bg-coral-50/40 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-coral-800"><AlertTriangle size={13} /> Security reminder</p>
            <p className="mt-1 text-[9px] leading-relaxed text-coral-800/70">
              Firestore rules restrict writes to admins. Never share your admin password or sign-in link. Review the
              admin list regularly under Team access.
            </p>
          </div>
        </aside>
      </form>

      <Modal
        open={seedOpen}
        onClose={() => setSeedOpen(false)}
        title="Restore demo catalogue?"
        description="This writes the original products, categories, offer and store settings to Firestore."
        size="sm"
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={() => setSeedOpen(false)} className="btn-outline flex-1 py-2 text-[11px]">Cancel</button>
            <button type="button" onClick={seed} disabled={seeding} className="btn-coral flex-1 py-2 text-[11px]">{seeding ? <Loader2 size={13} className="animate-spin" /> : "Restore catalogue"}</button>
          </div>
        }
      >
        <p className="text-[10.5px] leading-relaxed text-muted">
          Any edits you made to products with the same IDs will be overwritten. Orders, enquiries and messages are not
          touched. This is useful for a fresh demo or after accidental deletions.
        </p>
      </Modal>
    </div>
  );
}
