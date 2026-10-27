# Requirements → implementation

This file maps the requested scope to what is in the repository and live site.

| Requirement | Status | Where |
| --- | --- | --- |
| Website named **City Pharmacy**, Adarsh Nagar, Delhi | Done | Header, footer, settings, SEO/JSON-LD |
| Owner **Akshat Sabharwal** with photo | Done | Home store section, About, Contact, footer; 3-photo slideshow |
| Contact number **9871040480** | Done | Header, footer, contact, policies, WhatsApp links |
| Frontend + backend | Done | React/Vite storefront + Firebase Auth/Firestore backend |
| Follow Wellness Forever layout, then Apollo Pharmacy colours | Done | Commerce layout with Apollo teal/cream/coral palette, category rails, product cards, offers |
| Separate **15% Diwali offer on selected items** | Done | `offers/diwali-15`, automatic pricing, badges, offer page, cart/checkout savings, admin campaign control |
| Host on Firebase, store everything in Firestore | Done | Live at `city-pharmacy-ccfc3.web.app`; database `default` |
| Use OpenCode CLI & skills | Done | Built and deployed through the OpenCode session and CLI |
| Playwright / browser verification | Done | Playwright smoke tests + local QA flows |
| Google Sign-In for customers | Done | Firebase Auth Google provider enabled; `AuthPanel` / `signInWithPopup`; verified popup |
| Patient enquiry form with contact details | Done | `/enquiry` — name, mobile, email, age, area, type, message, callback time, consent → `enquiries` |
| Admin panel for enquiries | Done | `/admin/enquiries` — status, notes, call/WhatsApp, CSV, prescription image preview |
| Admin panel for orders, products, offer, messages, team, settings | Done | `/admin/orders`, `/admin/products`, `/admin/offer`, `/admin/messages`, `/admin/admins`, `/admin/settings` |
| Owner photos shown one-by-one as a slideshow | Done | `OwnerSlideshow` on Home + About, three supplied photos, auto-advance/dots/arrows/pause |
| Firestore security | Done | `firestore.rules`, deny-by-default, owner/admin scoping |
| Deployment documentation | Done | `README.md` |

## Store facts used

- **Name:** City Pharmacy
- **Owner:** Akshat Sabharwal
- **Phone:** 9871040480 (+91 98710 40480)
- **WhatsApp:** 919871040480
- **Email:** care@citypharmacy.in
- **Address:** Adarsh Nagar, Delhi 110033
- **Hours:** Open 24 × 7
- **Delivery:** 90-minute express; free above ₹499; ₹49 below
- **Licence:** DL-PH-2026-011033 (display/demo value; replace with the real licence in Admin → Store settings)

## Deliberate scope choices

- The project runs on Firebase **Spark** (no billing), so there are no Cloud Functions. Firestore Security Rules enforce ownership and data shape, and the admin panel writes through Firebase Auth/Firestore. For very high-value commerce, a Cloud Function can be added to re-price orders server-side.
- Payments are cash on delivery and UPI at the doorstep. No payment gateway is connected.
- Prescription photos are compressed client-side and stored as an admin-only Firestore document, avoiding the need for paid Cloud Storage while keeping the file private.
- Google sign-in is enabled for the Firebase project; the site also supports email/password for staff and customers who prefer it.
