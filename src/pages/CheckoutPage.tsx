import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Banknote,
  Check,
  ChevronRight,
  Clock3,
  Home,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Stethoscope,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import { AuthPanel } from "@/components/AuthPanel";
import { Breadcrumbs } from "@/components/PageHead";
import { EmptyState } from "@/components/EmptyState";
import { PageLoader } from "@/components/Skeletons";
import { PackArt } from "@/components/PackArt";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { createOrder, saveProfile } from "@/lib/firestore";
import { getUnitPricing } from "@/lib/pricing";
import { generateOrderNumber, inr, validPhone } from "@/lib/utils";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { Address, Order, OrderItem } from "@/types";

type FormState = {
  name: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  slot: string;
  payment: "COD" | "UPI_ON_DELIVERY";
  notes: string;
  saveAddress: boolean;
};

const slots = [
  { id: "express", label: "Express delivery", detail: "Within 90 minutes", badge: "Fastest" },
  { id: "evening", label: "Today evening", detail: "6:00 PM – 9:00 PM", badge: "" },
  { id: "tomorrow", label: "Tomorrow morning", detail: "9:00 AM – 12:00 PM", badge: "" },
];

const slotLabels: Record<string, string> = {
  express: "Express delivery (90 minutes)",
  evening: "Today evening (6–9 PM)",
  tomorrow: "Tomorrow morning (9 AM–12 PM)",
};

export function CheckoutPage() {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const { lines, pricing, count, clearCart } = useCart();
  const { settings, liveOffer, offer } = useCatalog();
  const toast = useToast();
  const navigate = useNavigate();

  usePageMeta("Checkout | City Pharmacy", "Secure checkout at City Pharmacy. Pay cash or UPI at your doorstep. Diwali 15% savings applied automatically.");

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    line1: "",
    line2: "",
    landmark: "",
    city: settings.city,
    state: settings.state,
    pincode: settings.pincode,
    slot: "express",
    payment: "COD",
    notes: "",
    saveAddress: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current || !user || !profile) return;
    const address = profile.addresses?.[0];
    setForm((current) => ({
      ...current,
      name: current.name || profile.displayName || user.displayName || "",
      phone: current.phone || profile.phone || address?.phone || "",
      email: current.email || profile.email || user.email || "",
      line1: current.line1 || address?.line1 || "",
      line2: current.line2 || address?.line2 || "",
      landmark: current.landmark || address?.landmark || "",
      city: address?.city || settings.city,
      state: address?.state || settings.state,
      pincode: address?.pincode || settings.pincode,
    }));
    hydrated.current = true;
  }, [user, profile, settings]);

  const update = (key: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Enter the patient's full name.";
    if (!validPhone(form.phone)) next.phone = "Enter a valid 10-digit Indian mobile number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.line1.trim()) next.line1 = "Enter your house / flat and street.";
    if (!form.city.trim()) next.city = "Enter your city.";
    if (!/^\d{6}$/.test(form.pincode)) next.pincode = "Enter a valid 6-digit pincode.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async () => {
    if (!user) return;
    if (!validate()) {
      toast.error("Check your delivery details", "A few fields need attention before we can place the order.");
      return;
    }
    if (!lines.length) return;

    setSubmitting(true);
    try {
      const orderId = generateOrderNumber();
      const address: Address = {
        id: "default",
        label: "Home",
        name: form.name.trim(),
        phone: form.phone.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim(),
        landmark: form.landmark.trim(),
        city: form.city.trim(),
        state: form.state.trim() || "Delhi",
        pincode: form.pincode.trim(),
      };

      const orderItems: OrderItem[] = lines.map(({ product, qty }) => {
        const unit = getUnitPricing(product, offer);
        return {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          packSize: product.packSize,
          art: product.art,
          mrp: product.mrp,
          unitPrice: unit.unitPrice,
          qty,
          offerApplied: unit.offerApplied,
          lineTotal: unit.unitPrice * qty,
        };
      });

      const order: Omit<Order, "createdAt" | "updatedAt"> = {
        id: orderId,
        orderNumber: orderId,
        userId: user.uid,
        items: orderItems,
        customer: { name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() },
        address,
        paymentMethod: form.payment,
        deliverySlot: slotLabels[form.slot],
        notes: form.notes.trim(),
        mrpTotal: pricing.mrpTotal,
        subtotal: pricing.subtotal,
        offerDiscount: pricing.offerDiscount,
        deliveryFee: pricing.deliveryFee,
        total: pricing.total,
        status: "PLACED",
        offerTitle: pricing.offerDiscount > 0 ? liveOffer?.title ?? "Diwali offer" : undefined,
        offerPercent: pricing.offerDiscount > 0 ? liveOffer?.percent ?? 15 : undefined,
        timeline: [],
      };

      await createOrder(order);

      if (form.saveAddress) {
        await saveProfile({
          uid: user.uid,
          displayName: form.name.trim(),
          phone: form.phone.trim(),
          addresses: [address, ...(profile?.addresses ?? []).filter((item) => item.id !== "default")],
        });
      } else {
        await saveProfile({ uid: user.uid, phone: form.phone.trim() });
      }

      clearCart();
      toast.success("Order placed successfully", `Your order ${orderId} is confirmed.`);
      navigate(`/orders/${orderId}?placed=1`, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Could not place the order", "Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <PageLoader />;

  if (!user) {
    return (
      <div className="pb-12">
        <div className="border-b border-line bg-white">
          <div className="shell py-5">
            <Breadcrumbs items={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
            <h1 className="mt-1.5 text-2xl font-extrabold text-apollo-950 sm:text-3xl">Secure checkout</h1>
            <p className="mt-1 text-xs text-muted">Sign in to place your order. It takes less than 30 seconds.</p>
          </div>
        </div>
        <div className="shell mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="card p-6">
            <AuthPanel
              title="Sign in to complete your order"
              subtitle="Use Google for one-tap checkout, or your email address."
              onSuccess={() => undefined}
              compact
            />
          </div>
          <div>
            <div className="card p-5">
              <h2 className="text-sm font-bold text-apollo-950">Your order</h2>
              <div className="mt-3 space-y-2">
                {lines.map(({ product, qty, unitPrice }) => (
                  <div key={product.id} className="flex items-center gap-2.5">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream">
                      <PackArt product={product} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-ink">{product.name}</p>
                      <p className="text-[9px] text-muted">Qty {qty}</p>
                    </div>
                    <p className="text-[11px] font-bold text-apollo-800">{inr(unitPrice * qty)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-1.5 border-t border-dashed border-line pt-3 text-[11px]">
                <div className="flex justify-between text-muted"><span>Subtotal</span><span className="text-ink">{inr(pricing.subtotal)}</span></div>
                {pricing.offerDiscount > 0 ? <div className="flex justify-between text-coral-600"><span>Diwali discount</span><span>− {inr(pricing.offerDiscount)}</span></div> : null}
                <div className="flex justify-between text-muted"><span>Delivery</span><span>{pricing.deliveryFee === 0 ? "FREE" : inr(pricing.deliveryFee)}</span></div>
                <div className="flex justify-between pt-1.5 text-sm font-bold text-ink"><span>Total</span><span>{inr(pricing.total)}</span></div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-apollo-50 p-3 text-[10px] text-apollo-800">
              <ShieldCheck size={14} /> Your account is secured by Firebase Authentication.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!count) {
    return (
      <div className="shell py-14">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add a few items before heading to checkout."
          action="Browse products"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="border-b border-line bg-white">
        <div className="shell py-5">
          <Breadcrumbs items={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
          <div className="mt-1.5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h1 className="text-2xl font-extrabold text-apollo-950 sm:text-3xl">Checkout</h1>
              <p className="mt-1 text-xs text-muted">
                Signed in as <strong className="font-semibold text-ink">{user.email}</strong> ·{" "}
                <button type="button" onClick={() => logout()} className="font-semibold text-apollo-700 hover:underline">Sign out</button>
              </p>
            </div>
            <div className="hidden items-center gap-2 text-[9px] font-semibold text-muted sm:flex">
              <span className="flex items-center gap-1 text-apollo-700"><Check size={11} /> Cart</span>
              <ChevronRight size={10} />
              <span className="flex items-center gap-1 text-apollo-700"><span className="grid h-4 w-4 place-items-center rounded-full bg-apollo-700 text-[8px] text-white">2</span> Address</span>
              <ChevronRight size={10} />
              <span className="flex items-center gap-1"><span className="grid h-4 w-4 place-items-center rounded-full bg-line text-[8px] text-muted">3</span> Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="shell mt-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            <section className="card p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-apollo-700 text-[10px] font-bold text-white">1</span>
                <h2 className="text-sm font-bold text-apollo-950">Contact details</h2>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="label">Patient / recipient name</span>
                  <div className="relative">
                    <UserRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input value={form.name} onChange={(event) => update("name", event.target.value)} className="field pl-9" placeholder="Full name" />
                  </div>
                  {errors.name ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.name}</p> : null}
                </label>
                <label className="block">
                  <span className="label">Mobile number</span>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input value={form.phone} onChange={(event) => update("phone", event.target.value.replace(/[^\d+ ]/g, ""))} className="field pl-9" placeholder="10-digit mobile" inputMode="tel" />
                  </div>
                  {errors.phone ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.phone}</p> : null}
                </label>
                <label className="block sm:col-span-2">
                  <span className="label">Email (for the order receipt)</span>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="field pl-9" placeholder="you@example.com" />
                  </div>
                  {errors.email ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.email}</p> : null}
                </label>
              </div>
            </section>

            <section className="card p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-apollo-700 text-[10px] font-bold text-white">2</span>
                <h2 className="text-sm font-bold text-apollo-950">Delivery address</h2>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="label">House / flat, building, street</span>
                  <div className="relative">
                    <Home size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input value={form.line1} onChange={(event) => update("line1", event.target.value)} className="field pl-9" placeholder="e.g. B-24, Second Floor, Main Market Road" />
                  </div>
                  {errors.line1 ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.line1}</p> : null}
                </label>
                <label className="block">
                  <span className="label">Area / locality</span>
                  <input value={form.line2} onChange={(event) => update("line2", event.target.value)} className="field" placeholder="Adarsh Nagar" />
                </label>
                <label className="block">
                  <span className="label">Landmark (optional)</span>
                  <input value={form.landmark} onChange={(event) => update("landmark", event.target.value)} className="field" placeholder="Near metro station" />
                </label>
                <label className="block">
                  <span className="label">City</span>
                  <input value={form.city} onChange={(event) => update("city", event.target.value)} className="field" />
                  {errors.city ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.city}</p> : null}
                </label>
                <label className="block">
                  <span className="label">State</span>
                  <input value={form.state} onChange={(event) => update("state", event.target.value)} className="field" />
                </label>
                <label className="block">
                  <span className="label">Pincode</span>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input value={form.pincode} onChange={(event) => update("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))} className="field pl-9" inputMode="numeric" />
                  </div>
                  {errors.pincode ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.pincode}</p> : null}
                </label>
              </div>
              <label className="mt-3 flex cursor-pointer items-center gap-2 text-[10.5px] text-muted">
                <input type="checkbox" checked={form.saveAddress} onChange={(event) => update("saveAddress", event.target.checked)} className="h-3.5 w-3.5 accent-apollo-700" />
                Save this address and phone number to my account
              </label>
            </section>

            <section className="card p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-apollo-700 text-[10px] font-bold text-white">3</span>
                <h2 className="text-sm font-bold text-apollo-950">Delivery slot</h2>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {slots.map((slot) => (
                  <label
                    key={slot.id}
                    className={`relative cursor-pointer rounded-xl border p-3 transition ${
                      form.slot === slot.id ? "border-apollo-500 bg-apollo-50/60 ring-2 ring-apollo-100" : "border-line hover:border-apollo-200"
                    }`}
                  >
                    <input type="radio" name="slot" value={slot.id} checked={form.slot === slot.id} onChange={() => update("slot", slot.id)} className="sr-only" />
                    <div className="flex items-center justify-between">
                      <Truck size={15} className={form.slot === slot.id ? "text-apollo-700" : "text-muted"} />
                      {slot.badge ? <span className="rounded bg-coral-50 px-1.5 py-0.5 text-[7.5px] font-bold uppercase text-coral-700">{slot.badge}</span> : null}
                    </div>
                    <p className="mt-2 text-[10.5px] font-bold text-ink">{slot.label}</p>
                    <p className="mt-0.5 text-[9px] text-muted">{slot.detail}</p>
                  </label>
                ))}
              </div>
              <p className="mt-2.5 flex items-center gap-1.5 text-[9.5px] text-muted">
                <Clock3 size={11} className="text-apollo-600" /> Our pharmacist may call to confirm prescription items before dispatch.
              </p>
            </section>

            <section className="card p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-apollo-700 text-[10px] font-bold text-white">4</span>
                <h2 className="text-sm font-bold text-apollo-950">Payment method</h2>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { id: "COD" as const, title: "Cash on delivery", detail: "Pay the delivery partner in cash.", icon: Banknote },
                  { id: "UPI_ON_DELIVERY" as const, title: "UPI at doorstep", detail: "Scan and pay when your order arrives.", icon: Smartphone },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition ${
                      form.payment === method.id ? "border-apollo-500 bg-apollo-50/60 ring-2 ring-apollo-100" : "border-line hover:border-apollo-200"
                    }`}
                  >
                    <input type="radio" name="payment" checked={form.payment === method.id} onChange={() => update("payment", method.id)} className="mt-0.5 h-3.5 w-3.5 accent-apollo-700" />
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-apollo-700 shadow-sm">
                      <method.icon size={14} />
                    </span>
                    <span>
                      <span className="block text-[10.5px] font-bold text-ink">{method.title}</span>
                      <span className="mt-0.5 block text-[9px] leading-relaxed text-muted">{method.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-2.5 flex items-center gap-1.5 text-[9px] text-muted">
                <LockKeyhole size={11} /> Online card payments are coming soon. You will never be asked for an OTP over the phone.
              </p>
            </section>

            <section className="card p-5">
              <label className="block">
                <span className="label">Order notes (optional)</span>
                <textarea
                  value={form.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  rows={2}
                  className="field resize-none"
                  placeholder="e.g. Please call before delivery, or substitute only with permission."
                />
              </label>
            </section>

            <button type="button" onClick={placeOrder} disabled={submitting} className="btn-primary w-full py-3.5 text-sm">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {submitting ? "Placing your order…" : `Place order · ${inr(pricing.total)}`}
            </button>
            <p className="text-center text-[9.5px] text-muted">
              By placing this order you agree to our{" "}
              <Link to="/terms" className="font-semibold text-apollo-700 hover:underline">Terms</Link>,{" "}
              <Link to="/shipping" className="font-semibold text-apollo-700 hover:underline">Shipping policy</Link> and{" "}
              <Link to="/returns" className="font-semibold text-apollo-700 hover:underline">Returns policy</Link>.
            </p>
          </div>

          <aside>
            <div className="sticky top-[152px] space-y-3">
              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-apollo-950">Order summary</h2>
                  <Link to="/cart" className="text-[9.5px] font-semibold text-apollo-700 hover:underline">Edit cart</Link>
                </div>
                <div className="mt-3 max-h-[240px] space-y-2.5 overflow-y-auto pr-1">
                  {lines.map(({ product, qty, unitPrice, offerApplied }) => (
                    <div key={product.id} className="flex items-center gap-2.5">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-cream">
                        <PackArt product={product} />
                        <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-apollo-700 px-0.5 text-[8px] font-bold text-white">{qty}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10.5px] font-semibold text-ink">{product.name}</p>
                        <p className="text-[8.5px] text-muted">{product.packSize} {offerApplied ? "· Diwali 15%" : ""}</p>
                      </div>
                      <p className="text-[10.5px] font-bold text-apollo-800">{inr(unitPrice * qty)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 space-y-1.5 border-t border-dashed border-line pt-3 text-[11px]">
                  <div className="flex justify-between text-muted"><span>MRP total</span><span className="text-ink">{inr(pricing.mrpTotal)}</span></div>
                  {pricing.productSavings > 0 ? <div className="flex justify-between text-muted"><span>Product savings</span><span className="font-semibold text-apollo-700">− {inr(pricing.productSavings)}</span></div> : null}
                  {pricing.offerDiscount > 0 ? (
                    <div className="flex justify-between font-medium text-coral-600">
                      <span className="flex items-center gap-1"><Sparkles size={11} /> Diwali {liveOffer?.percent}% off</span>
                      <span>− {inr(pricing.offerDiscount)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-muted"><span>Delivery fee</span><span className={pricing.deliveryFee === 0 ? "font-semibold text-apollo-700" : "text-ink"}>{pricing.deliveryFee === 0 ? "FREE" : inr(pricing.deliveryFee)}</span></div>
                  <div className="flex items-end justify-between border-t border-line pt-2">
                    <span className="text-sm font-bold text-ink">To pay</span>
                    <span className="text-xl font-extrabold text-apollo-900">{inr(pricing.total)}</span>
                  </div>
                  {pricing.savings > 0 ? <p className="text-right text-[9.5px] font-semibold text-apollo-700">Total savings {inr(pricing.savings)}</p> : null}
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-lg bg-apollo-50 px-2.5 py-2 text-[9.5px] text-apollo-800">
                  <Truck size={13} /> Delivery in {settings.deliveryEta} · {form.pincode || settings.pincode}
                </div>
              </div>

              <div className="rounded-xl border border-line bg-white p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold text-ink"><Stethoscope size={13} className="text-apollo-600" /> Need help with this order?</p>
                <p className="mt-1 text-[9.5px] leading-relaxed text-muted">Call the store and quote your registered mobile number.</p>
                <a href={`tel:+91${settings.phone}`} className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-apollo-700">
                  <Phone size={12} /> +91 {settings.phone.slice(0, 5)} {settings.phone.slice(5)}
                </a>
              </div>

              <div className="flex flex-wrap gap-2 text-[9px] text-muted">
                <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-apollo-600" /> Genuine products</span>
                <span className="flex items-center gap-1"><Store size={11} className="text-apollo-600" /> Adarsh Nagar store</span>
                <span className="flex items-center gap-1"><Clock3 size={11} className="text-apollo-600" /> Open 24×7</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
