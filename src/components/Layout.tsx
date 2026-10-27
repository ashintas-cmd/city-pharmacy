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

function Watermark() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><g fill='none' stroke='%23156F6C' stroke-width='1' opacity='0.06'><rect x='40' y='40' width='60' height='60' rx='14'/><path d='M62 54h16v8h8v16h-8v8H62v-8h-8V62h8z' fill='%23156F6C' opacity='0.08' stroke='none'/></g><text x='70' y='125' text-anchor='middle' font-family='Inter, sans-serif' font-size='9' font-weight='700' fill='%23156F6C' opacity='0.05' letter-spacing='2'>CITY PHARMACY</text></svg>`;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-60"
      style={{
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "140px 140px",
        backgroundPosition: "center",
      }}
    />
  );
}
export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Watermark />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-apollo-700 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="relative z-10 flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <FloatingHelp />
    </div>
  );
}
