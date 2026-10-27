import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Package, Tag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const items = [
  { label: "Home", to: "/", icon: Home, match: (p: string) => p === "/" },
  { label: "Shop", to: "/shop", icon: LayoutGrid, match: (p: string) => p.startsWith("/shop") || p.startsWith("/product") },
  { label: "Offers", to: "/offers/diwali-15", icon: Tag, match: (p: string) => p.startsWith("/offers") },
  { label: "Orders", to: "/orders", icon: Package, match: (p: string) => p.startsWith("/orders") },
  { label: "Account", to: "/account", icon: User, match: (p: string) => p.startsWith("/account") || p.startsWith("/login") },
];

export function MobileNav() {
  const { pathname } = useLocation();
  const { count } = useCart();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 backdrop-blur lg:hidden" aria-label="Mobile navigation">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-[9.5px] font-semibold transition",
                active ? "text-apollo-700" : "text-muted hover:text-apollo-700",
              )}
            >
              <span className={cn("relative grid h-8 w-8 place-items-center rounded-xl transition", active && "bg-apollo-50")}>
                <item.icon size={19} strokeWidth={active ? 2.4 : 1.9} />
                {item.label === "Orders" && count > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-coral-500 px-0.5 text-[8px] font-bold text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                ) : null}
              </span>
              {item.label}
              {active ? <span className="absolute -top-px h-0.5 w-8 rounded-full bg-apollo-600" /> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
