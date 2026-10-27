import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  ClipboardList,
  IndianRupee,
  MessageSquare,
  Package,
  Phone,
  Pill,
  Plus,
  ShoppingBag,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";
import { AdminPageHeader, StatCard } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/OrderStatus";
import { PageLoader } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { useCatalog } from "@/context/CatalogContext";
import { fetchAllOrders, fetchEnquiries, fetchMessages } from "@/lib/firestore";
import { formatDate, inr } from "@/lib/utils";
import type { ContactMessage, Enquiry, Order } from "@/types";

const activeStatuses = ["PLACED", "PACKED", "OUT_FOR_DELIVERY"];

export function AdminOverview() {
  const { products, liveOffer, offer, loading: catalogLoading } = useCatalog();
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [orderResult, enquiryResult, messageResult] = await Promise.allSettled([
        fetchAllOrders(),
        fetchEnquiries(),
        fetchMessages(),
      ]);
      if (orderResult.status === "fulfilled") setOrders(orderResult.value);
      if (enquiryResult.status === "fulfilled") setEnquiries(enquiryResult.value);
      if (messageResult.status === "fulfilled") setMessages(messageResult.value);
      setLoading(false);
    };
    void load();
  }, []);

  const stats = useMemo(() => {
    const valid = orders.filter((order) => order.status !== "CANCELLED");
    const revenue = valid.reduce((sum, order) => sum + (order.total || 0), 0);
    const today = new Date();
    const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const todayOrders = orders.filter((order) => {
      const date = order.createdAt as { seconds?: number } | string | undefined;
      const ms = typeof date === "string" ? Date.parse(date) : (date?.seconds ?? 0) * 1000;
      return ms >= dayStart;
    });
    return {
      revenue,
      todayRevenue: todayOrders.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + o.total, 0),
      todayOrders: todayOrders.length,
      pending: orders.filter((order) => activeStatuses.includes(order.status)).length,
      newEnquiries: enquiries.filter((enquiry) => enquiry.status === "new").length,
      newMessages: messages.filter((message) => message.status === "new").length,
      lowStock: products.filter((product) => product.active && product.stock > 0 && product.stock <= 8),
      offerCount: products.filter((product) => product.active && product.offerEligible).length,
      totalCustomers: new Set(valid.map((order) => order.userId)).size,
    };
  }, [orders, enquiries, messages, products]);

  const chart = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return { label: date.toLocaleDateString("en-IN", { weekday: "short" }), start: date.getTime(), end: date.getTime() + 86_400_000, total: 0 };
    });
    for (const order of orders) {
      if (order.status === "CANCELLED") continue;
      const date = order.createdAt as { seconds?: number } | string | undefined;
      const ms = typeof date === "string" ? Date.parse(date) : (date?.seconds ?? 0) * 1000;
      const match = days.find((day) => ms >= day.start && ms < day.end);
      if (match) match.total += order.total;
    }
    const max = Math.max(1, ...days.map((day) => day.total));
    return { days, max };
  }, [orders]);

  const recentOrders = orders.slice(0, 6);
  const recentEnquiries = enquiries.slice(0, 4);

  if (loading || catalogLoading) return <PageLoader />;

  return (
    <div>
      <AdminPageHeader title="Good to see you" description="Here's what's happening at City Pharmacy today.">
        <Link to="/admin/products" className="btn-primary px-3 py-2 text-[10.5px]"><Plus size={13} /> Add product</Link>
        <Link to="/admin/orders" className="btn-outline px-3 py-2 text-[10.5px]"><ClipboardList size={13} /> Manage orders</Link>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard label="Total revenue" value={inr(stats.revenue)} sub={`${inr(stats.todayRevenue)} today`} icon={IndianRupee} tone="apollo" />
        <StatCard label="Orders" value={orders.length} sub={`${stats.pending} awaiting action`} icon={ShoppingBag} tone="violet" />
        <StatCard label="Patients served" value={stats.totalCustomers} sub="Unique ordering accounts" icon={Users} tone="amber" />
        <StatCard label="New enquiries" value={stats.newEnquiries} sub={`${stats.newMessages} new messages`} icon={MessageSquare} tone="coral" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[13px] font-bold text-apollo-950">Revenue · last 7 days</h3>
              <p className="text-[9.5px] text-muted">Excluding cancelled orders</p>
            </div>
            <span className="rounded-full bg-apollo-50 px-2.5 py-1 text-[9px] font-bold text-apollo-700">{inr(chart.days.reduce((sum, day) => sum + day.total, 0))}</span>
          </div>
          <div className="mt-4 flex h-36 items-end gap-2">
            {chart.days.map((day) => (
              <div key={day.label} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[8px] font-semibold text-muted">{day.total ? (day.total >= 1000 ? `₹${(day.total / 1000).toFixed(1)}k` : `₹${day.total}`) : ""}</span>
                <div className="relative flex h-28 w-full items-end rounded-lg bg-cream">
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-apollo-700 to-apollo-400 transition-all"
                    style={{ height: `${Math.max(4, (day.total / chart.max) * 100)}%` }}
                  />
                </div>
                <span className="text-[8.5px] font-semibold text-muted">{day.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
            <div><p className="text-[8.5px] uppercase tracking-wide text-muted">Today</p><p className="text-[11px] font-bold text-ink">{stats.todayOrders} orders</p></div>
            <div><p className="text-[8.5px] uppercase tracking-wide text-muted">Avg. order</p><p className="text-[11px] font-bold text-ink">{inr(orders.length ? Math.round(stats.revenue / orders.filter((o) => o.status !== "CANCELLED").length || 0) : 0)}</p></div>
            <div><p className="text-[8.5px] uppercase tracking-wide text-muted">Pending</p><p className="text-[11px] font-bold text-ink">{stats.pending} to pack</p></div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-coral-600 via-coral-500 to-orange-500 p-5 text-white">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[18px] border-white/10" />
          <Sparkles size={22} className="text-amber-200" />
          <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-white/65">Diwali campaign</p>
          <h3 className="mt-1 text-xl font-extrabold leading-tight">{offer?.percent ?? 15}% OFF on {stats.offerCount} items</h3>
          <p className="mt-1 text-[10px] text-white/70">
            {liveOffer ? `Live until ${formatDate(liveOffer.endDate)} · Auto-applied at checkout.` : "The offer is currently paused. Review the campaign settings."}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Link to="/admin/offer" className="rounded-lg bg-white px-3 py-2 text-[9.5px] font-bold text-coral-700">Manage offer</Link>
            <Link to="/offers/diwali-15" className="rounded-lg border border-white/25 px-3 py-2 text-[9.5px] font-semibold text-white">Preview</Link>
          </div>
          <div className="mt-4 flex items-center gap-3 text-[9px] text-white/60">
            <span className="flex items-center gap-1"><BadgePercent size={11} /> {offer?.badge ?? "DIWALI 15% OFF"}</span>
            <span className="flex items-center gap-1"><Package size={11} /> {products.filter((p) => p.active).length} live products</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h3 className="text-[13px] font-bold text-apollo-950">Recent orders</h3>
            <Link to="/admin/orders" className="flex items-center gap-1 text-[9.5px] font-semibold text-apollo-700 hover:underline">View all <ArrowRight size={11} /></Link>
          </div>
          {recentOrders.length ? (
            <div className="divide-y divide-line">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-ink">{order.orderNumber} <StatusBadge status={order.status} /></p>
                    <p className="mt-0.5 truncate text-[9px] text-muted">{order.customer.name} · {order.items.length} items · {formatDate(order.createdAt, true)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-apollo-800">{inr(order.total)}</p>
                    <p className="text-[8px] text-muted">{order.paymentMethod === "COD" ? "COD" : "UPI"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={ShoppingBag} title="No orders yet" description="New orders will appear here as soon as a customer checks out." />
          )}
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h3 className="text-[13px] font-bold text-apollo-950">New enquiries</h3>
              <Link to="/admin/enquiries" className="flex items-center gap-1 text-[9.5px] font-semibold text-apollo-700 hover:underline">View all <ArrowRight size={11} /></Link>
            </div>
            {recentEnquiries.length ? (
              <div className="divide-y divide-line">
                {recentEnquiries.map((enquiry) => (
                  <div key={enquiry.id} className="flex items-start justify-between gap-2 px-4 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[10.5px] font-semibold text-ink">{enquiry.name}</p>
                      <p className="mt-0.5 truncate text-[9px] text-muted">{enquiry.message}</p>
                      <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-apollo-600">{enquiry.type.replaceAll("-", " ")}</p>
                    </div>
                    <a href={`tel:+91${enquiry.phone}`} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-apollo-50 text-apollo-700"><Phone size={12} /></a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-4 py-6 text-center text-[10px] text-muted">No patient enquiries yet.</p>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-[13px] font-bold text-apollo-950"><TriangleAlert size={14} className="text-amber-500" /> Low stock</h3>
              <Link to="/admin/products" className="text-[9px] font-semibold text-apollo-700 hover:underline">Restock</Link>
            </div>
            {stats.lowStock.length ? (
              <div className="mt-2 space-y-1.5">
                {stats.lowStock.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-2 text-[9.5px]">
                    <span className="truncate text-ink/75">{product.name}</span>
                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 font-bold text-amber-700">{product.stock} left</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[9.5px] text-muted">All products are comfortably stocked.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Link to="/admin/orders" className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-3 transition hover:border-apollo-200">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-apollo-50 text-apollo-700"><ClipboardList size={15} /></span>
          <div><p className="text-[10.5px] font-bold text-ink">Pack & dispatch</p><p className="text-[8.5px] text-muted">Update order status</p></div>
          <ArrowRight size={12} className="ml-auto text-muted" />
        </Link>
        <Link to="/admin/enquiries" className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-3 transition hover:border-apollo-200">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-coral-50 text-coral-600"><MessageSquare size={15} /></span>
          <div><p className="text-[10.5px] font-bold text-ink">Patient callbacks</p><p className="text-[8.5px] text-muted">{stats.newEnquiries} waiting</p></div>
          <ArrowRight size={12} className="ml-auto text-muted" />
        </Link>
        <Link to="/admin/products" className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-3 transition hover:border-apollo-200">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-700"><Pill size={15} /></span>
          <div><p className="text-[10.5px] font-bold text-ink">Catalogue</p><p className="text-[8.5px] text-muted">{products.filter((p) => p.active).length} live products</p></div>
          <ArrowRight size={12} className="ml-auto text-muted" />
        </Link>
      </div>
    </div>
  );
}
