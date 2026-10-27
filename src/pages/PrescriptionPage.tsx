import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  MessageCircle,
  Phone,
  ShieldCheck,
  Stethoscope,
  Upload,
  X,
} from "lucide-react";
import { PageHead } from "@/components/PageHead";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { submitEnquiry, uploadPrescriptionFile } from "@/lib/firestore";
import { compressToDataUrl } from "@/lib/image";
import { validPhone } from "@/lib/utils";
import { usePageMeta } from "@/hooks/usePageMeta";

const times = ["Morning (9 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 8 PM)", "Anytime"];

export function PrescriptionPage() {
  const { user, profile } = useAuth();
  const { settings } = useCatalog();
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    area: "Adarsh Nagar",
    doctor: "",
    notes: "",
    preferredTime: "Anytime",
    consent: false,
  });
  const [file, setFile] = useState<{ dataUrl: string; name: string } | null>(null);
  const [fileError, setFileError] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState<string | null>(null);
  const hydrated = useRef(false);

  usePageMeta(
    "Upload prescription | City Pharmacy",
    "Send your prescription to City Pharmacy, Adarsh Nagar. Our pharmacist verifies it, confirms availability and calls you back within 15 minutes.",
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

  const onFile = async (selected: File | undefined) => {
    if (!selected) return;
    setFileError("");
    if (selected.size > 8 * 1024 * 1024) {
      setFileError("Please choose a file smaller than 8 MB.");
      return;
    }
    try {
      const dataUrl = await compressToDataUrl(selected, { maxDimension: 1400, quality: 0.72 });
      setFile({ dataUrl, name: selected.name });
    } catch (error) {
      setFileError(error instanceof Error ? error.message : "Could not process that file.");
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Enter the patient's name.";
    if (!validPhone(form.phone)) next.phone = "Enter a valid 10-digit mobile number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.area.trim()) next.area = "Enter your area or locality.";
    if (!form.consent) next.consent = "Please allow our pharmacist to contact you.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      let prescriptionFileId: string | undefined;
      if (file) {
        prescriptionFileId = await uploadPrescriptionFile(file.dataUrl, file.name, user?.uid);
      }

      const message = [
        "Prescription verification request.",
        form.doctor ? `Doctor: ${form.doctor}.` : "",
        form.notes ? `Notes: ${form.notes}` : "",
        file ? "A prescription photo is attached to this request." : "Patient will share the prescription on WhatsApp.",
        `Preferred callback: ${form.preferredTime}.`,
      ]
        .filter(Boolean)
        .join(" ");

      const id = await submitEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        age: form.age.trim() || undefined,
        area: form.area.trim(),
        type: "prescription-help",
        message,
        preferredTime: form.preferredTime,
        consent: true,
        userId: user?.uid,
        prescriptionFileId,
        prescriptionName: file?.name,
      });
      setReference(id.slice(-6).toUpperCase());
      toast.success("Prescription received", "Our pharmacist will call you shortly.");
    } catch (error) {
      console.error(error);
      toast.error("Could not send the prescription", "Please try again or send it on WhatsApp.");
    } finally {
      setBusy(false);
    }
  };

  if (reference) {
    return (
      <div className="shell py-12">
        <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-line bg-white">
          <div className="bg-gradient-to-br from-apollo-700 to-apollo-950 p-7 text-center text-white">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/15">
              <CheckCircle2 size={30} />
            </span>
            <h1 className="mt-3 text-2xl font-extrabold">Prescription received</h1>
            <p className="mt-1 text-[11px] text-white/65">
              Reference <strong className="font-bold text-white">CP-RX-{reference}</strong> · {form.phone}
            </p>
          </div>
          <div className="p-6">
            <p className="text-[11.5px] leading-relaxed text-muted">
              Thank you, {form.name.split(" ")[0]}. Our licensed pharmacist will review your prescription, confirm
              availability and call you on <strong className="text-ink">{form.phone}</strong> within{" "}
              <strong className="text-ink">15 minutes</strong> during store hours.
            </p>
            <div className="mt-4 space-y-2">
              {[
                "We verify the prescription and check stock.",
                "You receive a call with the exact price and substitutes, if any.",
                "Confirm the order and we dispatch it to your address.",
              ].map((step, index) => (
                <div key={step} className="flex items-start gap-2 text-[10.5px] text-ink/70">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-apollo-50 text-[9px] font-bold text-apollo-700">{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`tel:+91${settings.phone}`} className="btn-primary flex-1 py-2.5 text-[11px]"><Phone size={14} /> Call the store</a>
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi City Pharmacy, I sent a prescription (Ref CP-RX-${reference}) for ${form.name}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline flex-1 py-2.5 text-[11px]"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
            <Link to="/shop" className="mt-3 block text-center text-[10px] font-semibold text-apollo-700 hover:underline">
              Continue shopping while you wait
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <PageHead
        title="Upload your prescription"
        description="Send it once. Our licensed pharmacist verifies it, confirms availability and calls you back with the exact price."
        breadcrumbs={[{ label: "Upload prescription" }]}
      >
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-apollo-50 px-3 py-1.5 text-[10px] font-bold text-apollo-700">
          <ShieldCheck size={12} /> Handled by a licensed pharmacist
        </span>
      </PageHead>

      <div className="shell mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <form onSubmit={submit} className="card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-apollo-700 text-white"><Upload size={15} /></span>
            <div>
              <h2 className="text-sm font-bold text-apollo-950">Prescription details</h2>
              <p className="text-[9.5px] text-muted">Fields marked * are required</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="label">Patient name *</span>
              <input value={form.name} onChange={(event) => update("name", event.target.value)} className="field" placeholder="Full name" />
              {errors.name ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.name}</p> : null}
            </label>
            <label className="block">
              <span className="label">Mobile number *</span>
              <input value={form.phone} onChange={(event) => update("phone", event.target.value.replace(/[^\d+ ]/g, ""))} className="field" placeholder="10-digit mobile" inputMode="tel" />
              {errors.phone ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.phone}</p> : null}
            </label>
            <label className="block">
              <span className="label">Email (optional)</span>
              <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="field" placeholder="you@example.com" />
              {errors.email ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.email}</p> : null}
            </label>
            <label className="block">
              <span className="label">Patient age (optional)</span>
              <input value={form.age} onChange={(event) => update("age", event.target.value)} className="field" placeholder="e.g. 34 years" />
            </label>
            <label className="block">
              <span className="label">Area / locality *</span>
              <input value={form.area} onChange={(event) => update("area", event.target.value)} className="field" placeholder="Adarsh Nagar" />
              {errors.area ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.area}</p> : null}
            </label>
            <label className="block">
              <span className="label">Doctor's name (optional)</span>
              <input value={form.doctor} onChange={(event) => update("doctor", event.target.value)} className="field" placeholder="Prescribing doctor" />
            </label>
          </div>

          <div className="mt-4">
            <span className="label">Attach prescription photo</span>
            {file ? (
              <div className="flex items-center gap-3 rounded-xl border border-apollo-200 bg-apollo-50/40 p-3">
                {file.dataUrl.startsWith("data:image") ? (
                  <img src={file.dataUrl} alt="Prescription preview" className="h-16 w-16 rounded-lg object-cover" />
                ) : (
                  <span className="grid h-16 w-16 place-items-center rounded-lg bg-white text-apollo-700"><FileText size={24} /></span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10.5px] font-semibold text-ink">{file.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[9px] text-apollo-700"><Check size={10} /> Ready to send securely</p>
                </div>
                <button type="button" onClick={() => setFile(null)} className="grid h-7 w-7 place-items-center rounded-full bg-white text-muted hover:text-coral-600" aria-label="Remove file">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-apollo-300 bg-cream/60 px-4 py-6 text-center transition hover:border-apollo-500 hover:bg-apollo-50/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-apollo-50 text-apollo-700"><Camera size={18} /></span>
                <span className="mt-2 text-[11px] font-semibold text-ink">Tap to add a photo or PDF</span>
                <span className="mt-0.5 text-[9px] text-muted">JPG, PNG or PDF · up to 8 MB · compressed before upload</span>
              </button>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(event) => void onFile(event.target.files?.[0])}
            />
            {fileError ? <p className="mt-1.5 text-[9.5px] text-coral-600">{fileError}</p> : null}
            {!file ? (
              <p className="mt-1.5 flex items-center gap-1 text-[9px] text-muted">
                <MessageCircle size={10} /> Prefer WhatsApp?{" "}
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi City Pharmacy, I would like to send my prescription.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-apollo-700 hover:underline"
                >
                  Send it here instead
                </a>
              </p>
            ) : null}
          </div>

          <div className="mt-4">
            <label className="block">
              <span className="label">Anything we should know?</span>
              <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} rows={3} className="field resize-none" placeholder="e.g. Please suggest a generic substitute, or deliver after 6 PM." />
            </label>
          </div>

          <div className="mt-4">
            <span className="label">Preferred callback time</span>
            <div className="flex flex-wrap gap-1.5">
              {times.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => update("preferredTime", time)}
                  className={`rounded-full border px-2.5 py-1.5 text-[9.5px] font-medium transition ${
                    form.preferredTime === time ? "border-apollo-600 bg-apollo-700 text-white" : "border-line text-ink/65 hover:border-apollo-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-4 flex items-start gap-2 text-[9.5px] leading-relaxed text-muted">
            <input type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-apollo-700" />
            <span>
              I allow a City Pharmacy pharmacist to contact me about this prescription and confirm that the prescription
              is valid and belongs to me or the patient named above.
            </span>
          </label>
          {errors.consent ? <p className="mt-1 text-[9.5px] text-coral-600">{errors.consent}</p> : null}

          <button type="submit" disabled={busy} className="btn-primary mt-4 w-full py-3 text-xs">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {busy ? "Sending securely…" : "Send to our pharmacist"}
          </button>
          <p className="mt-2 text-center text-[9px] text-muted">
            Your prescription is only visible to our licensed pharmacist. Never share it publicly.
          </p>
        </form>

        <aside className="space-y-3">
          <div className="rounded-2xl bg-gradient-to-br from-apollo-800 to-apollo-950 p-5 text-white">
            <p className="text-[9px] font-bold uppercase tracking-widest text-apollo-200">What happens next</p>
            <div className="mt-3 space-y-3">
              {[
                { icon: FileText, title: "We read it carefully", text: "A licensed pharmacist checks every medicine, dose and expiry." },
                { icon: Phone, title: "We call you back", text: "Within 15 minutes during store hours (8 AM – 11 PM)." },
                { icon: CheckCircle2, title: "You confirm", text: "We share the exact price and any substitutes before dispatch." },
              ].map((step, index) => (
                <div key={step.title} className="flex gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-apollo-100">
                    <step.icon size={15} />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-white">{step.title}</p>
                    <p className="mt-0.5 text-[9.5px] leading-relaxed text-white/50">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-2 text-[9px] text-white/55">
              <Clock3 size={11} /> Store hours: {settings.hours}
            </div>
          </div>

          <div className="card p-5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-ink"><Stethoscope size={14} className="text-apollo-600" /> Not sure what you need?</p>
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              Call the store and describe your symptoms. We'll help you book a doctor or find the right over-the-counter
              option.
            </p>
            <a href={`tel:+91${settings.phone}`} className="mt-3 flex items-center justify-between rounded-xl bg-apollo-50 px-3 py-2.5 text-[10.5px] font-bold text-apollo-800">
              <span className="flex items-center gap-2"><Phone size={13} /> +91 {settings.phone.slice(0, 5)} {settings.phone.slice(5)}</span>
              <ArrowRight size={12} />
            </a>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-[10px] font-bold text-amber-900">For medical emergencies</p>
            <p className="mt-1 text-[9.5px] leading-relaxed text-amber-900/70">
              This form is not monitored 24×7 for emergencies. For chest pain, breathing difficulty or severe reactions,
              call 112 or visit the nearest hospital immediately.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
