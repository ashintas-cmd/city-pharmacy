import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  Home,
  Mail,
  MapPin,
  Package,
  Phone,
  Printer,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Store,
  Truck,
  XCircle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/PageHead";
import { EmptyState } from "@/components/EmptyState";
import { PageLoader } from "@/components/Skeletons";
import { StatusBadge, StatusTimeline } from "@/components/OrderStatus";
import { PackArt } from "@/components/PackArt";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { cancelOrder, fetchOrder } from "@/lib/firestore";
import { formatDate, inr } from "@/lib/utils";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { Order } from "@/types";

export function OrderDetailPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { products, settings } = useCatalog();
  const { addItem } = useCart();
  const toast = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const justPlaced = params.get("placed") === "1";

  usePageMeta(
    order ? `Order ${order.orderNumber} | City Pharmacy` : "Order details | City Pharmacy",
    "Track your City Pharmacy order and see delivery updates.",
  );

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const result = await fetchOrder(id);
        if (alive) setOrder(result);
      } catch (error) {
        console.error(error);
        if (alive) setOrder(null);
      } finally {
        if (alive) setLoading(false);
      }
    };
    void load();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <PageLoader />;

  if (!order) {
    return (
      <div className="shell py-14">
        <EmptyState
          icon={Package}
          title="Order not found"
          description="We couldn't find this order, or you don't have access to it. Sign in with the account used to place the order."
          action="My orders"
          actionTo="/orders"
        />
      </div>
    );
  }

  if (user && order.userId !== user.uid && !isAdmin) {
    return (
      <div className="shell py-14">
        <EmptyState
          icon={ShieldCheck}
          title="This order belongs to another account"
          description="Sign in with the Google account or email used at checkout to view this order."
          action="My orders"
          actionTo="/orders"
        />
      </div>
    );
  }

  const reorder = () => {
    let added = 0;
    for (const item of order.items) {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (product?.active && product.stock > 0) {
        addItem(product.id, item.qty);
        added += 1;
      }
    }
    if (added) {
      toast.success("Added to cart", `${added} ${added === 1 ? "item" : "items"} from order ${order.orderNumber}.`);
      navigate("/cart");
    } else {
      toast.error("Items unavailable", "The products in this order are currently out of stock.");
    }
  };

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await cancelOrder(order.id);
      setOrder({ ...order, status: "CANCELLED", cancelledAt: new Date().toISOString() });
      setCancelOpen(false);
      toast.success("Order cancelled", "We've cancelled this order. Any prepaid amount is refunded in 3–5 days.");
    } catch (error) {
      console.error(error);
      toast.error("Could not cancel", "Please call the store and we'll cancel it for you.");
    } finally {
      setCancelling(false);
    }
  };

  const productSavings = Math.max(0, order.mrpTotal - order.subtotal - order.offerDiscount);

  return (
    <div className="pb-12">
      {justPlaced ? (
        <div className="border-b border-apollo-100 bg-gradient-to-r from-apollo-50 to-emerald-50">
          <div className="shell flex items-start gap-3 py-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-apollo-700 text-white">
              <CheckCircle2 size={20} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-apollo-950">Thank you! Your order is confirmed.</h2>
              <p className="mt-0.5 text-[10.5px] leading-relaxed text-apollo-800/70">
                A confirmation has been saved to your account. Our pharmacist will call you if any prescription item
                needs verification.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="border-b border-line bg-white">
        <div className="shell py-5">
          <Breadcrumbs items={[{ label: "My orders", to: "/orders" }, { label: order.orderNumber }]} />
          <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold text-apollo-950 sm:text-2xl">{order.orderNumber}</h1>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-1 text-[10.5px] text-muted">
                Placed on {formatDate(order.createdAt, true)} · {order.items.length} {order.items.length === 1 ? "item" : "items"} ·{" "}
                {order.paymentMethod === "COD" ? "Cash on delivery" : "UPI at doorstep"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={reorder} className="btn-outline px-3 py-2 text-[10.5px]">
                <RefreshCw size={13} /> Reorder
              </button>
              <button type="button" onClick={() => window.print()} className="btn-ghost px-3 py-2 text-[10.5px]">
                <Printer size={13} /> Print
              </button>
              {order.status === "PLACED" ? (
                <button type="button" onClick={() => setCancelOpen(true)} className="btn-ghost px-3 py-2 text-[10.5px] text-coral-600 hover:bg-coral-50">
                  <XCircle size={13} /> Cancel order
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="shell mt-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-apollo-950">Delivery status</h2>
                <span className="flex items-center gap-1 text-[9.5px] text-muted"><Clock3 size={11} /> Live updates</span>
              </div>
              <div className="mt-4">
                <StatusTimeline status={order.status} timeline={order.timeline} />
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-cream p-3 text-[10px] leading-relaxed text-muted">
                <Truck size={14} className="mt-0.5 shrink-0 text-apollo-700" />
                <span>
                  {order.status === "DELIVERED"
                    ? "Delivered. We hope you feel better soon. For any issue with the products, call us within 7 days."
                    : order.status === "CANCELLED"
                      ? "This order has been cancelled and will not be delivered."
                      : `${order.deliverySlot ?? "Express delivery"} · Our delivery partner will call you before arriving at ${order.address.line1}.`}
                </span>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-apollo-950">Items in this order</h2>
                <Link to="/shop" className="text-[9.5px] font-semibold text-apollo-700 hover:underline">Shop more</Link>
              </div>
              <div className="mt-3 divide-y divide-line">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <Link to={`/product/${item.slug}`} className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                      <PackArt product={item} />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="text-[8.5px] font-bold uppercase tracking-wider text-apollo-600">{item.brand}</p>
                      <Link to={`/product/${item.slug}`} className="mt-0.5 line-clamp-2 text-[11.5px] font-semibold leading-tight text-ink hover:text-apollo-700">
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-[9px] text-muted">{item.packSize} · Qty {item.qty}</p>
                      {item.offerApplied ? (
                        <span className="mt-1 inline-flex items-center gap-1 rounded bg-coral-50 px-1.5 py-0.5 text-[8px] font-bold uppercase text-coral-700">
                          <Sparkles size={8} /> Diwali 15% off
                        </span>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-ink">{inr(item.lineTotal)}</p>
                      {item.mrp > item.unitPrice ? <p className="text-[9px] text-muted line-through">{inr(item.mrp * item.qty)}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h2 className="text-sm font-bold text-apollo-950">Payment & savings</h2>
              <div className="mt-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-muted"><span>MRP total</span><span className="text-ink">{inr(order.mrpTotal)}</span></div>
                {productSavings > 0 ? <div className="flex justify-between text-muted"><span>Product savings</span><span className="font-semibold text-apollo-700">− {inr(productSavings)}</span></div> : null}
                {order.offerDiscount > 0 ? (
                  <div className="flex justify-between font-medium text-coral-600">
                    <span className="flex items-center gap-1"><Sparkles size={11} /> {order.offerTitle ?? "Diwali offer"} ({order.offerPercent ?? 15}%)</span>
                    <span>− {inr(order.offerDiscount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-muted"><span>Subtotal</span><span className="text-ink">{inr(order.subtotal)}</span></div>
                <div className="flex justify-between text-muted"><span>Delivery fee</span><span className={order.deliveryFee === 0 ? "font-semibold text-apollo-700" : "text-ink"}>{order.deliveryFee === 0 ? "FREE" : inr(order.deliveryFee)}</span></div>
                <div className="flex items-end justify-between border-t border-line pt-2">
                  <span className="text-sm font-bold text-ink">Total</span>
                  <span className="text-lg font-extrabold text-apollo-900">{inr(order.total)}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-apollo-50 px-3 py-2 text-[9.5px] text-apollo-800">
                <CreditCard size={12} />
                {order.paymentMethod === "COD" ? "Pay cash when your order arrives." : "Scan the delivery partner's UPI QR when your order arrives."}
              </div>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="card p-5">
              <h2 className="text-sm font-bold text-apollo-950">Delivery address</h2>
              <div className="mt-3 flex gap-2.5 text-[10.5px] leading-relaxed text-muted">
                <MapPin size={14} className="mt-0.5 shrink-0 text-apollo-600" />
                <div>
                  <p className="font-semibold text-ink">{order.address.name}</p>
                  <p className="mt-0.5">
                    {order.address.line1}
                    {order.address.line2 ? `, ${order.address.line2}` : ""}
                    {order.address.landmark ? `, ${order.address.landmark}` : ""}
                  </p>
                  <p>{order.address.city}, {order.address.state} – {order.address.pincode}</p>
                  <p className="mt-1.5 flex items-center gap-1"><Phone size={11} /> {order.address.phone}</p>
                  {order.customer.email ? <p className="mt-0.5 flex items-center gap-1"><Mail size={11} /> {order.customer.email}</p> : null}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-cream px-2.5 py-2 text-[9px] text-muted">
                <Truck size={12} className="text-apollo-600" /> {order.deliverySlot ?? `${settings.deliveryEta} express delivery`}
              </div>
              {order.notes ? (
                <div className="mt-2 rounded-lg border border-line px-2.5 py-2">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-muted">Order notes</p>
                  <p className="mt-0.5 text-[9.5px] leading-relaxed text-ink/70">{order.notes}</p>
                </div>
              ) : null}
            </div>

            <div className="card p-5">
              <h2 className="text-sm font-bold text-apollo-950">Need help?</h2>
              <p className="mt-1 text-[10px] leading-relaxed text-muted">
                Quote order <strong className="text-ink">{order.orderNumber}</strong> when you call. Store open {settings.hours}.
              </p>
              <a href={`tel:+91${settings.phone}`} className="btn-primary mt-3 w-full py-2 text-[10.5px]">
                <Phone size={13} /> Call the store
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi City Pharmacy, I need help with order ${order.orderNumber}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline mt-2 w-full py-2 text-[10.5px]"
              >
                <Stethoscope size={13} /> WhatsApp support
              </a>
              {isAdmin ? (
                <Link to="/admin/orders" className="mt-2 block text-center text-[9.5px] font-semibold text-apollo-700 hover:underline">
                  Open admin panel
                </Link>
              ) : null}
            </div>

            <div className="rounded-xl border border-line bg-white p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-ink"><Store size={13} className="text-apollo-600" /> Store pickup available</p>
              <p className="mt-1 text-[9.5px] leading-relaxed text-muted">
                {settings.addressLine1}, {settings.addressLine2}, {settings.city} – {settings.pincode}
              </p>
              <Link to="/contact" className="mt-2 inline-flex items-center gap-1 text-[9.5px] font-bold text-apollo-700 hover:underline">
                Get directions
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <Link to="/orders" className="flex items-center gap-1.5 text-[10.5px] font-semibold text-apollo-700 hover:text-apollo-900">
            <ArrowLeft size={13} /> Back to all orders
          </Link>
        </div>
      </div>

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this order?"
        description="Cancellation is instant and cannot be undone. You'll need to place a new order."
        size="sm"
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={() => setCancelOpen(false)} className="btn-outline flex-1 py-2 text-[11px]">Keep order</button>
            <button type="button" onClick={confirmCancel} disabled={cancelling} className="btn-coral flex-1 py-2 text-[11px]">
              {cancelling ? "Cancelling…" : "Yes, cancel order"}
            </button>
          </div>
        }
      >
        <div className="rounded-xl bg-cream p-3 text-[10.5px] text-muted">
          <p className="font-bold text-ink">{order.orderNumber} · {inr(order.total)}</p>
          <p className="mt-1">{order.items.map((item) => `${item.name} × ${item.qty}`).join(", ")}</p>
        </div>
      </Modal>
    </div>
  );
}
