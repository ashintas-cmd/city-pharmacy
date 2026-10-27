# City Pharmacy — Adarsh Nagar, Delhi

An online pharmacy storefront and staff panel for **City Pharmacy**, a family-run chemist in Adarsh Nagar, Delhi. The design follows the clean, trust-first e-commerce language of Apollo Pharmacy: deep teal, warm cream, coral offer accents and generous white space.

- **Live site:** https://city-pharmacy-ccfc3.web.app
- **Owner:** Akshat Sabharwal
- **Phone:** +91 98710 40480
- **Address:** Adarsh Nagar, Delhi 110033
- **Hours:** Open 24 × 7
- **Firebase project:** `city-pharmacy-ccfc3`
- **Firestore database:** `default` (Asia South / Mumbai)

> **Important:** this project's Firestore database is literally named `default`, not the SDK's conventional `(default)`. The client and seed script therefore call the database id explicitly:
> `initializeFirestore(app, settings, "default")` and `getFirestore(app, "default")`.

---

## What is included

### Storefront
- Home page with a live Diwali 15% campaign, category circles, bestsellers, health concerns, store details and FAQ.
- **Owner slideshow** with the three photographs of Akshat Sabharwal, auto-advancing every ~5 seconds on Home and About.
- Shop with category, concern, brand, price, in-stock, prescription-free and Diwali-only filters, plus sorting.
- Product pages with MRP/selling price, automatic Diwali pricing, stock status, pincode delivery check, highlights, delivery/returns information and related products.
- Cart with free-delivery progress, Diwali savings and recommend products.
- Checkout with delivery slots, saved addresses, COD / UPI-at-doorstep and a live order summary.
- Order confirmation, live status timeline, reorder and self-service cancellation while the order is still `PLACED`.
- **Google Sign-In** and email/password authentication (Firebase Authentication).
- Account page with profile, phone number, multiple saved addresses and recent orders.
- Patient enquiry form that collects name, mobile, email, age, area, concern type, preferred callback time and consent — stored in Firestore and visible to staff.
- Prescription upload request with an optional compressed photo/PDF, stored in an admin-only Firestore collection.
- Contact page with a custom store map, owner details and contact form.
- About page with the owner story and photography slideshow.
- Privacy, terms, shipping and returns pages.

### Staff admin panel (`/admin`)
- Google or email/password sign-in, with access limited to documents in the Firestore `admins` collection.
- Overview: revenue, orders, patients, new enquiries, 7-day chart, low stock, campaign status.
- Orders: search, status counters, status updates with internal notes, CSV export, customer call/WhatsApp links.
- Products: full CRUD, price/stock edits, publish/hide, prescription flag, Diwali eligibility, generated pack art settings.
- Diwali offer: edit discount %, title, dates, terms; preview the storefront card; enable/disable eligible products.
- Patient enquiries: read prescription attachments, update status, internal notes, call/WhatsApp, CSV export.
- Contact messages and newsletter signups.
- Team access: add/remove admin emails (with self-protection).
- Store settings: address, contact, delivery fee, free-delivery threshold, licence and catalogue restore.

### Backend
- **Firebase Authentication**: Google provider + email/password (already enabled on the project).
- **Cloud Firestore**: products, categories, offer, settings, orders, users, enquiries, prescription files, messages and admins.
- **Firestore Security Rules**: public catalogue reads; signed-in customers can create/read/cancel only their own orders; admin-only access to orders, enquiries, prescription files, messages and catalogue writes.
- **Firebase Hosting**: SPA deployment with long-lived asset caching and safe response headers.
- No Cloud Functions are required, so the project works on the **Spark (free) plan**.

---

## Tech stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3
- React Router 6
- Firebase JS SDK 11 (`firebase/app`, `firebase/auth`, `firebase/firestore`)
- Lucide icons
- Playwright for browser smoke tests
- Firebase Admin SDK for the optional seed script

---

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173.

The Firebase web configuration is in `.env` (web config is public by design). To use another Firebase project, copy `.env.example`, fill in the values and restart Vite.

Useful commands:

```bash
npm run typecheck     # TypeScript checks
npm run build         # production build into dist/
npm run preview       # preview the production build
npm run test:e2e      # Playwright tests (desktop + mobile)
npm run seed          # optional: seed Firestore with a service account
npm run deploy        # build + deploy hosting, rules, indexes, auth providers
```

If Playwright browsers are not installed:

```bash
npx playwright install chromium
```

---

## Firestore setup

The live project is already configured:

| Item | Value |
| --- | --- |
| Project | `city-pharmacy-ccfc3` |
| Firestore database | `default` (Native, `asia-south1`) |
| Hosting | `city-pharmacy-ccfc3.web.app` |
| Auth providers | Google, Email/Password |
| Authorized domains | `localhost`, `city-pharmacy-ccfc3.firebaseapp.com`, `city-pharmacy-ccfc3.web.app` |

To recreate this on another project:

```bash
firebase login
firebase use --add
firebase firestore:databases:create default --location=asia-south1
firebase deploy --only firestore:rules,firestore:indexes
```

Make sure `firebase.json` keeps:

```json
"firestore": {
  "database": "default",
  "rules": "firestore.rules",
  "indexes": "firestore.indexes.json"
}
```

Then update `src/lib/firebase.ts`'s database id if the new database uses a different name, and update `.env`.

### Authentication

The Firebase CLI can deploy the provider configuration in `firebase.json`:

```bash
firebase deploy --only auth
```

Add every domain that serves the site under **Authentication → Settings → Authorized domains**. `localhost`, the `firebaseapp.com` domain and the `web.app` domain are already authorized.

### Seeding the catalogue

**Easiest:** sign in to the admin panel → **Store settings** → **Restore demo catalogue**. This writes 56 products, 8 categories, the Diwali offer and store settings without needing a service account.

**From the CLI:** create a service-account key (Firebase Console → Project settings → Service accounts) and run:

```bash
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\service-account.json"   # PowerShell
npm run seed
```

The seed script upserts documents, so it is safe to run more than once. It seeds the admin email in `SEED_ADMIN_EMAILS` (default `ash.intas@gmail.com`).

### Deploying

```bash
npm run deploy
# or step by step
npm run build
firebase deploy --only hosting,firestore:rules,firestore:indexes,auth
```

---

## Admin access

Admins are documents in the `admins` collection keyed by lower-case email:

```
admins/ash.intas@gmail.com   { email, name, addedAt }
```

- Signed-in users may check their own admin document (that is how the UI decides to show the panel).
- Only existing admins can create or remove admin documents.
- **Add the owner's Google account** under **Admin → Team access** once he has signed in, or create the document in the Firebase Console.
- Remove the seeded development account before going live if it is not a real staff address.

If an account is signed in but not an admin, the panel shows a clear “Admin access required” screen.

---

## Diwali 15% offer

The offer lives in Firestore at `offers/diwali-15`:

```json
{
  "title": "Diwali Dhamaka",
  "percent": 15,
  "active": true,
  "startDate": "2026-10-20T00:00:00+05:30",
  "endDate": "2026-11-15T23:59:59+05:30",
  "badge": "DIWALI 15% OFF"
}
```

A product receives the discount when **all** of these are true:

1. The offer is `active`.
2. Today is between `startDate` and `endDate`.
3. The product's `offerEligible` flag is `true`.

Pricing is calculated on the **current selling price**, not MRP:

```
Diwali price = round(selling price × (100 − 15) / 100)
```

The storefront shows a Diwali badge, the discounted price, a separate “Diwali discount” line at checkout and a combined savings total. No coupon code is required. The staff panel lets you pause the offer, change the percentage/dates and choose eligible products.

---

## Firestore data model

| Collection | Key | Purpose | Access |
| --- | --- | --- | --- |
| `products` | product id | Catalogue, price, stock, art direction, offer flag | Public read, admin write |
| `categories` | category id | Category metadata, icon and tone | Public read, admin write |
| `offers` | `diwali-15` | Campaign title, %, dates, terms | Public read, admin write |
| `settings` | `store` | Store name, owner, address, phone, delivery rules | Public read, admin write |
| `users` | Firebase UID | Name, phone, saved addresses | Owner/admin |
| `orders` | order number | Item snapshot, totals, customer, address, status, timeline | Owner/admin |
| `enquiries` | auto id | Patient contact details, concern type, message, consent, optional prescription id | Public create, admin read/update |
| `prescriptionFiles` | auto id | Compressed data URL of a prescription photo/PDF | Public create, admin read |
| `messages` | auto id | Contact form and newsletter messages | Public create, admin read/update |
| `admins` | lower-case email | Admin allow-list | Self-check, admin list/write |

### Order shape (important fields)

```ts
{
  orderNumber: "CP-261027-6012",
  userId: "<firebase uid>",
  items: [{ productId, name, unitPrice, qty, offerApplied, lineTotal, ... }],
  customer: { name, phone, email },
  address: { name, phone, line1, city, state, pincode, ... },
  paymentMethod: "COD" | "UPI_ON_DELIVERY",
  mrpTotal, subtotal, offerDiscount, deliveryFee, total,
  status: "PLACED" | "PACKED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED",
  timeline: [{ status, at, note }],
  createdAt, updatedAt
}
```

Customers can only cancel an order while it is `PLACED`; staff can move it through the delivery flow.

---

## Security notes

- Firestore rules deny by default. Catalogue and `settings/store` are the only public reads.
- Orders are only readable by the customer who owns them or an admin.
- Enquiries and contact messages are open for public **create** (guests must be able to ask a question without signing in) but only staff can read them. Add App Check or rate limiting if spam becomes an issue.
- Prescription files are limited to ~900 KB and are readable only by admins.
- The Diwali discount is applied by the client and the resulting order totals are written by the client. The rules validate the shape and ownership of an order. For high-value commerce, add a Cloud Function (Blaze plan) to re-price the cart and verify stock server-side.
- Never share an admin password. Add/remove staff from **Team access** and review the list regularly.
- Online card payments are intentionally not enabled; the site offers COD and UPI at the doorstep.

---

## Project structure

```
.
├─ public/
│  ├─ owner-1.jpg / owner-2.jpg / owner-3.jpg   # Owner slideshow
│  └─ favicon.svg
├─ scripts/
│  ├─ seed-firestore.ts                          # Optional Admin SDK seed
│  └─ qa-*.mjs                                   # Local QA helpers (remove/ignore for production)
├─ src/
│  ├─ components/            # Header, footer, product cards, pack art, owner slideshow, map…
│  ├─ context/               # Auth, catalogue cache, cart, toasts
│  ├─ data/seed.ts           # 56-product demo catalogue + store/offer settings
│  ├─ hooks/usePageMeta.ts
│  ├─ lib/                   # Firebase, Firestore queries, pricing, image compression, utils
│  ├─ pages/                 # Storefront pages
│  ├─ pages/admin/           # Admin panel pages
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ tests/storefront.spec.ts  # Playwright smoke tests
├─ firebase.json
├─ firestore.rules
├─ firestore.indexes.json
└─ firebase.json auth block
```

---

## Design notes

- Primary teal: `#156F6C` / `#165D59`
- Deep teal: `#0E3A38` / `#082624`
- Coral offer accent: `#FF748E` / `#F04E6E`
- Cream page background: `#FAFBF9`
- Font: Inter
- Packaging artwork is generated as SVG per product (type + hue), so new products get a consistent packshot without uploading images.

The owner photographs are the supplied portraits of **Akshat Sabharwal**, cropped for a direct-facing headshot and presented in a captioned slideshow.

---

## Testing

```bash
npm run dev        # in one terminal
npm run test:e2e   # in another (or let Playwright start the dev server)
```

The smoke suite checks the home/offer/product journey, shop and cart, patient enquiry/prescription forms and the admin sign-in gate on desktop and mobile Chrome.

Manual checks performed during development:

- Google popup opens the Firebase auth handler.
- Email/password sign-in works on localhost and on the live `.web.app` domain.
- Add to cart → checkout → order confirmation → admin status update.
- Admin order status updates and customer cancellation.
- Patient enquiry and prescription upload (with image) → admin inbox → prescription preview.
- Contact form → admin messages.
- Add/edit/delete product through the admin UI.
- Owner slideshow advances through all three photographs.

---

## Support

City Pharmacy  
Shop No. 12, Main Market, Adarsh Nagar, Delhi 110033  
+91 98710 40480 · care@citypharmacy.in  
Owner: Akshat Sabharwal
