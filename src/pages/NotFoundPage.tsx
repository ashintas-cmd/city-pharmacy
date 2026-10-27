import { Link } from "react-router-dom";
import { ArrowRight, Home, Search, ShoppingBag } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export function NotFoundPage() {
  usePageMeta("Page not found | City Pharmacy", "The page you were looking for could not be found.");

  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-[64px] font-extrabold leading-none tracking-tighter text-apollo-200">404</p>
        <h1 className="mt-2 text-2xl font-extrabold text-apollo-950">We looked everywhere.</h1>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          This page may have moved, or the link might be incorrect. Your medicines are still right where they should be.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/" className="btn-primary px-4 py-2.5 text-[11px]"><Home size={14} /> Back home</Link>
          <Link to="/shop" className="btn-outline px-4 py-2.5 text-[11px]"><ShoppingBag size={14} /> Shop products</Link>
          <Link to="/enquiry" className="btn-ghost px-4 py-2.5 text-[11px]"><Search size={14} /> Ask a pharmacist <ArrowRight size={12} /></Link>
        </div>
      </div>
    </div>
  );
}
