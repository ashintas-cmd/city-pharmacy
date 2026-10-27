import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { useCatalog } from "@/context/CatalogContext";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, search]);
  return null;
}

function FloatingHelp() {
  const { settings } = useCatalog();
  const { pathname } = useLocation();
  if (pathname.startsWith("/checkout")) return null;
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2 lg:bottom-6 lg:right-6">
      <a
        href={`tel:+91${settings.phone}`}
        className="hidden h-10 w-10 place-items-center rounded-full border border-line bg-white text-apollo-700 shadow-card transition hover:bg-apollo-50 sm:grid lg:hidden"
        aria-label="Call City Pharmacy"
      >
        <Phone size={17} />
      </a>
      <a
        href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi City Pharmacy, I need help with an order.")}`}
        target="_blank"
        rel="noreferrer"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-float transition hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={23} fill="currentColor" className="text-white" />
      </a>
    </div>
  );
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-apollo-700 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <FloatingHelp />
    </div>
  );
}
