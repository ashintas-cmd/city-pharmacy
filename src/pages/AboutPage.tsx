import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  HeartHandshake,
  Leaf,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { PageHead } from "@/components/PageHead";
import { OwnerSlideshow } from "@/components/OwnerSlideshow";
import { useCatalog } from "@/context/CatalogContext";
import { usePageMeta } from "@/hooks/usePageMeta";

const values = [
  { icon: ShieldCheck, title: "Genuine, always", text: "Every product is sourced from authorised distributors and checked on arrival. No exceptions, ever." },
  { icon: Stethoscope, title: "Advice before selling", text: "Our pharmacist will tell you when you don't need a medicine — and when you need a doctor instead." },
  { icon: HeartHandshake, title: "Neighbourhood first", text: "We know our regulars by name. Home delivery, emergency refills and a chair to sit down while we check your bill." },
  { icon: Leaf, title: "Affordable by design", text: "Fair prices, honest substitutes and help finding the generic option that fits your budget." },
];

const milestones = [
  { step: "01", title: "Walk-in pharmacy", text: "Visit our Main Market store in Adarsh Nagar for medicines, devices and a free blood pressure check." },
  { step: "02", title: "Pharmacist guidance", text: "Every prescription is read carefully, with honest advice on dosage, timing and substitutes." },
  { step: "03", title: "24×7 care", text: "Open round the clock so your family can reach a real chemist even late at night." },
  { step: "04", title: "90-minute delivery", text: "Order on your phone or over WhatsApp and get genuine stock at your doorstep the same day." },
];

export function AboutPage() {
  const { settings } = useCatalog();
  usePageMeta(
    "About us | City Pharmacy, Adarsh Nagar",
    "Meet Akshat Sabharwal and the team behind City Pharmacy — a licensed, family-run neighbourhood pharmacy in Adarsh Nagar, Delhi.",
  );

  return (
    <div className="pb-12">
      <PageHead
        title="A neighbourhood pharmacy, run with care."
        description="City Pharmacy sits in the heart of Main Market, Adarsh Nagar. Same store, same pharmacist, now online."
        breadcrumbs={[{ label: "About us" }]}
      >
        <Link to="/contact" className="btn-primary self-start px-4 py-2 text-[11px]">
          <MapPin size={14} /> Visit the store
        </Link>
      </PageHead>

      <div className="shell mt-6">
        <div className="grid items-stretch gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative overflow-hidden rounded-3xl bg-apollo-950">
            <OwnerSlideshow className="h-full min-h-[540px]" />
          </div>

          <div className="flex flex-col justify-center rounded-3xl border border-line bg-white p-6 sm:p-8">
            <p className="eyebrow">Our story</p>
            <h2 className="mt-1.5 text-[26px] font-extrabold leading-tight text-apollo-950 sm:text-[32px]">
              More than a shop that sells medicines.
            </h2>
            <div className="mt-3 space-y-3 text-[11.5px] leading-relaxed text-muted">
              <p>
                City Pharmacy sits in the middle of Main Market, Adarsh Nagar, a few steps from the metro station. Every
                day, families walk in with prescriptions, questions and, often, a fair bit of worry. Our job is to make
                that visit easier.
              </p>
              <p>
                The store is run by <strong className="text-ink">Akshat Sabharwal</strong>, who believes a pharmacy
                should be judged by the advice it gives, not just the products it stocks. That means reading every
                prescription carefully, explaining the dose in plain language and telling you honestly when a cheaper
                alternative is just as good.
              </p>
              <p>
                Today, the same team serves you online. The website is new; the promise is not. Genuine medicines, fair
                prices and a pharmacist who picks up the phone.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { value: "24×7", label: "Open in Adarsh Nagar" },
                { value: "90 min", label: "Express delivery" },
                { value: "4.8/5", label: "Neighbourhood rating" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-cream p-3 text-center">
                  <p className="text-lg font-extrabold text-apollo-800">{stat.value}</p>
                  <p className="mt-0.5 text-[8.5px] font-medium text-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/enquiry" className="btn-primary px-4 py-2 text-[10.5px]">Ask our pharmacist <ArrowRight size={13} /></Link>
              <a href={`tel:+91${settings.phone}`} className="btn-outline px-4 py-2 text-[10.5px]"><Phone size={13} /> Call the store</a>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-4 text-center">
            <p className="eyebrow">What we stand for</p>
            <h2 className="mt-1 text-2xl font-extrabold text-apollo-950">Four things we won't compromise on</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-line bg-white p-4">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-apollo-50 text-apollo-700"><value.icon size={18} /></span>
                <h3 className="mt-3 text-[12px] font-bold text-apollo-950">{value.title}</h3>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">{value.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-3xl border border-line bg-white">
          <div className="grid lg:grid-cols-2">
            <div className="p-6 sm:p-8">
              <p className="eyebrow">A note from the owner</p>
              <h2 className="mt-1.5 text-2xl font-extrabold text-apollo-950">“Come in. Ask the question.”</h2>
              <div className="mt-3 space-y-3 text-[11.5px] leading-relaxed text-muted">
                <p>
                  A pharmacy is one of the few places people visit on some of their most difficult days. You may be
                  worried about a parent, a child or yourself. You may be holding a prescription you don't fully
                  understand.
                </p>
                <p>
                  My request to every customer is simple: ask. Ask what the medicine does, ask if there is a cheaper
                  option, ask whether you need it at all. A good pharmacist should never be too busy for that
                  conversation.
                </p>
                <p className="font-semibold text-ink">— Akshat Sabharwal, Owner</p>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-apollo-50 p-3 text-[9.5px] text-apollo-800">
                <Users size={14} /> Proudly serving Adarsh Nagar, Azadpur, Model Town, Shalimar Bagh and Ashok Vihar.
              </div>
            </div>
            <div className="bg-cream p-6 sm:p-8">
              <p className="eyebrow">How we serve you</p>
              <div className="mt-4 space-y-4">
                {milestones.map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="flex h-7 w-14 shrink-0 items-center justify-center rounded-full bg-apollo-700 text-[9px] font-bold text-white">{item.step}</span>
                    <div>
                      <p className="text-[11px] font-bold text-ink">{item.title}</p>
                      <p className="mt-0.5 text-[9.5px] leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Store, title: "Main Market store", text: "Walk in for medicines, devices and a free BP check." },
            { icon: Truck, title: "Home delivery", text: "90-minute express delivery across North Delhi." },
            { icon: Clock3, title: "Open 24×7", text: "Emergency medicines at any hour." },
            { icon: Sparkles, title: "Diwali 15% offer", text: "Festive savings on selected items, auto-applied." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-2.5 rounded-2xl border border-line bg-white p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-apollo-50 text-apollo-700"><item.icon size={15} /></span>
              <div>
                <p className="text-[10.5px] font-bold text-ink">{item.title}</p>
                <p className="mt-0.5 text-[9px] leading-relaxed text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-apollo-800 to-apollo-950 px-6 py-7 text-white sm:flex-row sm:px-8">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-apollo-200">Come say hello</p>
            <h2 className="mt-1 text-xl font-extrabold">Main Market, Adarsh Nagar.</h2>
            <p className="mt-1 text-[10.5px] text-white/60">{settings.addressLine1} · Open {settings.hours}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/contact" className="rounded-xl bg-white px-4 py-2.5 text-[10.5px] font-bold text-apollo-900">Store details</Link>
            <a href={`tel:+91${settings.phone}`} className="rounded-xl border border-white/25 px-4 py-2.5 text-[10.5px] font-semibold text-white"><Phone size={12} className="mr-1 inline" /> Call</a>
          </div>
        </section>
      </div>
    </div>
  );
}
