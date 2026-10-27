import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Clock3,
  Home,
  Laptop,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { PageHead } from "@/components/PageHead";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/Modal";
import { StatusBadge } from "@/components/OrderStatus";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { fetchMyOrders, saveProfile } from "@/lib/firestore";
import { formatDate, inr, validPhone } from "@/lib/utils";
import { usePageMeta } from "@/hooks/usePageMeta";
import { cn } from "@/lib/utils";
import type { Address, Order } from "@/types";

const emptyAddress: Address = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "North West Delhi",
  state: "Delhi",
  pincode: "110033",
};

export function AccountPage() {
  const { user, profile, logout, reloadProfile, isAdmin } = useAuth();
  const { settings } = useCatalog();
  const toast = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [addressOpen, setAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<Address>(emptyAddress);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  usePageMeta("My account | City Pharmacy", "Manage your City Pharmacy profile, saved delivery addresses and order history.");

  useEffect(() => {
    setName(profile?.displayName ?? user?.displayName ?? "");
    setPhone(profile?.phone ?? profile?.addresses?.[0]?.phone ?? "");
  }, [profile, user]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!user) return;
      setOrdersLoading(true);
      try {
        const result = await fetchMyOrders(user.uid);
        if (alive) setOrders(result.slice(0, 3));
      } catch {
        /* silent — orders page shows details */
      } finally {
        if (alive) setOrdersLoading(false);
      }
    };
    void load();
    return () => {
      alive = false;
    };
  }, [user]);

  const addresses = useMemo(() => profile?.addresses ?? [], [profile]);

  const saveContact = async () => {
    if (!user) return;
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (phone && !validPhone(phone)) {
      toast.error("Check your phone number", "Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setSaving(true);
    try {
      await saveProfile({ uid: user.uid, displayName: name.trim(), phone: phone.trim() });
      await reloadProfile();
      toast.success("Profile updated");
    } catch (error) {
      console.error(error);
      toast.error("Could not save your profile");
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    setEditingAddress(null);
    setAddressForm({ ...emptyAddress, name: profile?.displayName ?? "", phone: profile?.phone ?? "" });
    setAddressErrors({});
    setAddressOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({ ...address });
    setAddressErrors({});
    setAddressOpen(true);
  };

  const persistAddresses = async (next: Address[]) => {
    if (!user) return;
    await saveProfile({ uid: user.uid, addresses: next });
    await reloadProfile();
  };

  const saveAddress = async () => {
    const next: Record<string, string> = {};
    if (!addressForm.name.trim()) next.name = "Enter the recipient's name.";
    if (!validPhone(addressForm.phone)) next.phone = "Enter a valid mobile number.";
    if (!addressForm.line1.trim()) next.line1 = "Enter the house / street.";
    if (!addressForm.city.trim()) next.city = "Enter the city.";
    if (!/^\d{6}$/.test(addressForm.pincode)) next.pincode = "Enter a 6-digit pincode.";
    setAddressErrors(next);
    if (Object.keys(next).length) return;

    const record: Address = {
      ...addressForm,
      id: editingAddress?.id ?? `addr_${Date.now().toString(36)}`,
      label: addressForm.label || "Home",
    };
    const updated = editingAddress
      ? addresses.map((address) => (address.id === editingAddress.id ? record : address))
      : [record, ...addresses];
    try {
      await persistAddresses(updated);
      setAddressOpen(false);
      toast.success(editingAddress ? "Address updated" : "Address saved");
    } catch (error) {
      console.error(error);
      toast.error("Could not save the address");
    }
  };

  const removeAddress = async (address: Address) => {
    try {
      await persistAddresses(addresses.filter((item) => item.id !== address.id));
      toast.success("Address removed");
    } catch {
      toast.error("Could not remove the address");
    }
  };

  const makeDefault = async (address: Address) => {
    try {
      await persistAddresses([address, ...addresses.filter((item) => item.id !== address.id)]);
      toast.success("Default address updated");
    } catch {
      toast.error("Could not update the default address");
    }
  };

  const initial = (profile?.displayName || user?.email || "P").charAt(0).toUpperCase();

  return (
    <div className="pb-12">
      <PageHead title="My account" description="Your profile, saved addresses and recent orders — all in one place." breadcrumbs={[{ label: "My account" }]}>
        <div className="flex flex-wrap gap-2">
          <Link to="/orders" className="btn-outline px-3 py-2 text-[10.5px]"><Package size={13} /> All orders</Link>
          {isAdmin ? <Link to="/admin" className="btn-primary px-3 py-2 text-[10.5px]"><Laptop size={13} /> Admin panel</Link> : null}
        </div>
      </PageHead>

      <div className="shell mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative h-24 bg-gradient-to-r from-apollo-800 via-apollo-700 to-apollo-500">
              <div className="absolute inset-0 dot-grid opacity-20" />
              <div className="absolute -bottom-8 left-5 flex items-end gap-3">
                {profile?.photoURL || user?.photoURL ? (
                  <img src={user?.photoURL ?? ""} alt="" className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-card" />
                ) : (
                  <span className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-white bg-apollo-100 text-2xl font-extrabold text-apollo-800 shadow-card">
                    {initial}
                  </span>
                )}
              </div>
              <button type="button" onClick={() => logout()} className="absolute right-4 top-4 flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-[9.5px] font-semibold text-white backdrop-blur transition hover:bg-white/25">
                <LogOut size={12} /> Sign out
              </button>
            </div>
            <div className="px-5 pb-5 pt-11">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-apollo-950">{profile?.displayName || user?.displayName || "City Pharmacy customer"}</h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-muted"><Mail size={11} /> {user?.email}</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-apollo-50 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wide text-apollo-700">
                  <ShieldCheck size={10} /> Verified account
                </span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-apollo-950">Contact details</h3>
                <p className="mt-0.5 text-[9.5px] text-muted">Used for order updates and delivery calls.</p>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-apollo-50 text-apollo-700"><UserRound size={15} /></span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="label">Full name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="label">Phone number</span>
                <input value={phone} onChange={(event) => setPhone(event.target.value.replace(/[^\d+ ]/g, ""))} className="field" placeholder="10-digit mobile" inputMode="tel" />
              </label>
              <label className="block sm:col-span-2">
                <span className="label">Email (from your sign-in)</span>
                <input value={user?.email ?? ""} readOnly className="field bg-cream text-muted" />
              </label>
            </div>
            <button type="button" onClick={saveContact} disabled={saving} className="btn-primary mt-3 px-4 py-2 text-[10.5px]">
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save changes
            </button>
          </div>

          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-apollo-950">Saved addresses</h3>
                <p className="mt-0.5 text-[9.5px] text-muted">The first address is used as your default at checkout.</p>
              </div>
              <button type="button" onClick={openAdd} className="btn-outline px-3 py-1.5 text-[10px]"><Plus size={12} /> Add address</button>
            </div>

            <div className="mt-3 space-y-2">
              {addresses.length ? (
                addresses.map((address, index) => (
                  <div key={address.id ?? index} className={cn("relative rounded-xl border p-3", index === 0 ? "border-apollo-300 bg-apollo-50/30" : "border-line")}>
                    <div className="flex items-start gap-2.5">
                      <span className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg", index === 0 ? "bg-apollo-700 text-white" : "bg-cream text-muted")}>
                        <Home size={13} />
                      </span>
                      <div className="min-w-0 flex-1 text-[10.5px] leading-relaxed text-muted">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="font-bold text-ink">{address.name}</p>
                          <span className="rounded bg-white px-1.5 py-0.5 text-[8px] font-bold uppercase text-apollo-700 ring-1 ring-apollo-100">{address.label ?? "Home"}</span>
                          {index === 0 ? <span className="text-[8px] font-bold uppercase text-apollo-600">Default</span> : null}
                        </div>
                        <p className="mt-0.5">
                          {address.line1}
                          {address.line2 ? `, ${address.line2}` : ""}
                          {address.landmark ? `, ${address.landmark}` : ""}
                        </p>
                        <p>{address.city}, {address.state} – {address.pincode}</p>
                        <p className="mt-0.5 flex items-center gap-1"><Phone size={10} /> {address.phone}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {index !== 0 ? (
                          <button type="button" onClick={() => makeDefault(address)} className="rounded-md px-1.5 py-1 text-[8.5px] font-semibold text-apollo-700 hover:bg-apollo-50">
                            Make default
                          </button>
                        ) : null}
                        <button type="button" onClick={() => openEdit(address)} className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-cream hover:text-apollo-700" aria-label="Edit address"><Pencil size={12} /></button>
                        <button type="button" onClick={() => removeAddress(address)} className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-coral-50 hover:text-coral-600" aria-label="Remove address"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-line p-5 text-center">
                  <MapPin size={20} className="mx-auto text-apollo-400" />
                  <p className="mt-2 text-[10.5px] font-semibold text-ink">No saved addresses yet</p>
                  <p className="mt-0.5 text-[9.5px] text-muted">Add one to speed up your next checkout.</p>
                  <button type="button" onClick={openAdd} className="btn-primary mt-3 px-3 py-1.5 text-[9.5px]">Add your first address</button>
                </div>
              )}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-apollo-950">Recent orders</h3>
              <Link to="/orders" className="flex items-center gap-1 text-[9.5px] font-semibold text-apollo-700 hover:underline">View all <ArrowRight size={11} /></Link>
            </div>
            {ordersLoading ? (
              <div className="mt-3 space-y-2">{[0, 1].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-cream" />)}</div>
            ) : orders.length ? (
              <div className="mt-2 divide-y divide-line">
                {orders.map((order) => (
                  <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between gap-2 py-2.5 transition hover:opacity-80">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-ink">{order.orderNumber} <StatusBadge status={order.status} /></p>
                      <p className="mt-0.5 text-[9px] text-muted">{formatDate(order.createdAt)} · {order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-apollo-800">{inr(order.total)}</p>
                      <p className="text-[8.5px] text-muted">{order.offerDiscount > 0 ? `Saved ${inr(order.offerDiscount)}` : "View order"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-3 rounded-xl bg-cream p-4 text-center">
                <Package size={20} className="mx-auto text-apollo-400" />
                <p className="mt-1.5 text-[10.5px] font-semibold text-ink">No orders yet</p>
                <Link to="/shop" className="mt-2 inline-flex items-center gap-1 text-[9.5px] font-bold text-apollo-700">Start shopping <ArrowRight size={11} /></Link>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-coral-600 to-orange-500 p-5 text-white">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full border-[14px] border-white/10" />
            <Sparkles size={20} className="text-amber-200" />
            <h3 className="mt-2 text-base font-extrabold leading-tight">Your Diwali 15% offer is live</h3>
            <p className="mt-1 text-[10px] leading-relaxed text-white/75">Selected items are already discounted. Look for the Diwali badge.</p>
            <Link to="/offers/diwali-15" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-[9.5px] font-bold text-coral-700">Shop the offer <ArrowRight size={11} /></Link>
          </div>

          <div className="card p-4">
            <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-ink"><Clock3 size={13} className="text-apollo-600" /> Help & support</p>
            <p className="mt-1 text-[9.5px] leading-relaxed text-muted">Questions about an order or a medicine? We're open {settings.hours}.</p>
            <a href={`tel:+91${settings.phone}`} className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-apollo-700"><Phone size={12} /> +91 {settings.phone.slice(0, 5)} {settings.phone.slice(5)}</a>
            <Link to="/enquiry" className="mt-1.5 flex items-center gap-1 text-[9.5px] font-semibold text-apollo-700 hover:underline">Send a patient enquiry</Link>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-ink"><ShieldCheck size={13} className="text-apollo-600" /> Account security</p>
            <p className="mt-1 text-[9px] leading-relaxed text-muted">
              You're signed in securely with {user?.providerData?.[0]?.providerId === "google.com" ? "Google" : "email and password"}. We never see your password.
            </p>
            <button type="button" onClick={() => logout()} className="mt-2.5 flex items-center gap-1.5 text-[9.5px] font-semibold text-coral-600 hover:underline"><LogOut size={11} /> Sign out</button>
          </div>
        </aside>
      </div>

      <Modal
        open={addressOpen}
        onClose={() => setAddressOpen(false)}
        title={editingAddress ? "Edit address" : "Add a new address"}
        description="This address will be available at checkout."
        size="md"
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={() => setAddressOpen(false)} className="btn-outline flex-1 py-2 text-[11px]">Cancel</button>
            <button type="button" onClick={saveAddress} className="btn-primary flex-1 py-2 text-[11px]">Save address</button>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="label">Label</span>
            <select value={addressForm.label ?? "Home"} onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })} className="field">
              {["Home", "Work", "Parents", "Other"].map((label) => <option key={label}>{label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="label">Recipient name *</span>
            <input value={addressForm.name} onChange={(event) => setAddressForm({ ...addressForm, name: event.target.value })} className="field" />
            {addressErrors.name ? <p className="mt-1 text-[9px] text-coral-600">{addressErrors.name}</p> : null}
          </label>
          <label className="block">
            <span className="label">Phone *</span>
            <input value={addressForm.phone} onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value.replace(/[^\d+ ]/g, "") })} className="field" inputMode="tel" />
            {addressErrors.phone ? <p className="mt-1 text-[9px] text-coral-600">{addressErrors.phone}</p> : null}
          </label>
          <label className="block">
            <span className="label">Pincode *</span>
            <input value={addressForm.pincode} onChange={(event) => setAddressForm({ ...addressForm, pincode: event.target.value.replace(/\D/g, "").slice(0, 6) })} className="field" inputMode="numeric" />
            {addressErrors.pincode ? <p className="mt-1 text-[9px] text-coral-600">{addressErrors.pincode}</p> : null}
          </label>
          <label className="block sm:col-span-2">
            <span className="label">House / flat, building, street *</span>
            <input value={addressForm.line1} onChange={(event) => setAddressForm({ ...addressForm, line1: event.target.value })} className="field" />
            {addressErrors.line1 ? <p className="mt-1 text-[9px] text-coral-600">{addressErrors.line1}</p> : null}
          </label>
          <label className="block">
            <span className="label">Area / locality</span>
            <input value={addressForm.line2 ?? ""} onChange={(event) => setAddressForm({ ...addressForm, line2: event.target.value })} className="field" />
          </label>
          <label className="block">
            <span className="label">Landmark</span>
            <input value={addressForm.landmark ?? ""} onChange={(event) => setAddressForm({ ...addressForm, landmark: event.target.value })} className="field" />
          </label>
          <label className="block">
            <span className="label">City *</span>
            <input value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} className="field" />
            {addressErrors.city ? <p className="mt-1 text-[9px] text-coral-600">{addressErrors.city}</p> : null}
          </label>
          <label className="block">
            <span className="label">State</span>
            <input value={addressForm.state} onChange={(event) => setAddressForm({ ...addressForm, state: event.target.value })} className="field" />
          </label>
        </div>
      </Modal>
    </div>
  );
}
