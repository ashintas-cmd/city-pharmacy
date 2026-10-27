import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  Package,
  PackageOpen,
  Phone,
  RefreshCw,
  ShoppingBag,
  Stethoscope,
  Store,
  Truck,
  XCircle,
} from "lucide-react";
import { PageHead } from "@/components/PageHead";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/OrderStatus";
import { Modal } from "@/components/Modal";
import { PackArt } from "@/components/PackArt";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { cancelOrder, fetchMyOrders } from "@/lib/firestore";
import { formatDate, inr } from "@/lib/utils";
import { usePageMeta } from "@/hooks/usePageMeta";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

const tabs = [
  { id: "all", label: "All orders" },
  { id: "active", label: "Active" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
] as const;

export function OrdersPage() {
  const { user } = useAuth();
  const { settings } = useCatalog();
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);

  usePageMeta("My orders | City Pharmacy", "Track your City Pharmacy orders, see delivery status and reorder your regular medicines.");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      setOrders(await fetchMyOrders(user.uid));
    } catch (err) {
      console.error(err);
      setError("We couldn't load your orders. Please check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (tab === "all") return orders;
    if (tab === "active") return orders.filter((order) => ["PLACED", "PACKED", "OUT_FOR_DELIVERY"].includes(order.status));
    if (tab === "delivered") return orders.filter((order) => order.status === "DELIVERED");
    return orders.filter((order) => order.status === "CANCELLED");
  }, [orders, tab]);

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancelOrder(cancelTarget.id);
      toast.success("Order cancelled", `${cancelTarget.orderNumber} has been cancelled.`);
      setCancelTarget(null);
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Could not cancel the order", "Please call the store and we'll help you.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="pb-12">
      <PageHead
        title="My orders"
        description="Every City Pharmacy order, in one place. Track delivery, reorder essentials and download details."
        breadcrumbs={[{ label: "My orders" }]}
      >
        <div className="flex items-center gap-2">
          <Link to="/shop" className="btn-outline px-3 py-2 text-[10.5px]">
            <ShoppingBag size={13} /> Shop again
          </Link>
          <button type="button" onClick={() => void load()} className="btn-ghost px-2.5 py-2 text-[10.5px]">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </PageHead>

      <div className="shell mt-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-white p-1 ring-1 ring-line">
            {tabs.map((item) => {
              const count = item.id === "all" ? orders.length : item.id === "active" ? orders.filter((o) => ["PLACED", "PACKED", "OUT_FOR_DELIVERY"].includes(o.status)).length : item.id === "delivered" ? orders.filter((o) => o.status === "DELIVERED").length : orders.filter((o) => o.status === "CANCELLED").length;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-1.5 text-[10.5px] font-semibold transition",
                    tab === item.id ? "bg-apollo-700 text-white" : "text-muted hover:bg-cream hover:text-ink",
                  )}
                >
                  {item.label} <span className={cn("ml-0.5 text-[9px]", tab === item.id ? "text-white/60" : "text-muted/70")}>{count}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-muted">Need help with an order? <a href={`tel:+91${settings.phone}`} className="font-semibold text-apollo-700 hover:underline">Call the store</a></p>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => <div key={item} className="h-40 animate-pulse rounded-2xl bg-white" />)}
            </div>
          ) : error ? (
            <EmptyState
              icon={XCircle}
              title="Couldn't load your orders"
              description={error}
              action="Try again"
              actionTo="/orders"
            />
          ) : !orders.length ? (
            <EmptyState
              icon={PackageOpen}
              title="No orders yet"
              description="When you place your first order, it will appear here with live delivery updates."
              action="Start shopping"
              actionTo="/shop"
            />
          ) : !filtered.length ? (
            <EmptyState
              icon={Package}
              title={`No ${tab} orders`}
              description="Try another tab to see your order history."
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((order) => (
                <article key={order.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-cream/60 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <StatusBadge status={order.status} />
                      <span className="text-[11px] font-bold text-ink">{order.orderNumber}</span>
                      <span className="text-[9.5px] text-muted">Placed {formatDate(order.createdAt, true)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] text-muted">{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
                      <span className="text-sm font-extrabold text-apollo-900">{inr(order.total)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.productId} className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                          <PackArt product={item} />
                        </div>
                      ))}
                      <div className="min-w-0 flex-1 pl-1">
                        <p className="truncate text-[11px] font-semibold text-ink">
                          {order.items[0]?.name}
                          {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ""}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[9px] text-muted">
                          <Truck size={10} /> {order.status === "DELIVERED" ? "Delivered" : order.deliverySlot ?? "Express delivery"}
                        </p>
                        {order.offerDiscount > 0 ? (
                          <p className="mt-0.5 text-[9px] font-semibold text-coral-600">Saved {inr(order.offerDiscount)} with Diwali {order.offerPercent ?? 15}%</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:shrink-0">
                      {order.status === "PLACED" ? (
                        <button type="button" onClick={() => setCancelTarget(order)} className="btn-ghost px-2.5 py-2 text-[10px] text-coral-600 hover:bg-coral-50">
                          Cancel
                        </button>
                      ) : null}
                      <Link to={`/orders/${order.id}`} className="btn-outline px-3 py-2 text-[10.5px]">
                        View details <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Truck, title: "90-minute delivery", text: "Express delivery across Adarsh Nagar and nearby areas." },
            { icon: Store, title: "Free store pickup", text: "Collect from our main market store in 20 minutes." },
            { icon: Stethoscope, title: "Pharmacist support", text: "Call or WhatsApp us for any order-related question." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-2.5 rounded-xl border border-line bg-white p-3.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-apollo-50 text-apollo-700"><item.icon size={15} /></span>
              <div>
                <p className="text-[10.5px] font-bold text-ink">{item.title}</p>
                <p className="mt-0.5 text-[9px] leading-relaxed text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title="Cancel this order?"
        description="You can cancel an order before our pharmacist starts packing it."
        size="sm"
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={() => setCancelTarget(null)} className="btn-outline flex-1 py-2 text-[11px]">Keep order</button>
            <button type="button" onClick={confirmCancel} disabled={cancelling} className="btn-coral flex-1 py-2 text-[11px]">
              {cancelling ? "Cancelling…" : "Yes, cancel"}
            </button>
          </div>
        }
      >
        {cancelTarget ? (
          <div className="rounded-xl bg-cream p-3">
            <p className="text-[11px] font-bold text-ink">{cancelTarget.orderNumber}</p>
            <p className="mt-1 text-[10px] text-muted">{cancelTarget.items.map((item) => `${item.name} × ${item.qty}`).join(", ")}</p>
            <p className="mt-2 text-sm font-bold text-apollo-900">{inr(cancelTarget.total)}</p>
            <p className="mt-2 flex items-center gap-1 text-[9.5px] text-muted"><Clock3 size={11} /> Orders with prescription items can only be cancelled before verification.</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
