import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Truck,
  Undo2,
  Stethoscope,
  LockKeyhole,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { submitContactMessage } from "@/lib/firestore";
import { inr } from "@/lib/utils";

export function TrustStrip() {
  const items = [
    { icon: ShieldCheck, title: "100% genuine", text: "Sourced from authorised distributors" },
    { icon: Truck, title: "90-min delivery", text: "Across Adarsh Nagar & nearby" },
    { icon: Stethoscope, title: "Pharmacist support", text: "Free guidance, 8am – 11pm" },
    { icon: Undo2, title: "Easy returns", text: "7-day hassle-free returns" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-apollo-50 text-apollo-700">
            <item.icon size={17} strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-ink">{item.title}</p>
            <p className="truncate text-[9.5px] text-muted">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Footer() {
  const { categories, settings } = useCatalog();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Enter a valid email", "We need a valid email to send offers.");
      return;
    }
    setSubmitting(true);
    try {
      await submitContactMessage({
        name: "Newsletter subscriber",
        email: email.trim(),
        subject: "Newsletter signup",
        message: "Please add this email to the City Pharmacy offers newsletter.",
      });
      setEmail("");
      toast.success("You're on the list", "Diwali offers and health tips will land in your inbox.");
    } catch {
      toast.error("Could not subscribe", "Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="mt-12 bg-apollo-950 text-white">
      <div className="shell">
        <div className="grid gap-8 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-xl font-extrabold tracking-tight">
                City <span className="text-apollo-300">Pharmacy</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-[11.5px] leading-relaxed text-white/60">
              {settings.tagline} Serving families in Adarsh Nagar with genuine medicines, honest advice and
              same-day delivery across North Delhi.
            </p>

            <div className="mt-5 space-y-2.5 text-[11px] text-white/70">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-apollo-300" />
                <span>
                  {settings.addressLine1}
                  <br />
                  {settings.addressLine2}, {settings.city} – {settings.pincode}
                </span>
              </p>
              <a href={`tel:+91${settings.phone}`} className="flex items-center gap-2 transition hover:text-white">
                <Phone size={14} className="shrink-0 text-apollo-300" />
                +91 {settings.phone.slice(0, 5)} {settings.phone.slice(5)}
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 transition hover:text-white">
                <Mail size={14} className="shrink-0 text-apollo-300" />
                {settings.email}
              </a>
              <p className="flex items-center gap-2">
                <Clock size={14} className="shrink-0 text-apollo-300" />
                {settings.hours}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:col-span-1 lg:col-span-4">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-apollo-300">Shop</p>
              <ul className="space-y-2 text-[11px] text-white/65">
                {categories.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <Link to={`/shop?category=${category.slug}`} className="transition hover:text-white">
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/shop" className="font-semibold text-white transition hover:text-apollo-200">
                    View all products
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-apollo-300">Company</p>
              <ul className="space-y-2 text-[11px] text-white/65">
                <li><Link className="transition hover:text-white" to="/about">About us</Link></li>
                <li><Link className="transition hover:text-white" to="/offers/diwali-15">Diwali 15% offer</Link></li>
                <li><Link className="transition hover:text-white" to="/prescription">Upload prescription</Link></li>
                <li><Link className="transition hover:text-white" to="/enquiry">Patient enquiry</Link></li>
                <li><Link className="transition hover:text-white" to="/contact">Visit our store</Link></li>
                <li><Link className="transition hover:text-white" to="/orders">Track my orders</Link></li>
              </ul>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-apollo-300">Health notes & offers</p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-white/60">
              Join 2,400+ neighbours getting seasonal health tips and early access to pharmacy offers.
            </p>
            <form onSubmit={subscribe} className="mt-3 flex overflow-hidden rounded-xl bg-white/10 p-1 ring-1 ring-white/15">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                className="h-9 min-w-0 flex-1 bg-transparent px-2.5 text-[11.5px] text-white outline-none placeholder:text-white/40"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                disabled={submitting}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-apollo-300 text-apollo-950 transition hover:bg-white disabled:opacity-50"
                aria-label="Subscribe"
              >
                <Send size={14} />
              </button>
            </form>

            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
              <p className="flex items-center gap-2 text-[11px] font-semibold text-white">
                <Stethoscope size={14} className="text-apollo-300" />
                Need help with a prescription?
              </p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-white/55">
                Send a photo on WhatsApp and our pharmacist will call you back within 15 minutes.
              </p>
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi City Pharmacy, I have a prescription. Please help me order.")}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 text-[10.5px] font-bold text-apollo-200 hover:text-white"
              >
                Message on WhatsApp <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-5 text-[10px] text-white/50 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {new Date().getFullYear()} City Pharmacy. All rights reserved.</span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span>Proprietor: {settings.owner}</span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span className="flex items-center gap-1">
              <ShieldCheck size={11} /> Drug Licence: {settings.licence}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link to="/terms" className="transition hover:text-white">Terms</Link>
            <Link to="/shipping" className="transition hover:text-white">Shipping</Link>
            <Link to="/returns" className="transition hover:text-white">Returns</Link>
            <Link to="/admin" className="flex items-center gap-1 transition hover:text-white">
              <LockKeyhole size={10} /> Admin
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-4 text-[9.5px] text-white/40 sm:flex-row">
          <p>
            Free delivery on orders above {inr(settings.freeDeliveryAbove)} · Express delivery in {settings.deliveryEta}
          </p>
          <p className="flex items-center gap-2">
            <span>We accept</span>
            <span className="rounded bg-white/10 px-2 py-0.5 font-semibold text-white/70">UPI</span>
            <span className="rounded bg-white/10 px-2 py-0.5 font-semibold text-white/70">Visa</span>
            <span className="rounded bg-white/10 px-2 py-0.5 font-semibold text-white/70">Mastercard</span>
            <span className="rounded bg-white/10 px-2 py-0.5 font-semibold text-white/70">COD</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
