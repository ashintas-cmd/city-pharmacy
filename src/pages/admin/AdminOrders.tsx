import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PageLoader, TableSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { SidePanel } from "@/components/Modal";
import { StatusBadge, StatusTimeline, statusMeta, statusFlow } from "@/components/OrderStatus";
import { useToast } from "@/context/ToastContext";
import { fetchAllOrders, updateOrderStatus } from "@/lib/firestore";
import { downloadCsv, formatDate, inr } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const statuses: (OrderStatus | "ALL")[] = ["ALL", "PLACED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const nextOf = (status: OrderStatus): OrderStatus => {
  const index = statusFlow.indexOf(status);
  if (status === "CANCELLED" || status === "DELIVERED") return status;
  return statusFlow[Math.min(statusFlow.length - 1, index + 1)];
};

export function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [nextStatus, setNextStatus] = useState<OrderStatus>("PLACED");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setOrders(await fetchAllOrders(500));
    } catch (error) {
      console.error(error);
      toast.error("Could not load orders", "Check your admin permissions and connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (status !== "ALL" && order.status !== status) return false;
      if (!q) return true;
      return [order.orderNumber, order.customer.name, order.customer.phone, order.customer.email, order.address.pincode]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [orders, status, search]);

  const open = (order: Order) => {
    setSelected(order);
    setNextStatus(nextOf(order.status));
    setNote("");
  };

  const selectedProductSavings = selected
    ? Math.max(0, selected.mrpTotal - selected.subtotal - selected.offerDiscount)
    : 0;

  const saveStatus = async () => {
    if (!selected) return;
    if (nextStatus === selected.status) {
      toast.info("No change", "Choose a different status to update this order.");
      return;
    }
    setSaving(true);
    try {
      await updateOrderStatus(selected.id, nextStatus, note.trim() || undefined);
      const updated: Order = {
        ...selected,
        status: nextStatus,
        timeline: [...(selected.timeline ?? []), { status: nextStatus, at: new Date().toISOString(), note: note.trim() }],
      };
      setSelected(updated);
      setOrders((current) => current.map((order) => (order.id === updated.id ? updated : order)));
      setNote("");
      toast.success("Order updated", `${selected.orderNumber} is now ${statusMeta[nextStatus].label.toLowerCase()}.`);
    } catch (error) {
      console.error(error);
      toast.error("Could not update the order", "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const exportOrders = () => {
    downloadCsv("city-pharmacy-orders.csv", [
      ["Order", "Date", "Customer", "Phone", "Items", "Subtotal", "Offer discount", "Delivery", "Total", "Payment", "Status"],
      ...filtered.map((order) => [
        order.orderNumber,
        formatDate(order.createdAt, true),
        order.customer.name,
        order.customer.phone,
        order.items.map((item) => `${item.name} x${item.qty}`).join("; "),
        order.subtotal,
        order.offerDiscount,
        order.deliveryFee,
        order.total,
        order.paymentMethod,
        order.status,
      ]),
    ]);
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Orders" description="Packing, delivery and order status" />
        <PageLoader />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Orders" description={`${orders.length} orders · ${orders.filter((order) => ["PLACED", "PACKED", "OUT_FOR_DELIVERY"].includes(order.status)).length} awaiting action`}>
        <button type="button" onClick={exportOrders} className="btn-outline px-3 py-2 text-[10.5px]"><Download size={13} /> Export CSV</button>
        <button type="button" onClick={() => void load()} className="btn-primary px-3 py-2 text-[10.5px]"><RefreshCw size={13} /> Refresh</button>
      </AdminPageHeader>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {statuses.map((item) => {
          const count = item === "ALL" ? orders.length : orders.filter((order) => order.status === item).length;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`rounded-xl border p-2.5 text-left transition ${
                status === item ? "border-apollo-500 bg-apollo-50 ring-1 ring-apollo-100" : "border-line bg-white hover:border-apollo-200"
              }`}
            >
              <p className="text-[8px] font-bold uppercase tracking-wider text-muted">{item === "ALL" ? "All" : statusMeta[item].short}</p>
              <p className="mt-1 text-lg font-extrabold text-apollo-900">{count}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-3">
          <div className="relative w-full max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order no., patient or phone"
              className="h-8 w-full rounded-lg border border-line bg-cream/50 pl-8 pr-2 text-[10.5px] outline-none focus:border-apollo-400"
            />
          </div>
          <p className="text-[9.5px] text-muted">Showing {filtered.length} of {orders.length}</p>
        </div>

        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-cream/70 text-[8.5px] font-bold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-2.5">Order</th>
                  <th className="px-4 py-2.5">Patient</th>
                  <th className="px-4 py-2.5">Items</th>
                  <th className="px-4 py-2.5">Payment</th>
                  <th className="px-4 py-2.5">Total</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-[10.5px]">
                {filtered.map((order) => (
                  <tr key={order.id} className="transition hover:bg-apollo-50/30">
                    <td className="px-4 py-2.5">
                      <p className="font-bold text-ink">{order.orderNumber}</p>
                      <p className="mt-0.5 text-[8.5px] text-muted">{formatDate(order.createdAt, true)}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-ink">{order.customer.name}</p>
                      <p className="mt-0.5 text-[8.5px] text-muted">{order.customer.phone}</p>
                    </td>
                    <td className="px-4 py-2.5 text-muted">
                      <p className="line-clamp-1 max-w-[180px]">{order.items.map((item) => item.name).join(", ")}</p>
                      <p className="mt-0.5 text-[8.5px]">{order.items.reduce((sum, item) => sum + item.qty, 0)} units</p>
                    </td>
                    <td className="px-4 py-2.5 text-[9px] font-medium text-muted">{order.paymentMethod === "COD" ? "Cash on delivery" : "UPI at door"}</td>
                    <td className="px-4 py-2.5">
                      <p className="font-bold text-apollo-800">{inr(order.total)}</p>
                      {order.offerDiscount > 0 ? <p className="text-[8px] font-semibold text-coral-600">Saved {inr(order.offerDiscount)}</p> : null}
                    </td>
                    <td className="px-4 py-2.5"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-2.5 text-right">
                      <button type="button" onClick={() => open(order)} className="inline-flex items-center gap-1 rounded-lg border border-line px-2 py-1.5 text-[9px] font-semibold text-apollo-700 transition hover:border-apollo-300 hover:bg-apollo-50">
                        <Eye size={11} /> Manage <ChevronRight size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={ShoppingBag} title="No orders match" description="Try a different status or search term." />
        )}
      </div>

      <SidePanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.orderNumber ?? "Order"}
        description={selected ? `${formatDate(selected.createdAt, true)} · ${selected.items.length} items` : undefined}
        footer={
          selected ? (
            <div className="flex items-center justify-between gap-2">
              <a href={`tel:+91${selected.customer.phone}`} className="btn-outline px-3 py-2 text-[10px]"><Phone size={12} /> Call</a>
              <button type="button" onClick={saveStatus} disabled={saving || nextStatus === selected.status} className="btn-primary px-4 py-2 text-[10.5px] disabled:opacity-50">
                <CheckCircle2 size={13} /> {saving ? "Saving…" : "Update status"}
              </button>
            </div>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <StatusBadge status={selected.status} />
              <span className="text-lg font-extrabold text-apollo-900">{inr(selected.total)}</span>
            </div>

            <div className="rounded-xl bg-cream p-3">
              <StatusTimeline status={selected.status} timeline={selected.timeline} />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Patient & delivery</p>
              <div className="mt-1.5 rounded-xl border border-line p-3 text-[10.5px] leading-relaxed text-muted">
                <p className="font-bold text-ink">{selected.customer.name}</p>
                <p className="mt-0.5 flex items-center gap-1"><Phone size={11} /> {selected.customer.phone}</p>
                {selected.customer.email ? <p className="mt-0.5">{selected.customer.email}</p> : null}
                <p className="mt-1.5 flex items-start gap-1.5">
                  <MapPin size={11} className="mt-0.5 shrink-0" />
                  <span>
                    {selected.address.line1}
                    {selected.address.line2 ? `, ${selected.address.line2}` : ""}
                    {selected.address.landmark ? `, ${selected.address.landmark}` : ""}
                    <br />
                    {selected.address.city}, {selected.address.state} – {selected.address.pincode}
                  </span>
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[9px]"><Truck size={11} /> {selected.deliverySlot ?? "Express delivery"}</p>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Items</p>
              <div className="mt-1.5 divide-y divide-line rounded-xl border border-line px-3">
                {selected.items.map((item) => (
                  <div key={item.productId} className="flex items-start justify-between gap-2 py-2">
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-semibold text-ink">{item.name}</p>
                      <p className="text-[8.5px] text-muted">{item.packSize} · Qty {item.qty} · {item.offerApplied ? "Diwali 15%" : inr(item.unitPrice)}</p>
                    </div>
                    <p className="shrink-0 text-[10px] font-bold text-ink">{inr(item.lineTotal)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 space-y-1 rounded-xl bg-cream p-3 text-[10px]">
                <div className="flex justify-between text-muted"><span>MRP total</span><span>{inr(selected.mrpTotal)}</span></div>
                {selectedProductSavings > 0 ? <div className="flex justify-between text-muted"><span>Product savings</span><span className="font-semibold text-apollo-700">− {inr(selectedProductSavings)}</span></div> : null}
                {selected.offerDiscount > 0 ? <div className="flex justify-between font-semibold text-coral-600"><span>Diwali discount</span><span>− {inr(selected.offerDiscount)}</span></div> : null}
                <div className="flex justify-between text-muted"><span>Subtotal</span><span>{inr(selected.subtotal)}</span></div>
                <div className="flex justify-between text-muted"><span>Delivery</span><span>{selected.deliveryFee === 0 ? "FREE" : inr(selected.deliveryFee)}</span></div>
                <div className="flex justify-between border-t border-line pt-1.5 text-[11px] font-bold text-ink"><span>Total</span><span>{inr(selected.total)}</span></div>
              </div>
            </div>

            {selected.notes ? (
              <div className="rounded-xl bg-amber-50 p-3 text-[10px] text-amber-900">
                <p className="font-bold">Customer note</p>
                <p className="mt-0.5">{selected.notes}</p>
              </div>
            ) : null}

            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Update status</p>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                {(["PLACED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"] as OrderStatus[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setNextStatus(item)}
                    className={`rounded-lg border px-2 py-2 text-left text-[9.5px] font-semibold transition ${
                      nextStatus === item ? "border-apollo-500 bg-apollo-50 text-apollo-800" : "border-line text-muted hover:border-apollo-200"
                    }`}
                  >
                    {statusMeta[item].label}
                  </button>
                ))}
              </div>
              <label className="mt-2 block">
                <span className="label">Internal note (optional)</span>
                <input value={note} onChange={(event) => setNote(event.target.value)} className="field" placeholder="e.g. Packed with cold-chain gel pack" />
              </label>
            </div>

            <div className="flex gap-2">
              <a href={`tel:+91${selected.customer.phone}`} className="btn-outline flex-1 py-2 text-[10px]"><Phone size={12} /> Call patient</a>
              <a
                href={`https://wa.me/91${selected.customer.phone}?text=${encodeURIComponent(`Hi ${selected.customer.name}, this is City Pharmacy regarding your order ${selected.orderNumber}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline flex-1 py-2 text-[10px]"
              >
                <MessageCircle size={12} /> WhatsApp
              </a>
            </div>
          </div>
        ) : null}
      </SidePanel>
    </div>
  );
}
