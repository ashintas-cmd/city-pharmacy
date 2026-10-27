import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BadgePercent,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Pill,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Store,
  UsersRound,
  X,
} from "lucide-react";
import { AuthPanel } from "@/components/AuthPanel";
import { LogoMark } from "@/components/Logo";
import { PageLoader } from "@/components/Skeletons";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/products", label: "Products", icon: Pill },
  { to: "/admin/offer", label: "Diwali offer", icon: BadgePercent },
  { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/admins", label: "Team access", icon: UsersRound },
  { to: "/admin/settings", label: "Store settings", icon: Settings },
];

const titles: Record<string, { title: string; description: string }> = {
  "/admin": { title: "Overview", description: "A live snapshot of City Pharmacy" },
  "/admin/orders": { title: "Orders", description: "Packing, delivery and order status" },
  "/admin/products": { title: "Products", description: "Catalogue, pricing and stock" },
  "/admin/offer": { title: "Diwali offer", description: "Control the 15% Diwali discount" },
  "/admin/enquiries": { title: "Patient enquiries", description: "Questions and prescription requests" },
  "/admin/messages": { title: "Contact messages", description: "General messages from the website" },
  "/admin/admins": { title: "Team access", description: "Who can open this admin panel" },
  "/admin/settings": { title: "Store settings", description: "Address, contact and delivery rules" },
};

export function AdminLogin() {
  const { settings } = useCatalog();
  usePageMeta("Admin sign in | City Pharmacy", "Secure staff sign-in for the City Pharmacy admin panel.");

  return (
    <div className="grid min-h-screen bg-cream lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-apollo-900 to-apollo-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[40px] border-white/5" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <LogoMark />
          <span className="text-xl font-extrabold">City <span className="text-apollo-300">Pharmacy</span></span>
        </Link>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-apollo-100 ring-1 ring-white/15">
            <ShieldCheck size={11} /> Staff access only
          </span>
          <h1 className="mt-4 text-[38px] font-extrabold leading-[1.02]">
            The store,<br />behind the storefront.
          </h1>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/60">
            Manage orders, stock, the Diwali offer and patient enquiries from one place. Every action is recorded in
            Firestore.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {["Orders", "Stock", "Patients"].map((label) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-apollo-300">{label}</p>
                <p className="mt-1 text-[10px] text-white/50">Live in Firestore</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-[10px] text-white/40">
          <p>{settings.name} · Adarsh Nagar, Delhi</p>
          <p className="mt-1">Owner: {settings.owner} · Open {settings.hours}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-5 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <LogoMark />
              <span className="text-lg font-extrabold text-apollo-900">City Pharmacy</span>
            </Link>
            <Link to="/" className="text-[9.5px] font-semibold text-apollo-700">View store</Link>
          </div>
          <AuthPanel
            admin
            title="Admin sign in"
            subtitle="Use an email address that is on the City Pharmacy admin list."
          />
          <Link to="/" className="mt-6 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-muted hover:text-apollo-700">
            <Store size={12} /> Back to the storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AdminAccessDenied() {
  const { user, logout } = useAuth();
  usePageMeta("Access denied | City Pharmacy admin", "This account does not have admin access.");

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-7 text-center shadow-card">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-coral-50 text-coral-600"><ShieldAlert size={28} /></span>
        <h1 className="mt-4 text-xl font-extrabold text-apollo-950">Admin access required</h1>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          You're signed in as <strong className="text-ink">{user?.email}</strong>, but this account is not on the admin
          list. Ask the owner to add your email under <strong>Team access</strong> — or ask them to create an{" "}
          <code className="rounded bg-cream px-1 py-0.5 text-[9px]">admins/{"{email}"}</code> document in Firestore.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button type="button" onClick={() => logout()} className="btn-primary py-2.5 text-[11px]"><LogOut size={14} /> Sign in with another account</button>
          <Link to="/" className="btn-outline py-2.5 text-[11px]">Back to storefront</Link>
        </div>
      </div>
    </div>
  );
}

export function AdminGate() {
  const { user, loading, isAdmin, adminLoading } = useAuth();
  if (loading || (user && adminLoading)) return <PageLoader />;
  if (!user) return <AdminLogin />;
  if (!isAdmin) return <AdminAccessDenied />;
  return <Outlet />;
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { settings } = useCatalog();
  return (
    <div className="flex h-full flex-col bg-apollo-950 text-white">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-4">
        <LogoMark className="h-9 w-9" />
        <div>
          <p className="text-sm font-extrabold leading-none">City <span className="text-apollo-300">Pharmacy</span></p>
          <p className="mt-1 text-[8px] font-semibold uppercase tracking-widest text-white/35">Admin panel</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] font-medium transition",
                isActive ? "bg-white/10 text-white shadow-inner" : "text-white/55 hover:bg-white/5 hover:text-white",
              )
            }
          >
            <item.icon size={15} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link to="/" className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[10px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white">
          <span className="flex items-center gap-1.5"><ExternalLink size={12} /> View storefront</span>
        </Link>
        <p className="mt-2.5 px-1 text-[8px] leading-relaxed text-white/25">
          {settings.name} · Drug Licence {settings.licence}
        </p>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = titles[location.pathname] ?? titles["/admin"];

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F4F7F4]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[236px] lg:block">
        <Sidebar />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[250px] animate-slide-in">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
            <button type="button" onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white" aria-label="Close menu"><X size={16} /></button>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[236px]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6">
          <button type="button" onClick={() => setMobileOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg text-ink/60 hover:bg-cream lg:hidden" aria-label="Open admin menu">
            <Menu size={19} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-extrabold text-apollo-950">{meta.title}</h1>
            <p className="hidden truncate text-[9.5px] text-muted sm:block">{meta.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-apollo-50 px-2.5 py-1.5 text-[9px] font-semibold text-apollo-700 sm:flex">
              <ShieldCheck size={11} /> Admin
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-line px-2 py-1.5">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-apollo-700 text-[9px] font-bold text-white">{(user?.email ?? "A").charAt(0).toUpperCase()}</span>
              )}
              <span className="hidden max-w-[150px] truncate text-[9.5px] font-medium text-muted md:block">{user?.email}</span>
              <button type="button" onClick={() => logout()} className="grid h-6 w-6 place-items-center rounded-md text-muted transition hover:bg-coral-50 hover:text-coral-600" aria-label="Sign out">
                <LogOut size={12} />
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-64px)] p-3 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-lg font-extrabold text-apollo-950 sm:text-xl">{title}</h2>
        {description ? <p className="mt-0.5 text-[10.5px] text-muted">{description}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "apollo",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: typeof ShoppingBag;
  tone?: "apollo" | "coral" | "amber" | "violet";
}) {
  const tones = {
    apollo: "bg-apollo-50 text-apollo-700",
    coral: "bg-coral-50 text-coral-600",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-start justify-between">
        <p className="text-[9.5px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        <span className={cn("grid h-8 w-8 place-items-center rounded-lg", tones[tone])}><Icon size={15} /></span>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-apollo-950">{value}</p>
      {sub ? <p className="mt-0.5 text-[9px] text-muted">{sub}</p> : null}
    </div>
  );
}
