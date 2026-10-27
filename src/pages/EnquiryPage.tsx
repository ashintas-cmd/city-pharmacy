import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { PageHead } from "@/components/PageHead";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { submitEnquiry } from "@/lib/firestore";
import { validPhone } from "@/lib/utils";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { EnquiryType } from "@/types";

const enquiryTypes: { value: EnquiryType; label: string; hint: string }[] = [
  { value: "medicine-availability", label: "Medicine availability", hint: "Check if we have a medicine in stock" },
  { value: "home-delivery", label: "Home delivery", hint: "Ask about delivery to your area" },
  { value: "prescription-help", label: "Prescription help", hint: "Refills, substitutes or reading a prescription" },
  { value: "health-advice", label: "Ask a pharmacist", hint: "General guidance on an OTC product" },
  { value: "order-support", label: "Order support", hint: "Help with an existing order" },
  { value: "feedback", label: "Feedback", hint: "Tell us how we can do better" },
  { value: "other", label: "Something else", hint: "Anything not covered above" },
];

export function EnquiryPage() {
  const { user, profile } = useAuth();
  const { settings } = useCatalog();
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    area: "Adarsh Nagar",
    type: "medicine-availability" as EnquiryType,
    message: "",
    preferredTime: "Anytime",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const hydrated = useRef(false);

  usePageMeta(
    "Patient enquiry | City Pharmacy, Adarsh Nagar",
    "Ask City Pharmacy a question about medicine availability, home delivery or your prescription. Share your contact details and our pharmacist will call you back.",
  );

  useEffect(() => {
    if (hydrated.current) return;
    if (profile) {
      setForm((current) => ({
        ...current,
        name: current.name || profile.displayName || "",
        phone: current.phone || profile.phone || "",
        email: current.email || profile.email || "",
      }));
      hydrated.current = true;
    } else if (user) {
      setForm((current) => ({
        ...current,
        name: current.name || user.displayName || "",
        email: current.email || user.email || "",
      }));
      hydrated.current = true;
    }
  }, [profile, user]);

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!validPhone(form.phone)) next.phone = "Enter a valid 10-digit mobile number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.area.trim()) next.area = "Enter your area or locality.";
    if (form.message.trim().length < 10) next.message = "Please add a little more detail (at least 10 characters).";
    if (!form.consent) next.consent = "Please allow us to contact you about this enquiry.";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please complete the form", "A few details are missing.");
      return;
    }

    setBusy(true);
    try {
      const id = await submitEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        age: form.age.trim() || undefined,
        area: form.area.trim(),
        type: form.type,
        message: form.message.trim(),
        preferredTime: form.preferredTime,
        consent: true,
        userId: user?.uid,
      });
      setReference(id.slice(-6).toUpperCase());
      toast.success("Enquiry sent", "Our pharmacist will get back to you soon.");
    } catch (error) {
      console.error(error);
      toast.error("Could not send your enquiry", "Please try again, or call the store directly.");
    } finally {
      setBusy(false);
    }
  };

  if (reference) {
    const selected = enquiryTypes.find((item) => item.value === form.type);
    return (
      <div className="shell py-12">
        <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-line bg-white">
          <div className="bg-gradient-to-br from-apollo-700 to-apollo-950 p-7 text-center text-white">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/15"><CheckCircle2 size={30} /></span>
            <h1 className="mt-3 text-2xl font-extrabold">Enquiry received</h1>
            <p className="mt-1 text-[11px] text-white/65">
              Reference <strong className="text-white">CP-ENQ-{reference}</strong> · {selected?.label}
            </p>
          </div>
          <div className="p-6">
            <p className="text-[11.5px] leading-relaxed text-muted">
              Thank you, {form.name.split(" ")[0]}. A member of our pharmacy team will call you on{" "}
              <strong className="text-ink">{form.phone}</strong> during store hours. If your enquiry is urgent, please
              call the store directly.
            </p>
            <div className="mt-4 rounded-xl bg-cream p-3 text-[10px] leading-relaxed text-muted">
              <p className="font-semibold text-ink">Your message</p>
              <p className="mt-1">{form.message}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`tel:+91${settings.phone}`} className="btn-primary flex-1 py-2.5 text-[11px]"><Phone size={14} /> Call the store</a>
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi City Pharmacy, I sent an enquiry (Ref CP-ENQ-${reference}) for ${form.name}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline flex-1 py-2.5 text-[11px]"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
            <div className="mt-3 flex justify-center gap-3 text-[10px] font-semibold text-apollo-700">
              <Link to="/shop" className="hover:underline">Continue shopping</Link>
              <span className="text-line">|</span>
              <Link to="/prescription" className="hover:underline">Upload a prescription</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <PageHead
        title="Patient enquiry"
        description="Have a question about a medicine, a delivery or your prescription? Share your details and our pharmacist will call you back."
        breadcrumbs={[{ label: "Patient enquiry" }]}
      >
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-apollo-50 px-3 py-1.5 text-[10px] font-bold text-apollo-700">
          <Clock3 size={12} /> Replies during store hours
        </span>
      </PageHead>

      <div className="shell mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <form onSubmit={submit} className="card p-5 sm:p-6">
          <div className="flex items-start gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-apollo-700 text-white"><HeartHandshake size={17} /></span>
            <div>
              <h2 className="text-sm font-bold text-apollo-950">Tell us how we can help</h2>
              <p className="mt-0.5 text-[9.5px] text-muted">A pharmacist reads every enquiry personally.</p>
            </div>
          </div>

          <div className="mt-4">
            <span className="label">What is this about? *</span>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {enquiryTypes.map((item) => (
                <label
                  key={item.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 transition ${
                    form.type === item.value ? "border-apollo-500 bg-apollo-50/60 ring-1 ring-apollo-100" : "border-line hover:border-apollo-200"
                  }`}
                >
                  <input type="radio" name="enquiryType" checked={form.type === item.value} onChange={() => update("type", item.value)} className="h-3.5 w-3.5 accent-apollo-700" />
                  <span>
                    <span className="block text-[10px] font-semibold text-ink">{item.label}</span>
                    <span className="hidden text-[8.5px] text-muted sm:block">{item.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="label">Your name *</span>
              <div className="relative">
                <UserRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input value={form.name} onChange={(event) => update("name", event.target.value)} className="field pl-9" placeholder="Full name" />
              </div>
              {errors.name ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.name}</p> : null}
            </label>
            <label className="block">
              <span className="label">Mobile number *</span>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input value={form.phone} onChange={(event) => update("phone", event.target.value.replace(/[^\d+ ]/g, ""))} className="field pl-9" placeholder="10-digit mobile" inputMode="tel" />
              </div>
              {errors.phone ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.phone}</p> : null}
            </label>
            <label className="block">
              <span className="label">Email (optional)</span>
              <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="field" placeholder="you@example.com" />
              {errors.email ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.email}</p> : null}
            </label>
            <label className="block">
              <span className="label">Age (optional)</span>
              <input value={form.age} onChange={(event) => update("age", event.target.value)} className="field" placeholder="e.g. 42" />
            </label>
            <label className="block">
              <span className="label">Area / locality *</span>
              <input value={form.area} onChange={(event) => update("area", event.target.value)} className="field" placeholder="Adarsh Nagar" />
              {errors.area ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.area}</p> : null}
            </label>
            <label className="block">
              <span className="label">Best time to call</span>
              <select value={form.preferredTime} onChange={(event) => update("preferredTime", event.target.value)} className="field">
                {["Anytime", "Morning (9 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 8 PM)"].map((time) => (
                  <option key={time}>{time}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="label">Your question or message *</span>
            <textarea
              value={form.message}
              onChange={(event) => update("message", event.target.value)}
              rows={4}
              className="field resize-none"
              placeholder="e.g. Do you have Metformin 500mg in stock? Can you deliver to Azadpur today evening?"
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.message ? <p className="text-[9.5px] text-coral-600">{errors.message}</p> : <span />}
              <span className="text-[8.5px] text-muted">{form.message.length}/800</span>
            </div>
          </label>
          <label className="mt-3 flex items-start gap-2 text-[9.5px] leading-relaxed text-muted">
            <input type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-apollo-700" />
            <span>I agree to be contacted by City Pharmacy about this enquiry and have read the privacy policy.</span>
          </label>
          {errors.consent ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.consent}</p> : null}

          <button type="submit" disabled={busy} className="btn-primary mt-4 w-full py-3 text-xs">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
            {busy ? "Sending…" : "Send my enquiry"}
          </button>
          <p className="mt-2 text-center text-[9px] text-muted">
            We only use your details to answer this enquiry. No marketing spam.
          </p>
        </form>

        <aside className="space-y-3">
          <div className="card p-5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-apollo-600">Prefer to talk?</p>
            <h3 className="mt-1 text-base font-extrabold text-apollo-950">A real person is on the other end.</h3>
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              Call or WhatsApp the store for medicine availability, delivery updates or a quick question. We're open{" "}
              {settings.hours}.
            </p>
            <div className="mt-3 space-y-2">
              <a href={`tel:+91${settings.phone}`} className="flex items-center justify-between rounded-xl bg-apollo-50 px-3 py-2.5 text-[10.5px] font-bold text-apollo-800">
                <span className="flex items-center gap-2"><Phone size={14} /> +91 {settings.phone.slice(0, 5)} {settings.phone.slice(5)}</span>
                <ArrowRight size={12} />
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi City Pharmacy, I have a question.")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl bg-[#25D366]/10 px-3 py-2.5 text-[10.5px] font-bold text-[#128C4B]"
              >
                <span className="flex items-center gap-2"><MessageCircle size={14} /> WhatsApp the store</span>
                <ArrowRight size={12} />
              </a>
            </div>
          </div>

          <div className="card p-5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-ink"><MapPin size={14} className="text-apollo-600" /> Visit us</p>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-muted">
              {settings.addressLine1}, {settings.addressLine2}, {settings.city} – {settings.pincode}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[9.5px] text-muted"><Clock3 size={11} /> {settings.hours}</p>
            <Link to="/contact" className="mt-2.5 inline-flex items-center gap-1 text-[9.5px] font-bold text-apollo-700 hover:underline">
              Map & store details <ArrowRight size={11} />
            </Link>
          </div>

          <div className="rounded-xl border border-apollo-100 bg-apollo-50/60 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-apollo-900"><ShieldCheck size={13} /> Your privacy matters</p>
            <p className="mt-1 text-[9.5px] leading-relaxed text-apollo-900/60">
              Your contact details and message are stored securely in our Firebase database. Only City Pharmacy staff can
              read them. Read our <Link to="/privacy" className="font-semibold underline">privacy policy</Link>.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-amber-900"><Stethoscope size={13} /> Medical emergencies</p>
            <p className="mt-1 text-[9.5px] leading-relaxed text-amber-900/70">
              This form is not for emergencies. For severe symptoms, call 112 or go to the nearest hospital.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
