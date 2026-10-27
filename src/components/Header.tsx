import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Clock,
  LayoutGrid,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  Tag,
  Upload,
  User,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { PackArt } from "@/components/PackArt";
import { CategoryIcon, categoryTones } from "@/components/CategoryIcon";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn, inr } from "@/lib/utils";

function CategoryMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { categories } = useCatalog();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition",
          open ? "bg-apollo-50 text-apollo-800" : "text-ink/75 hover:bg-apollo-50 hover:text-apollo-800",
        )}
        aria-expanded={open}
      >
        <LayoutGrid size={15} />
        All Categories
        <ChevronDown size={13} className={cn("transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[560px] max-w-[92vw] overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-float animate-fade-in">
          <div className="grid grid-cols-2 gap-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.slug}`}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-cream"
              >
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", categoryTones[category.tone] ?? "bg-apollo-50 text-apollo-700")}>
                  <CategoryIcon name={category.icon} size={18} />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-ink">{category.name}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-muted">{category.description}</span>
                </span>
              </Link>
            ))}
          </div>
          <Link
            to="/shop"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-between rounded-xl bg-apollo-50 px-3 py-2.5 text-xs font-bold text-apollo-800"
          >
            Browse the full catalogue
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function SearchBox({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { products } = useCatalog();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (product) =>
          product.active &&
          (product.name.toLowerCase().includes(q) ||
            product.brand.toLowerCase().includes(q) ||
            product.tags?.some((tag) => tag.includes(q))),
      )
      .slice(0, 5);
  }, [products, query]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const runSearch = () => {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    onNavigate?.();
    navigate(`/shop?q=${encodeURIComponent(q)}`);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    runSearch();
  };

  return (
    <div className="relative w-full" ref={wrapper}>
      <form onSubmit={submit} className="group flex w-full items-center rounded-xl border border-line bg-white shadow-sm transition focus-within:border-apollo-400 focus-within:ring-4 focus-within:ring-apollo-100">
        <Search size={17} className="ml-3.5 shrink-0 text-muted" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search medicines, wellness, brands…"
          className="h-11 w-full min-w-0 bg-transparent px-2.5 text-[13px] text-ink outline-none placeholder:text-muted/70"
          aria-label="Search products"
        />
        <button
          type="submit"
          className="mr-1 hidden h-9 shrink-0 items-center gap-1.5 rounded-lg bg-apollo-700 px-4 text-xs font-semibold text-white transition hover:bg-apollo-800 sm:flex"
        >
          Search
        </button>
      </form>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-float animate-fade-in">
          {query.trim() ? (
            suggestions.length ? (
              <>
                <p className="px-2 pb-1 pt-1 text-[9px] font-bold uppercase tracking-widest text-muted">Products</p>
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className="flex items-center gap-2.5 rounded-xl p-2 transition hover:bg-cream"
                  >
                    <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-cream">
                      <PackArt product={product} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-ink">{product.name}</span>
                      <span className="block truncate text-[10px] text-muted">
                        {product.brand} · {product.packSize}
                      </span>
                    </span>
                    <span className="text-xs font-bold text-apollo-800">{inr(product.price)}</span>
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={runSearch}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-apollo-50 py-2 text-[11px] font-bold text-apollo-800"
                >
                  View all results for “{query.trim()}” <ArrowRight size={12} />
                </button>
              </>
            ) : (
              <div className="px-3 py-6 text-center">
                <p className="text-xs font-semibold text-ink">No products found for “{query.trim()}”</p>
                <p className="mt-1 text-[11px] text-muted">Try searching a brand, salt name or health concern.</p>
              </div>
            )
          ) : (
            <>
              <p className="px-2 pb-1.5 pt-1 text-[9px] font-bold uppercase tracking-widest text-muted">Popular searches</p>
              <div className="flex flex-wrap gap-1.5 p-1">
                {["Paracetamol", "Vitamin C", "BP monitor", "Baby diapers", "Ashwagandha", "Sunscreen"].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      setOpen(false);
                      onNavigate?.();
                      navigate(`/shop?q=${encodeURIComponent(term)}`);
                    }}
                    className="rounded-full border border-line px-2.5 py-1.5 text-[11px] font-medium text-ink/70 transition hover:border-apollo-300 hover:bg-apollo-50 hover:text-apollo-800"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-sand px-3 py-2 text-[10.5px] text-amber-900">
                <Sparkles size={13} />
                Diwali offer: flat 15% off on selected items
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  const { categories, settings } = useCatalog();
  const { count } = useCart();
  const { user, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  const navLinks = [
    { label: "Medicines", to: "/shop?category=medicines" },
    { label: "Wellness", to: "/shop?category=wellness" },
    { label: "Personal Care", to: "/shop?category=personal-care" },
    { label: "Baby & Mom", to: "/shop?category=baby-mom" },
    { label: "Health Devices", to: "/shop?category=devices" },
    { label: "Ayurveda", to: "/shop?category=ayurveda" },
  ];

  return (
    <>
      <div className="bg-apollo-950 text-white">
        <div className="shell flex h-8 items-center justify-between gap-4 text-[10px] font-medium sm:text-[11px]">
          <p className="flex min-w-0 items-center gap-1.5">
            <Sparkles size={11} className="shrink-0 text-amber-300" />
            <span className="truncate sm:hidden">Flat 15% OFF this Diwali · Auto-applied</span>
            <span className="hidden truncate sm:inline">
              Diwali Dhamaka · Flat 15% OFF on selected items · Auto-applied at checkout
            </span>
          </p>
          <div className="hidden shrink-0 items-center gap-4 text-white/75 sm:flex">
            <span className="flex items-center gap-1">
              <Clock size={11} /> {settings.hours}
            </span>
            <a href={`tel:+91${settings.phone}`} className="flex items-center gap-1 transition hover:text-white">
              <Phone size={11} /> {settings.phone.slice(0, 5)} {settings.phone.slice(5)}
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="shell">
          <div className="flex h-[68px] items-center gap-3 lg:h-[76px] lg:gap-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink/70 transition hover:bg-cream lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <Logo />

            <div className="hidden shrink-0 items-center gap-1.5 border-l border-line pl-4 xl:flex">
              <MapPin size={16} className="text-apollo-600" />
              <div className="leading-tight">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted">Deliver to</p>
                <p className="text-[11px] font-bold text-ink">{settings.pincode} · Adarsh Nagar</p>
              </div>
            </div>

            <div className="hidden flex-1 lg:block">
              <SearchBox />
            </div>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <Link
                to="/prescription"
                className="hidden items-center gap-1.5 rounded-lg border border-apollo-200 px-3 py-2 text-[11px] font-semibold text-apollo-800 transition hover:border-apollo-400 hover:bg-apollo-50 md:flex"
              >
                <Upload size={14} /> Upload Rx
              </Link>
              <Link
                to="/offers/diwali-15"
                className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-coral-600 transition hover:bg-coral-50 sm:flex"
              >
                <Tag size={14} /> Offers
              </Link>
              <Link
                to={user ? "/account" : "/login"}
                className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold text-ink/75 transition hover:bg-cream hover:text-apollo-800"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-6 w-6 rounded-full object-cover ring-2 ring-apollo-100" />
                ) : (
                  <User size={17} />
                )}
                <span className="hidden lg:inline">{user ? "Account" : "Login"}</span>
              </Link>
              <Link
                to="/cart"
                className="relative flex items-center gap-2 rounded-xl bg-apollo-700 px-3 py-2.5 text-[11px] font-bold text-white transition hover:bg-apollo-800 sm:px-3.5"
              >
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Cart</span>
                {count > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-coral-500 px-1 text-[9px] font-bold text-white">
                    {count > 99 ? "99+" : count}
                  </span>
                ) : null}
              </Link>
            </div>
          </div>

          <div className="pb-2.5 lg:hidden">
            <SearchBox mobile />
          </div>

          <div className="hidden items-center justify-between border-t border-line/80 py-1 lg:flex">
            <nav className="flex items-center gap-0.5" aria-label="Shop categories">
              <CategoryMenu />
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="rounded-lg px-2.5 py-2 text-[11px] font-medium text-ink/70 transition hover:bg-apollo-50 hover:text-apollo-800"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <Link to="/admin" className="text-[10px] font-bold uppercase tracking-wider text-apollo-700 hover:text-apollo-900">
                  Admin panel
                </Link>
              ) : null}
              <Link
                to="/offers/diwali-15"
                className="group flex items-center gap-1.5 rounded-full bg-gradient-to-r from-coral-600 to-orange-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm transition hover:shadow-md"
              >
                <Sparkles size={11} className="text-amber-200" />
                DIWALI 15% OFF
                <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-float animate-slide-in">
            <div className="flex items-center justify-between border-b border-line p-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-cream text-ink/60"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-muted">Shop by category</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/shop?category=${category.slug}`}
                    className="flex items-center gap-2 rounded-xl border border-line p-2.5"
                  >
                    <span className={cn("grid h-8 w-8 place-items-center rounded-lg", categoryTones[category.tone])}>
                      <CategoryIcon name={category.icon} size={16} />
                    </span>
                    <span className="text-[11px] font-semibold leading-tight text-ink">{category.name}</span>
                  </Link>
                ))}
              </div>

              <p className="mb-2 mt-5 text-[9px] font-bold uppercase tracking-widest text-muted">Quick links</p>
              <div className="space-y-1">
                {[
                  { label: "Diwali 15% OFF", to: "/offers/diwali-15", icon: Tag },
                  { label: "Upload prescription", to: "/prescription", icon: Upload },
                  { label: "Patient enquiry", to: "/enquiry", icon: Sparkles },
                  { label: "Track my orders", to: "/orders", icon: ShoppingBag },
                  { label: "Visit our store", to: "/contact", icon: MapPin },
                  { label: "My account", to: user ? "/account" : "/login", icon: User },
                  ...(isAdmin ? [{ label: "Admin panel", to: "/admin", icon: LayoutGrid }] : []),
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex items-center gap-2.5 rounded-xl px-2 py-2.5 text-xs font-medium text-ink/80 transition hover:bg-cream"
                  >
                    <item.icon size={15} className="text-apollo-600" />
                    {item.label}
                    <ArrowRight size={13} className="ml-auto text-muted/50" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-line bg-cream p-4">
              <a href={`tel:+91${settings.phone}`} className="flex items-center gap-2 text-xs font-bold text-apollo-800">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-apollo-700 text-white">
                  <Phone size={14} />
                </span>
                Call {settings.phone.slice(0, 5)} {settings.phone.slice(5)}
              </a>
              <p className="mt-2 text-[10px] leading-relaxed text-muted">
                {settings.addressLine1}, {settings.city} {settings.pincode}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
