import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, ShieldCheck } from "lucide-react";
import { PageHead } from "@/components/PageHead";
import { useCatalog } from "@/context/CatalogContext";
import { usePageMeta } from "@/hooks/usePageMeta";

type PolicyKind = "privacy" | "terms" | "shipping" | "returns";

type Section = { heading: string; body?: string[]; bullets?: string[] };

const content: Record<PolicyKind, { title: string; intro: string; sections: Section[] }> = {
  privacy: {
    title: "Privacy policy",
    intro:
      "City Pharmacy respects your privacy. This policy explains what we collect when you use citypharmacy.in, why we collect it, and the choices you have.",
    sections: [
      {
        heading: "Who we are",
        body: [
          "City Pharmacy is a licensed retail pharmacy located at Main Market, Adarsh Nagar, Delhi 110033, owned by Akshat Sabharwal. For privacy questions, write to care@citypharmacy.in or call +91 98710 40480.",
        ],
      },
      {
        heading: "Information we collect",
        bullets: [
          "Account details: your name, email address and profile photo from Google Sign-In, or your email address if you sign up with a password.",
          "Contact and delivery details: phone number, delivery address, pincode and order notes.",
          "Order details: products purchased, quantities, prices, delivery slot and order status.",
          "Prescription and enquiry details: the information you submit through the prescription upload or patient enquiry forms, including an optional prescription image.",
          "Technical information: basic browser and device information collected by Firebase for security and reliability.",
        ],
      },
      {
        heading: "How we use your information",
        bullets: [
          "To create and secure your account, and to let you sign in with Google.",
          "To process, pack, deliver and support your orders.",
          "To verify prescriptions and contact you about prescription medicines, as required for safe dispensing.",
          "To respond to patient enquiries and contact messages.",
          "To prevent fraud, abuse and unauthorised access, and to comply with pharmacy and tax laws.",
          "To send order updates. Marketing messages are sent only if you ask for them, and you can opt out at any time.",
        ],
      },
      {
        heading: "Where your data is stored",
        body: [
          "Account, order, enquiry and prescription data is stored in Google Cloud Firestore under the Firebase project city-pharmacy-ccfc3. Authentication is provided by Firebase Authentication. Google processes this data on our behalf under its data processing terms. Access is restricted by Firestore security rules to you (for your own orders and profile) and to City Pharmacy administrators.",
          "Prescription images are stored in a separate, admin-only collection and are never publicly accessible.",
        ],
      },
      {
        heading: "What we never do",
        bullets: [
          "We do not sell your personal data.",
          "We do not share your prescription or health information with advertisers.",
          "We do not ask for passwords, OTPs or card details over the phone.",
        ],
      },
      {
        heading: "Retention",
        body: [
          "We keep order and prescription records for as long as required by applicable pharmacy, tax and accounting rules. Account and enquiry data is kept only as long as needed to provide the service or resolve a dispute. You can ask us to delete your account data, subject to our legal record-keeping obligations.",
        ],
      },
      {
        heading: "Your choices and rights",
        bullets: [
          "You can view and update your name, phone and saved addresses in your account.",
          "You can ask us for a copy of the personal data we hold about you.",
          "You can ask us to correct or delete your data where the law allows.",
          "You can withdraw consent for marketing messages at any time.",
          "To exercise any of these rights, email care@citypharmacy.in.",
        ],
      },
      {
        heading: "Cookies and local storage",
        body: [
          "We use your browser's local storage to remember your cart, your last loaded catalogue and your session. We do not use advertising cookies. You can clear this data at any time from your browser settings.",
        ],
      },
      {
        heading: "Children",
        body: [
          "The website is not intended for children under 18 to use independently. Prescription and enquiry details for a child should be submitted by a parent or guardian.",
        ],
      },
      {
        heading: "Changes to this policy",
        body: [
          "We may update this policy when our services or the law change. The latest version will always be published on this page with the date it was updated.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of use",
    intro:
      "These terms govern your use of the City Pharmacy website and the orders you place through it. By using the site, you agree to these terms.",
    sections: [
      {
        heading: "About City Pharmacy",
        body: [
          "City Pharmacy is a licensed retail pharmacy in Adarsh Nagar, Delhi, owned by Akshat Sabharwal. The website is an online storefront for the same physical store. Medicines are dispensed under the supervision of a licensed pharmacist.",
        ],
      },
      {
        heading: "Your account",
        bullets: [
          "You must provide accurate contact information and keep your account secure.",
          "You are responsible for activity carried out through your account.",
          "You may sign in with Google or with an email and password. Do not share your password with anyone.",
        ],
      },
      {
        heading: "Prescription medicines",
        bullets: [
          "Prescription (Rx) medicines are dispensed only against a valid prescription from a registered medical practitioner.",
          "We may call you to verify the prescription and may decline to dispense a medicine if the prescription is unclear, expired or appears altered.",
          "You must not upload a prescription that does not belong to you or the patient named on it.",
          "Some medicines may be unavailable, restricted or subject to substitution. We will inform you before dispatch.",
        ],
      },
      {
        heading: "Product information and pricing",
        bullets: [
          "We try to display accurate product descriptions, pack sizes, prices and availability, but errors can occur.",
          "Prices are in Indian rupees and include applicable taxes unless stated otherwise.",
          "MRP is set by the manufacturer. Our selling price may differ from MRP.",
          "If a product is mispriced, we may cancel the order and refund any amount paid.",
          "Pack images are illustrations and may not match the exact pack received.",
        ],
      },
      {
        heading: "Offers and the Diwali 15% discount",
        bullets: [
          "The Diwali Dhamaka offer gives a flat 15% discount on selected products marked with the Diwali badge.",
          "The discount is calculated on the current selling price, not on MRP.",
          "The offer is valid from 20 October 2026 to 15 November 2026 and is applied automatically at checkout.",
          "The offer cannot be combined with other coupons or bulk-order discounts.",
          "We may withdraw or change an offer at any time, but confirmed orders will be honoured at the price you paid.",
        ],
      },
      {
        heading: "Orders and acceptance",
        body: [
          "Your order is an offer to buy. It is accepted when we confirm it on the website or by phone. We may refuse or cancel an order for reasons including stock unavailability, pricing errors, suspected fraud, an invalid prescription or delivery restrictions. If we cancel a prepaid order, you will receive a full refund.",
        ],
      },
      {
        heading: "Payment",
        body: [
          "We currently accept cash on delivery and UPI at the doorstep. Online card payments are not yet enabled. Never share an OTP, UPI PIN or card details with a delivery partner or anyone claiming to be from City Pharmacy.",
        ],
      },
      {
        heading: "Delivery, cancellation and returns",
        body: [
          "Delivery timelines are estimates. Our Shipping policy and Returns policy form part of these terms. You may cancel an order before packing. Prescription items and opened products cannot be returned for safety reasons.",
        ],
      },
      {
        heading: "Acceptable use",
        bullets: [
          "Do not use the website for unlawful purposes or to submit false prescriptions or enquiries.",
          "Do not attempt to access another customer's account, orders or prescription files.",
          "Do not scrape, copy or misuse our content or interfere with the security of the website.",
        ],
      },
      {
        heading: "Medical disclaimer",
        body: [
          "Content on this website is for general information and is not a substitute for professional medical advice, diagnosis or treatment. Always consult a qualified doctor about a medical condition. For emergencies, call 112 or visit the nearest hospital.",
        ],
      },
      {
        heading: "Liability and governing law",
        body: [
          "To the extent permitted by law, City Pharmacy is not liable for indirect losses arising from use of the website. Nothing in these terms limits liability that cannot be excluded under Indian law. These terms are governed by the laws of India, with courts in Delhi having jurisdiction.",
        ],
      },
    ],
  },
  shipping: {
    title: "Shipping policy",
    intro:
      "We deliver genuine medicines and health essentials from our Adarsh Nagar store, usually within 90 minutes.",
    sections: [
      {
        heading: "Delivery areas",
        body: [
          "We currently deliver across Adarsh Nagar, Azadpur, Model Town, Shalimar Bagh, Ashok Vihar and nearby parts of North Delhi. Enter your pincode on a product page to check availability. If you are just outside our zone, call the store — we may be able to arrange a courier.",
        ],
      },
      {
        heading: "Delivery charges",
        bullets: [
          "Free delivery on orders of ₹499 or more.",
          "A flat ₹49 delivery fee applies to orders below ₹499.",
          "There is no extra charge for cash on delivery or UPI at the doorstep.",
          "Store pickup is always free.",
        ],
      },
      {
        heading: "Delivery timelines",
        bullets: [
          "Express: within 90 minutes for orders placed during store hours and subject to stock.",
          "Evening slot: 6:00 PM – 9:00 PM.",
          "Morning slot: 9:00 AM – 12:00 PM.",
          "Prescription orders may take longer while our pharmacist verifies the prescription.",
        ],
      },
      {
        heading: "Cold-chain and fragile items",
        body: [
          "Insulin, vaccines, certain creams and other temperature-sensitive products are packed with gel packs and insulated pouches. Please refrigerate them immediately on receipt. Health devices are packed with protective padding.",
        ],
      },
      {
        heading: "Order tracking",
        body: [
          "Sign in and open My Orders to see the live status of your order. We also call or message you before delivery. If you are not available, our delivery partner will try to reschedule once.",
        ],
      },
      {
        heading: "Pickup",
        body: [
          "Choose store pickup at checkout or call us. Most orders are ready in 20 minutes. Bring your order number and, for prescription medicines, the original prescription.",
        ],
      },
      {
        heading: "Failed deliveries and delays",
        body: [
          "If we cannot reach you or deliver after two attempts, the order may be returned to the store. For prepaid orders, a refund will be processed after deducting any delivery cost. Weather, traffic, festivals and unexpected demand can occasionally delay delivery; we will keep you informed.",
        ],
      },
    ],
  },
  returns: {
    title: "Returns & refunds",
    intro:
      "If something is wrong with your order, tell us. We will make it right wherever the law and safety rules allow.",
    sections: [
      {
        heading: "Return window",
        body: [
          "Unopened, non-prescription products can be returned within 7 days of delivery with the original bill and packaging. Contact us before sending anything back.",
        ],
      },
      {
        heading: "What can be returned",
        bullets: [
          "Wrong product delivered.",
          "Damaged or leaking packaging.",
          "Expired product.",
          "Unopened personal-care or wellness products in resalable condition.",
          "Devices with a manufacturing defect (subject to the brand's warranty process).",
        ],
      },
      {
        heading: "What cannot be returned",
        bullets: [
          "Opened medicines, syrups, creams or supplements.",
          "Prescription medicines, for safety and regulatory reasons.",
          "Cold-chain products such as insulin.",
          "Products without their original packaging or bill.",
          "Items marked non-returnable on the product page.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          "Call +91 98710 40480 or email care@citypharmacy.in within 7 days. Share your order number, the product name and a photo of the issue. Our team will confirm whether the item qualifies and arrange a pickup or store drop-off.",
        ],
      },
      {
        heading: "Refunds",
        bullets: [
          "Cash-on-delivery orders are refunded by UPI or bank transfer within 3–5 working days of approval.",
          "Prepaid orders are refunded to the original payment method.",
          "Device warranty claims are handled by the manufacturer's service centre.",
          "Delivery charges are refunded only when the return is due to our error.",
        ],
      },
      {
        heading: "Exchanges",
        body: [
          "Where stock allows, we are happy to exchange a wrong or damaged item instead of refunding it. Exchanges are subject to the same eligibility rules as returns.",
        ],
      },
    ],
  },
};

export function PoliciesPage({ kind }: { kind: PolicyKind }) {
  const { settings } = useCatalog();
  const data = content[kind];

  usePageMeta(`${data.title} | City Pharmacy`, data.intro);

  return (
    <div className="pb-12">
      <PageHead title={data.title} description={data.intro} breadcrumbs={[{ label: data.title }]}>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-apollo-50 px-3 py-1.5 text-[10px] font-bold text-apollo-700">
          <ShieldCheck size={12} /> Last updated 27 Oct 2026
        </span>
      </PageHead>

      <div className="shell mt-5 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-[152px] rounded-2xl border border-line bg-white p-4">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-muted">On this page</p>
            <nav className="space-y-1">
              {data.sections.map((section, index) => (
                <a
                  key={section.heading}
                  href={`#section-${index}`}
                  className="block rounded-lg px-2 py-1.5 text-[10.5px] text-ink/65 transition hover:bg-cream hover:text-apollo-800"
                >
                  {section.heading}
                </a>
              ))}
            </nav>
            <div className="mt-3 border-t border-line pt-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Other policies</p>
              <div className="mt-1.5 space-y-1 text-[10px]">
                {[
                  { label: "Privacy policy", to: "/privacy" },
                  { label: "Terms of use", to: "/terms" },
                  { label: "Shipping policy", to: "/shipping" },
                  { label: "Returns & refunds", to: "/returns" },
                ].map((link) => (
                  <Link key={link.to} to={link.to} className="block text-apollo-700 hover:underline">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-3">
          <div className="card p-5 sm:p-7">
            {data.sections.map((section, index) => (
              <section key={section.heading} id={`section-${index}`} className="scroll-mt-36 border-b border-line py-5 first:pt-0 last:border-0 last:pb-0">
                <h2 className="text-base font-bold text-apollo-950">
                  <span className="mr-1.5 text-apollo-400">{String(index + 1).padStart(2, "0")}.</span>
                  {section.heading}
                </h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph} className="mt-2 text-[11.5px] leading-relaxed text-muted">{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul className="mt-2.5 space-y-1.5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-[11.5px] leading-relaxed text-muted">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-apollo-500" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Questions about this policy?</p>
            <div className="mt-2 flex flex-wrap gap-3 text-[10.5px]">
              <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 font-semibold text-apollo-700 hover:underline"><Mail size={13} /> {settings.email}</a>
              <a href={`tel:+91${settings.phone}`} className="flex items-center gap-1.5 font-semibold text-apollo-700 hover:underline"><Phone size={13} /> +91 {settings.phone.slice(0, 5)} {settings.phone.slice(5)}</a>
              <Link to="/contact" className="flex items-center gap-1.5 font-semibold text-apollo-700 hover:underline">Contact form <ArrowRight size={12} /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
