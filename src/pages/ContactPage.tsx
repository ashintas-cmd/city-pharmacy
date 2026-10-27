import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Stethoscope,
  Store,
  Loader2,
} from "lucide-react";
import { PageHead } from "@/components/PageHead";
import { StoreMap } from "@/components/StoreMap";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { submitContactMessage } from "@/lib/firestore";
import { usePageMeta } from "@/hooks/usePageMeta";

export function ContactPage() {
  const { settings } = useCatalog();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  usePageMeta(
    "Contact & store location | City Pharmacy, Adarsh Nagar",
    "Visit City Pharmacy at Main Market, Adarsh Nagar, Delhi 110033. Call +91 98710 40480 or send us a message. Open 24×7.",
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || form.message.trim().length < 10) {
      toast.error("Please complete the form", "Name, email, subject and a short message are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Enter a valid email", "We need a valid email to reply.");
      return;
    }
    setBusy(true);
    try {
      await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      toast.success("Message sent", "We'll get back to you within one working day.");
    } catch (error) {
      console.error(error);
      toast.error("Could not send the message", "Please try again or email us directly.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pb-12">
      <PageHead
        title="Visit our store"
        description="We're in the heart of Adarsh Nagar, open 24×7. Walk in for medicines, a free blood pressure check or a chat with our pharmacist."
        breadcrumbs={[{ label: "Contact" }]}
      >
        <a href={`tel:+91${settings.phone}`} className="btn-primary self-start px-4 py-2 text-[11px]">
          <Phone size={14} /> Call the store
        </a>
      </PageHead>

      <div className="shell mt-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="flex items-center gap-3 border-b border-line p-4">
                <img
                  src="/owner-1.jpg"
                  alt="Akshat Sabharwal, owner of City Pharmacy"
                  className="h-16 w-16 rounded-xl object-cover object-[center_18%] ring-2 ring-apollo-100"
                  loading="lazy"
                />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-apollo-600">Owner</p>
                  <p className="text-base font-extrabold text-apollo-950">Akshat Sabharwal</p>
                  <p className="text-[9.5px] text-muted">City Pharmacy · Adarsh Nagar</p>
                </div>
                <span className="ml-auto hidden items-center gap-1 rounded-full bg-apollo-50 px-2.5 py-1 text-[8.5px] font-bold text-apollo-700 sm:flex">
                  <BadgeCheck size={11} /> Licensed pharmacy
                </span>
              </div>
              <div className="space-y-3 p-4 text-[11px]">
                <p className="flex items-start gap-2 text-ink/75">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-apollo-600" />
                  <span>
                    {settings.addressLine1}
                    <br />
                    {settings.addressLine2}
                    <br />
                    {settings.city}, {settings.state} – {settings.pincode}
                  </span>
                </p>
                <a href={`tel:+91${settings.phone}`} className="flex items-center gap-2 text-ink/75 hover:text-apollo-700">
                  <Phone size={15} className="shrink-0 text-apollo-600" /> +91 {settings.phone.slice(0, 5)} {settings.phone.slice(5)}
                </a>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-ink/75 hover:text-apollo-700">
                  <Mail size={15} className="shrink-0 text-apollo-600" /> {settings.email}
                </a>
                <p className="flex items-center gap-2 text-ink/75">
                  <Clock3 size={15} className="shrink-0 text-apollo-600" /> {settings.hours}
                </p>
                <p className="flex items-center gap-2 text-ink/75">
                  <ShieldCheck size={15} className="shrink-0 text-apollo-600" /> Drug Licence {settings.licence}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line p-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary flex-1 py-2 text-[10.5px]"
                >
                  <MapPin size={13} /> Get directions
                </a>
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi City Pharmacy, I have a question.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex-1 py-2 text-[10.5px]"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-1.5">
              <StoreMap className="h-[300px]" />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { icon: Store, label: "Free BP check" },
                { icon: Stethoscope, label: "Pharmacist advice" },
                { icon: Clock3, label: "Open 24×7" },
                { icon: ShieldCheck, label: "Genuine stock" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-white px-2 py-3 text-center">
                  <item.icon size={16} className="text-apollo-600" />
                  <span className="text-[9px] font-semibold text-ink/65">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-apollo-50 text-apollo-700">
                  <BadgeCheck size={28} />
                </span>
                <h2 className="mt-3 text-lg font-extrabold text-apollo-950">Message sent</h2>
                <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-muted">
                  Thanks for writing to us. We'll reply within one working day. For anything urgent, please call the
                  store.
                </p>
                <button type="button" onClick={() => setSent(false)} className="btn-outline mt-4 px-4 py-2 text-[10.5px]">
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-base font-bold text-apollo-950">Send us a message</h2>
                <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
                  For non-medical questions, feedback or partnership enquiries. For medicine questions, please use the{" "}
                  <Link to="/enquiry" className="font-semibold text-apollo-700 hover:underline">patient enquiry form</Link>.
                </p>
                <form onSubmit={submit} className="mt-4 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="label">Your name *</span>
                      <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="field" placeholder="Full name" />
                    </label>
                    <label className="block">
                      <span className="label">Email *</span>
                      <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="field" placeholder="you@example.com" />
                    </label>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="label">Phone (optional)</span>
                      <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="field" placeholder="Mobile number" />
                    </label>
                    <label className="block">
                      <span className="label">Subject *</span>
                      <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="field" placeholder="How can we help?" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="label">Message *</span>
                    <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value.slice(0, 800) })} rows={5} className="field resize-none" placeholder="Write your message here…" />
                    <span className="mt-1 block text-right text-[8.5px] text-muted">{form.message.length}/800</span>
                  </label>
                  <button type="submit" disabled={busy} className="btn-primary w-full py-2.5 text-[11px]">
                    {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    {busy ? "Sending…" : "Send message"}
                  </button>
                  <p className="text-center text-[9px] text-muted">We never share your details. Read our <Link to="/privacy" className="font-semibold text-apollo-700">privacy policy</Link>.</p>
                </form>
              </>
            )}

            <div className="mt-5 rounded-xl bg-sand p-3.5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-amber-900">
                <Stethoscope size={13} /> Need a pharmacist instead?
              </p>
              <p className="mt-1 text-[9.5px] leading-relaxed text-amber-900/65">
                Use the patient enquiry form or call the store. Please do not send personal health information through
                the general contact form.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <Link to="/enquiry" className="inline-flex items-center gap-1 text-[9.5px] font-bold text-amber-900 hover:underline">
                  Patient enquiry <ArrowRight size={11} />
                </Link>
                <Link to="/prescription" className="inline-flex items-center gap-1 text-[9.5px] font-bold text-amber-900 hover:underline">
                  Upload prescription <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
