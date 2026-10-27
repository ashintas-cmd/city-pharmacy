import type { ArtType, Category, Offer, Product, StoreSettings } from "@/types";

export const seedSettings: StoreSettings = {
  name: "City Pharmacy",
  tagline: "Your neighbourhood pharmacy, now online.",
  owner: "Akshat Sabharwal",
  phone: "9871040480",
  whatsapp: "919871040480",
  email: "care@citypharmacy.in",
  addressLine1: "Adarsh Nagar",
  addressLine2: "Delhi",
  city: "Delhi",
  state: "Delhi",
  pincode: "110033",
  hours: "Open 24 × 7",
  licence: "xxxxxxxxxx",
  deliveryFee: 49,
  freeDeliveryAbove: 499,
  deliveryEta: "90 minutes",
  mapQuery: "Adarsh Nagar, Delhi 110033",
  supportEmail: "care@citypharmacy.in",
};

export const seedOffer: Offer = {
  id: "diwali-15",
  slug: "diwali-15",
  title: "Diwali Dhamaka",
  eyebrow: "Festival of health savings",
  subtitle: "Flat 15% OFF on selected medicines, wellness & personal care essentials.",
  percent: 15,
  active: true,
  startDate: "2026-10-20T00:00:00+05:30",
  endDate: "2026-11-15T23:59:59+05:30",
  badge: "DIWALI 15% OFF",
  terms: [
    "Offer is valid from 20 Oct 2026 to 15 Nov 2026, both days inclusive.",
    "Discount is auto-applied on products marked with the Diwali 15% badge.",
    "The 15% discount is calculated on the current selling price, not on MRP.",
    "Offer cannot be clubbed with any other coupon or bulk-order discount.",
    "City Pharmacy reserves the right to withdraw the offer without prior notice.",
  ],
};

export const seedCategories: Category[] = [
  {
    id: "medicines",
    name: "Medicines",
    slug: "medicines",
    description: "Genuine prescription & OTC medicines from authorised distributors.",
    icon: "pill",
    tone: "mint",
    order: 1,
  },
  {
    id: "wellness",
    name: "Wellness & Nutrition",
    slug: "wellness",
    description: "Vitamins, supplements and everyday nutrition for the whole family.",
    icon: "heart-pulse",
    tone: "peach",
    order: 2,
  },
  {
    id: "personal-care",
    name: "Personal Care",
    slug: "personal-care",
    description: "Skin, hair, oral and body care chosen by our pharmacists.",
    icon: "sparkles",
    tone: "blush",
    order: 3,
  },
  {
    id: "baby-mom",
    name: "Baby & Mom",
    slug: "baby-mom",
    description: "Gentle baby essentials and mother-care picks you can trust.",
    icon: "baby",
    tone: "sky",
    order: 4,
  },
  {
    id: "devices",
    name: "Health Devices",
    slug: "devices",
    description: "Accurate monitoring devices for home, with in-store demos.",
    icon: "activity",
    tone: "lilac",
    order: 5,
  },
  {
    id: "ayurveda",
    name: "Ayurveda",
    slug: "ayurveda",
    description: "Time-tested herbal formulations for everyday wellbeing.",
    icon: "leaf",
    tone: "lime",
    order: 6,
  },
  {
    id: "homeopathy",
    name: "Homeopathy",
    slug: "homeopathy",
    description: "Classical homeopathic remedies, stored with care.",
    icon: "flower",
    tone: "aqua",
    order: 7,
  },
  {
    id: "food-drinks",
    name: "Food & Drinks",
    slug: "food-drinks",
    description: "Healthy pantry staples, dry fruits, teas and breakfast picks.",
    icon: "coffee",
    tone: "sand",
    order: 8,
  },
];

const defaultHighlights: Record<string, string[]> = {
  medicines: [
    "Genuine, batch-verified stock",
    "Stored in temperature-controlled shelves",
    "Free pharmacist guidance on call",
  ],
  wellness: [
    "Lab-tested ingredients",
    "No added artificial colours",
    "Sealed, tamper-proof pack",
  ],
  "personal-care": [
    "Dermatologist-friendly formulation",
    "Cruelty-free and paraben-free",
    "Suitable for daily use",
  ],
  "baby-mom": [
    "Paediatrician-recommended range",
    "Hypoallergenic and gentle",
    "Free from harsh chemicals",
  ],
  devices: [
    "1-year brand warranty",
    "Clinically validated accuracy",
    "Free demo at our Adarsh Nagar store",
  ],
  ayurveda: [
    "AYUSH-licensed formulation",
    "100% herbal actives",
    "No added preservatives",
  ],
  homeopathy: [
    "Classical homeopathic dilution",
    "Sealed glass vial",
    "Store in a cool, dry place",
  ],
  "food-drinks": [
    "Premium hand-picked quality",
    "No artificial flavours",
    "Resealable freshness pack",
  ],
};

type Extra = Partial<
  Pick<Product, "rx" | "stock" | "rating" | "reviews" | "description" | "highlights" | "tags" | "offerEligible" | "active">
>;

function product(
  id: string,
  name: string,
  brand: string,
  categoryId: string,
  packSize: string,
  mrp: number,
  price: number,
  artType: ArtType,
  hue: number,
  extra: Extra = {},
): Product {
  const hash = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    id,
    slug: id,
    name,
    brand,
    categoryId,
    packSize,
    mrp,
    price,
    rx: false,
    stock: 8 + (hash % 58),
    rating: Number((4.2 + ((hash % 7) * 0.1)).toFixed(1)),
    reviews: 40 + ((hash * 37) % 1900),
    description: `${name} from ${brand} is a trusted pick from our ${categoryId.replace("-", " ")} range. Sourced only from authorised distributors and checked by our pharmacists before it reaches you.`,
    highlights: defaultHighlights[categoryId] ?? defaultHighlights.medicines,
    tags: [],
    art: { type: artType, hue },
    offerEligible: false,
    active: true,
    ...extra,
  };
}

export const seedProducts: Product[] = [
  product("paracetamol-650mg-tablets", "Paracetamol 650mg Tablets", "MediCure", "medicines", "15 tablets", 45, 38, "strip", 168, {
    rating: 4.8,
    reviews: 1840,
    tags: ["pain", "fever"],
    description:
      "Fast-acting paracetamol tablets for relief from fever, headache, body ache and mild pain. Gentle on the stomach when taken after food.",
    highlights: ["Relieves fever and body ache", "Non-drowsy formula", "Take as directed by your doctor"],
  }),
  product("cetirizine-10mg-tablets", "Cetirizine 10mg Tablets", "AllerCare", "medicines", "10 tablets", 35, 29, "strip", 205, {
    rating: 4.7,
    reviews: 920,
    tags: ["cold", "allergy"],
    description:
      "Anti-allergy tablets that help manage sneezing, runny nose, itching and watery eyes caused by seasonal allergies.",
    highlights: ["24-hour allergy relief", "Helps with sneezing & runny nose", "May cause mild drowsiness"],
  }),
  product("pantoprazole-40mg-tablets", "Pantoprazole 40mg Tablets", "GastroCare", "medicines", "15 tablets", 120, 96, "strip", 212, {
    rx: true,
    tags: ["digestion", "acidity"],
    description:
      "Proton-pump inhibitor tablets used to manage acidity, heartburn and reflux. Prescription required.",
    highlights: ["Reduces stomach acid production", "Take 30 minutes before breakfast", "Prescription required"],
  }),
  product("azithromycin-500mg-tablets", "Azithromycin 500mg Tablets", "ZithroCare", "medicines", "5 tablets", 210, 168, "strip", 190, {
    rx: true,
    stock: 22,
    tags: ["infection"],
    description:
      "Broad-spectrum antibiotic tablets prescribed for susceptible bacterial infections. Complete the full course as advised.",
    highlights: ["Prescription required", "Complete the full prescribed course", "Store below 30°C"],
  }),
  product("metformin-500mg-tablets", "Metformin 500mg Tablets", "GlucoCare", "medicines", "20 tablets", 95, 76, "strip", 152, {
    rx: true,
    tags: ["diabetes"],
    description:
      "First-line medication for type 2 diabetes that helps control blood sugar levels alongside diet and exercise.",
    highlights: ["Supports healthy blood sugar", "Take with or after meals", "Prescription required"],
  }),
  product("amoxicillin-500mg-capsules", "Amoxicillin 500mg Capsules", "MoxiCare", "medicines", "10 capsules", 180, 144, "strip", 222, {
    rx: true,
    stock: 18,
    tags: ["infection"],
    description:
      "Penicillin-group antibiotic capsules prescribed for a range of bacterial infections. Always complete the course.",
    highlights: ["Prescription required", "Do not skip doses", "Report any rash to your doctor"],
  }),
  product("ibuprofen-paracetamol-tablets", "Ibuprofen + Paracetamol Tablets", "PainEase", "medicines", "10 tablets", 65, 52, "strip", 12, {
    rating: 4.5,
    reviews: 640,
    tags: ["pain", "fever"],
    description:
      "Combination pain-relief tablets for headache, muscular pain, toothache and fever. Take after food.",
    highlights: ["Dual-action pain relief", "Helps with inflammation", "Take after food"],
  }),
  product("ors-powder-orange", "ORS Powder Orange", "HydraLife", "medicines", "21.8g sachet", 25, 20, "sachet", 32, {
    rating: 4.9,
    reviews: 2310,
    tags: ["digestion", "hydration"],
    offerEligible: true,
    description:
      "WHO-formula oral rehydration salts with a refreshing orange flavour. Replenishes fluids and electrolytes during dehydration.",
    highlights: ["WHO-recommended formula", "Dissolve one sachet in 1L water", "Suitable for all ages"],
  }),
  product("cough-syrup-honey-tulsi", "Cough Syrup Honey & Tulsi", "CoughEase", "medicines", "100ml", 140, 112, "bottle", 28, {
    rating: 4.6,
    reviews: 780,
    tags: ["cold", "cough"],
    offerEligible: true,
    description:
      "Soothing honey and tulsi cough syrup that helps ease throat irritation and dry cough. Non-drowsy and sugar-free.",
    highlights: ["Non-drowsy formula", "Honey + tulsi + mulethi", "Sugar-free"],
  }),
  product("antacid-digestive-syrup", "Antacid Digestive Syrup", "DigiRelief", "medicines", "200ml", 160, 128, "bottle", 178, {
    rating: 4.4,
    reviews: 410,
    tags: ["digestion", "acidity"],
    description:
      "Cooling antacid syrup that gives quick relief from acidity, gas and indigestion. Mint flavoured.",
    highlights: ["Fast acidity relief", "Mint flavoured", "Shake well before use"],
  }),
  product("vitamin-d3-60k-sachets", "Vitamin D3 60K Sachets", "D3 Ultra", "medicines", "4 sachets", 120, 99, "sachet", 45, {
    rating: 4.7,
    reviews: 560,
    tags: ["bones", "immunity"],
    description:
      "Weekly vitamin D3 sachets that support bone strength, muscle function and immunity. Usually advised once a week.",
    highlights: ["Supports bone & muscle health", "One sachet weekly, as advised", "Mix with milk or water"],
  }),
  product("digital-thermometer", "Digital Thermometer", "ThermoSafe", "medicines", "1 unit", 350, 249, "device", 185, {
    rating: 4.5,
    reviews: 1120,
    tags: ["fever", "devices"],
    offerEligible: true,
    description:
      "Flexible-tip digital thermometer with a clear LCD and fast 30-second reading. Ideal for the whole family.",
    highlights: ["30-second reading", "Flexible safety tip", "Auto shut-off & memory recall"],
  }),

  product("vitamin-c-1000mg-effervescent", "Vitamin C 1000mg Effervescent", "ImmuBoost", "wellness", "20 tablets", 450, 315, "tube", 38, {
    rating: 4.8,
    reviews: 1320,
    tags: ["immunity", "skin"],
    offerEligible: true,
    description:
      "Fizzy orange vitamin C tablets with 1000mg per serve. Supports immunity, collagen production and iron absorption.",
    highlights: ["1000mg vitamin C per tablet", "Orange flavour, sugar-free", "Drop one tablet in a glass of water"],
  }),
  product("daily-multivitamin", "Daily Multivitamin", "DailyFit", "wellness", "60 tablets", 650, 499, "bottle", 162, {
    rating: 4.7,
    reviews: 2160,
    tags: ["immunity", "fitness"],
    offerEligible: true,
    description:
      "A balanced daily multivitamin with 24 vitamins and minerals for energy, immunity and everyday wellbeing.",
    highlights: ["24 essential vitamins & minerals", "One tablet a day", "Suitable for adults 18+"],
  }),
  product("omega-3-fish-oil", "Omega-3 Fish Oil", "HeartWell", "wellness", "60 capsules", 899, 649, "bottle", 40, {
    rating: 4.8,
    reviews: 890,
    tags: ["heart", "joints"],
    offerEligible: true,
    description:
      "High-potency omega-3 capsules with EPA and DHA to support heart, brain and joint health. Molecularly distilled.",
    highlights: ["1000mg fish oil per capsule", "Supports heart & brain health", "No fishy aftertaste"],
  }),
  product("whey-protein-chocolate", "Whey Protein Chocolate", "FitFuel", "wellness", "1kg", 2999, 2399, "jar", 22, {
    rating: 4.6,
    reviews: 670,
    tags: ["fitness", "protein"],
    description:
      "Rich chocolate whey protein with 24g protein per scoop. Helps muscle recovery after workouts.",
    highlights: ["24g protein per scoop", "24 servings per jar", "No added sugar"],
  }),
  product("calcium-vitamin-d3", "Calcium + Vitamin D3", "BoneStrong", "wellness", "60 tablets", 380, 299, "bottle", 192, {
    rating: 4.5,
    reviews: 540,
    tags: ["bones"],
    description:
      "Calcium carbonate with vitamin D3 to support bone density, teeth and muscle function.",
    highlights: ["Supports bone strength", "Vitamin D3 aids absorption", "Take after a meal"],
  }),
  product("probiotic-capsules", "Probiotic Capsules", "GutFlora", "wellness", "30 capsules", 599, 449, "bottle", 168, {
    rating: 4.7,
    reviews: 720,
    tags: ["digestion", "immunity"],
    offerEligible: true,
    description:
      "Multi-strain probiotic capsules with 10 billion CFU to support gut balance and digestive comfort.",
    highlights: ["10 billion CFU per capsule", "5 clinically studied strains", "Shelf-stable, no refrigeration needed"],
  }),
  product("biotin-hair-nail-gummies", "Biotin Hair & Nail Gummies", "GlowWell", "wellness", "30 gummies", 799, 599, "jar", 330, {
    rating: 4.6,
    reviews: 960,
    tags: ["hair", "skin"],
    offerEligible: true,
    description:
      "Strawberry-flavoured biotin gummies that support stronger hair, skin and nails. Vegetarian.",
    highlights: ["5000mcg biotin per serve", "Vegetarian & gelatin-free", "Delicious strawberry flavour"],
  }),
  product("electrolyte-drink-mix-lemon", "Electrolyte Drink Mix Lemon", "HydraLife", "wellness", "10 sachets", 250, 199, "sachet", 55, {
    rating: 4.5,
    reviews: 380,
    tags: ["hydration", "fitness"],
    offerEligible: true,
    description:
      "Instant lemon electrolyte sachets with sodium, potassium and magnesium. Great for workouts and summer days.",
    highlights: ["5 essential electrolytes", "Only 12 kcal per sachet", "No added sugar"],
  }),
  product("immunity-kadha", "Immunity Kadha", "HerbRoot", "wellness", "200ml", 199, 159, "bottle", 26, {
    rating: 4.4,
    reviews: 310,
    tags: ["immunity", "cold"],
    description:
      "A warming blend of tulsi, ginger, black pepper and mulethi to support seasonal immunity.",
    highlights: ["Ayurvedic herbal blend", "Just 10ml twice a day", "No artificial colours"],
  }),

  product("vitamin-c-face-serum", "Vitamin C Face Serum", "GlowWell", "personal-care", "30ml", 599, 449, "bottle", 335, {
    rating: 4.7,
    reviews: 1480,
    tags: ["skin", "glow"],
    offerEligible: true,
    description:
      "Lightweight 10% vitamin C serum with hyaluronic acid that brightens dull skin and fades dark spots.",
    highlights: ["10% stabilised vitamin C", "With hyaluronic acid", "Suitable for all skin types"],
  }),
  product("sunscreen-spf-50", "Sunscreen SPF 50 PA+++", "SunGuard", "personal-care", "50ml", 550, 439, "tube", 45, {
    rating: 4.8,
    reviews: 1930,
    tags: ["skin", "sun"],
    description:
      "Broad-spectrum SPF 50 PA+++ sunscreen with a non-greasy, no-white-cast finish. Water resistant for 4 hours.",
    highlights: ["SPF 50 PA+++ protection", "No white cast, matte finish", "Water resistant"],
  }),
  product("anti-dandruff-shampoo", "Anti-Dandruff Shampoo", "CleanCare", "personal-care", "340ml", 399, 319, "bottle", 198, {
    rating: 4.5,
    reviews: 820,
    tags: ["hair", "dandruff"],
    description:
      "Gentle anti-dandruff shampoo with ketoconazole that reduces flakes, itch and scalp irritation.",
    highlights: ["Reduces flakes & itch", "Sulphate-free formula", "Safe for coloured hair"],
  }),
  product("moisturising-body-lotion", "Moisturising Body Lotion", "SoftSkin", "personal-care", "400ml", 450, 349, "bottle", 318, {
    rating: 4.7,
    reviews: 1120,
    tags: ["skin", "dryness"],
    description:
      "24-hour moisturising body lotion with ceramides and shea butter for soft, comfortable skin.",
    highlights: ["24-hour hydration", "With ceramides & shea butter", "Non-sticky, fast absorbing"],
  }),
  product("charcoal-face-wash", "Charcoal Face Wash", "FreshFace", "personal-care", "100ml", 299, 239, "tube", 215, {
    rating: 4.4,
    reviews: 760,
    tags: ["skin", "oily"],
    offerEligible: true,
    description:
      "Activated charcoal face wash that lifts excess oil, dirt and pollution for a fresh, matte finish.",
    highlights: ["Deep-cleans oily skin", "With activated charcoal", "Soap-free & pH balanced"],
  }),
  product("aloe-vera-gel", "Aloe Vera Gel", "HerbalCare", "personal-care", "200ml", 250, 199, "jar", 132, {
    rating: 4.6,
    reviews: 1280,
    tags: ["skin", "hair"],
    description:
      "Pure aloe vera gel for soothing dry skin, sunburn and scalp irritation. Fragrance-free and non-sticky.",
    highlights: ["99% pure aloe extract", "Soothing & cooling", "For skin and hair"],
  }),
  product("sensitive-toothpaste", "Sensitive Toothpaste", "SmileCare", "personal-care", "100g", 180, 149, "tube", 188, {
    rating: 4.5,
    reviews: 530,
    tags: ["oral"],
    description:
      "Daily toothpaste for sensitive teeth that builds a protective layer over exposed dentine.",
    highlights: ["Relief from tooth sensitivity", "Fluoride protection", "Gentle mint flavour"],
  }),
  product("hand-sanitizer", "Hand Sanitizer", "CleanCare", "personal-care", "500ml", 299, 199, "bottle", 178, {
    rating: 4.4,
    reviews: 440,
    tags: ["hygiene"],
    description:
      "70% alcohol hand sanitizer that kills 99.9% of germs without drying your hands. With aloe vera.",
    highlights: ["70% alcohol", "Kills 99.9% germs", "Enriched with aloe vera"],
  }),

  product("diapers-pants-medium-62", "Diapers Pants Medium 62s", "TinyToes", "baby-mom", "62 pants", 1099, 899, "sachet", 198, {
    rating: 4.8,
    reviews: 3240,
    tags: ["baby", "diapering"],
    offerEligible: true,
    description:
      "Soft, breathable diaper pants with 12-hour absorption and a wetness indicator. Fits 7–12kg babies.",
    highlights: ["12-hour leak protection", "Breathable cotton-soft layer", "Fits 7–12kg"],
  }),
  product("baby-shampoo", "Baby Shampoo", "TinyToes", "baby-mom", "400ml", 425, 349, "bottle", 190, {
    rating: 4.9,
    reviews: 1860,
    tags: ["baby", "hair"],
    description:
      "Tear-free baby shampoo with a gentle no-more-tears formula for delicate hair and scalp.",
    highlights: ["No-more-tears formula", "Hypoallergenic & pH balanced", "Paediatrician tested"],
  }),
  product("baby-massage-oil", "Baby Massage Oil", "TinyToes", "baby-mom", "200ml", 320, 269, "bottle", 42, {
    rating: 4.8,
    reviews: 970,
    tags: ["baby", "skin"],
    description:
      "Light, non-sticky baby massage oil with almond and jojoba oils to keep delicate skin soft.",
    highlights: ["Almond + jojoba blend", "Dermatologically tested", "Free from mineral oil"],
  }),
  product("baby-wipes-pack-of-2", "Baby Wipes (Pack of 2)", "TinyToes", "baby-mom", "144 wipes", 399, 329, "sachet", 205, {
    rating: 4.7,
    reviews: 1410,
    tags: ["baby", "hygiene"],
    description:
      "Extra-soft, 99% water baby wipes with aloe vera. Fragrance-free and safe for newborn skin.",
    highlights: ["99% water-based", "Fragrance & alcohol free", "72 wipes per pack"],
  }),
  product("diaper-rash-cream", "Diaper Rash Cream", "TinyToes", "baby-mom", "50g", 240, 199, "tube", 342, {
    rating: 4.6,
    reviews: 680,
    tags: ["baby", "skin"],
    description:
      "Zinc oxide diaper rash cream that forms a protective barrier and soothes redness from the first use.",
    highlights: ["10% zinc oxide", "Soothes redness & irritation", "Paediatrician recommended"],
  }),
  product("pregnancy-multivitamin", "Pregnancy Multivitamin", "MomCare", "baby-mom", "30 tablets", 850, 699, "bottle", 302, {
    rating: 4.7,
    reviews: 520,
    tags: ["mom", "pregnancy"],
    description:
      "Prenatal multivitamin with folic acid, iron, calcium and DHA to support mother and baby.",
    highlights: ["Folic acid + iron + DHA", "One tablet daily", "Consult your doctor before use"],
  }),

  product("digital-bp-monitor", "Digital BP Monitor", "PulseCheck", "devices", "1 unit", 2499, 1799, "device", 172, {
    rating: 4.8,
    reviews: 2140,
    tags: ["heart", "devices"],
    offerEligible: true,
    description:
      "Fully automatic upper-arm blood pressure monitor with irregular heartbeat detection and 2-user memory.",
    highlights: ["Clinically validated accuracy", "2-user, 99-reading memory", "Large backlit display"],
  }),
  product("blood-glucose-meter-kit", "Blood Glucose Meter Kit", "GlucoTrack", "devices", "1 kit", 1499, 1099, "device", 208, {
    rating: 4.7,
    reviews: 1310,
    tags: ["diabetes", "devices"],
    offerEligible: true,
    description:
      "Easy-to-use glucometer kit with 25 test strips, lancets and a lancing device. Results in 5 seconds.",
    highlights: ["Result in 5 seconds", "Includes 25 strips & lancets", "Tiny 0.6µl blood sample"],
  }),
  product("pulse-oximeter", "Pulse Oximeter", "OxyCheck", "devices", "1 unit", 899, 649, "device", 190, {
    rating: 4.6,
    reviews: 1670,
    tags: ["devices", "lungs"],
    description:
      "Fingertip pulse oximeter that reads SpO2 and pulse rate in seconds on a bright OLED display.",
    highlights: ["SpO2 + pulse rate", "One-button operation", "Auto power-off"],
  }),
  product("digital-weighing-scale", "Digital Weighing Scale", "FitScale", "devices", "1 unit", 1299, 999, "device", 158, {
    rating: 4.5,
    reviews: 890,
    tags: ["fitness", "devices"],
    description:
      "Sleek tempered-glass weighing scale with high-precision sensors and a bright LCD display.",
    highlights: ["Precision up to 100g", "Tempered glass platform", "Auto calibration"],
  }),
  product("infrared-thermometer", "Infrared Thermometer", "ThermoSafe", "devices", "1 unit", 999, 749, "device", 18, {
    rating: 4.5,
    reviews: 610,
    tags: ["fever", "devices"],
    description:
      "Non-contact infrared thermometer with 1-second readings and fever alarm. Safe for infants and adults.",
    highlights: ["1-second non-contact reading", "Fever alarm & colour display", "50-reading memory"],
  }),
  product("nebulizer-machine", "Nebulizer Machine", "AirCare", "devices", "1 unit", 1999, 1599, "device", 172, {
    rating: 4.6,
    reviews: 430,
    tags: ["lungs", "devices"],
    description:
      "Compact piston-compressor nebulizer for home respiratory care. Includes adult and child masks.",
    highlights: ["Low-noise compressor", "Adult & child masks included", "1-year warranty"],
  }),

  product("ashwagandha-capsules", "Ashwagandha Capsules", "HerbRoot", "ayurveda", "60 capsules", 399, 319, "bottle", 132, {
    rating: 4.7,
    reviews: 1240,
    tags: ["stress", "sleep", "immunity"],
    offerEligible: true,
    description:
      "KSM-66 ashwagandha root extract capsules that help manage stress, support sleep and daily stamina.",
    highlights: ["500mg KSM-66 extract", "Supports calm & stamina", "One capsule twice daily"],
  }),
  product("triphala-tablets", "Triphala Tablets", "HerbRoot", "ayurveda", "60 tablets", 250, 199, "bottle", 122, {
    rating: 4.5,
    reviews: 680,
    tags: ["digestion"],
    description:
      "Traditional triphala blend of amla, haritaki and bibhitaki for gentle digestive support.",
    highlights: ["Classic three-fruit blend", "Supports regular digestion", "No added sugar"],
  }),
  product("chyawanprash", "Chyawanprash", "HerbRoot", "ayurveda", "500g", 399, 349, "jar", 32, {
    rating: 4.6,
    reviews: 980,
    tags: ["immunity"],
    description:
      "Amla-rich chyawanprash with 40+ herbs to support immunity and everyday energy for the family.",
    highlights: ["With 40+ ayurvedic herbs", "Rich in natural vitamin C", "One teaspoon daily"],
  }),
  product("tulsi-drops", "Tulsi Drops", "HerbRoot", "ayurveda", "30ml", 199, 159, "bottle", 148, {
    rating: 4.4,
    reviews: 540,
    tags: ["immunity", "cold"],
    description:
      "Concentrated tulsi drops that can be added to water, tea or honey for daily immunity support.",
    highlights: ["Pure tulsi extract", "2–3 drops in water daily", "No added sugar"],
  }),
  product("joint-pain-oil", "Joint Pain Oil", "HerbRoot", "ayurveda", "100ml", 350, 289, "bottle", 22, {
    rating: 4.5,
    reviews: 710,
    tags: ["pain", "joints"],
    description:
      "Warming ayurvedic massage oil with mahanarayan and eucalyptus oils for stiff, achy joints.",
    highlights: ["Mahanarayan + eucalyptus", "Non-greasy warming formula", "For external use only"],
  }),
  product("liver-care-syrup", "Liver Care Syrup", "HerbRoot", "ayurveda", "200ml", 280, 229, "bottle", 102, {
    rating: 4.4,
    reviews: 330,
    tags: ["liver", "digestion"],
    description:
      "Herbal liver tonic with kutki, bhringraj and punarnava to support liver function and appetite.",
    highlights: ["Ayurvedic liver support", "Sugar-free formulation", "10ml twice daily"],
  }),

  product("arnica-montana-30c", "Arnica Montana 30C", "HomeoWell", "homeopathy", "10g globules", 150, 125, "bottle", 282, {
    rating: 4.6,
    reviews: 420,
    tags: ["pain", "bruises"],
    description:
      "Classical homeopathic arnica globules traditionally used for bruises, muscle soreness and injury recovery.",
    highlights: ["30C potency", "Sealed glass vial", "Take as advised by your homeopath"],
  }),
  product("nux-vomica-30c", "Nux Vomica 30C", "HomeoWell", "homeopathy", "10g globules", 145, 120, "bottle", 268, {
    rating: 4.5,
    reviews: 310,
    tags: ["digestion"],
    description:
      "Homeopathic nux vomica globules, traditionally used for digestive discomfort and acidity.",
    highlights: ["30C potency", "Classical preparation", "Store away from strong smells"],
  }),
  product("calendula-ointment", "Calendula Ointment", "HomeoWell", "homeopathy", "25g", 180, 149, "tube", 58, {
    rating: 4.6,
    reviews: 260,
    tags: ["skin", "healing"],
    description:
      "Soothing calendula ointment for minor cuts, chapped skin and dry patches. Gentle enough for daily use.",
    highlights: ["Natural calendula extract", "For minor cuts & dryness", "Paraben-free"],
  }),
  product("cough-cold-drops", "Cough & Cold Drops", "HomeoWell", "homeopathy", "30ml", 160, 135, "bottle", 252, {
    rating: 4.3,
    reviews: 190,
    tags: ["cold", "cough"],
    description:
      "Homeopathic cough and cold drops for seasonal sneezing, runny nose and throat irritation.",
    highlights: ["Alcohol-free base", "Suitable for adults & children", "Use as directed"],
  }),

  product("california-almonds", "California Almonds", "NutriBowl", "food-drinks", "500g", 550, 449, "jar", 32, {
    rating: 4.8,
    reviews: 1680,
    tags: ["immunity", "fitness", "snacks"],
    offerEligible: true,
    description:
      "Premium hand-picked California almonds, naturally rich in protein, fibre and vitamin E.",
    highlights: ["Premium grade almonds", "Rich in vitamin E", "Resealable jar"],
  }),
  product("pure-honey", "Pure Honey", "NutriBowl", "food-drinks", "500g", 299, 249, "jar", 42, {
    rating: 4.7,
    reviews: 1290,
    tags: ["immunity", "natural"],
    offerEligible: true,
    description:
      "Raw, unfiltered honey with natural sweetness and no added sugar. Sourced from Indian apiaries.",
    highlights: ["100% pure honey", "No added sugar or syrup", "NMR tested"],
  }),
  product("green-tea-bags", "Green Tea Bags", "NutriBowl", "food-drinks", "25 bags", 350, 279, "box", 122, {
    rating: 4.5,
    reviews: 870,
    tags: ["fitness", "drinks"],
    description:
      "Delicate Himalayan green tea bags with a light, refreshing flavour and natural antioxidants.",
    highlights: ["25 individually sealed bags", "Rich in antioxidants", "No artificial flavouring"],
  }),
  product("peanut-butter-crunchy", "Peanut Butter Crunchy", "NutriBowl", "food-drinks", "1kg", 499, 399, "jar", 28, {
    rating: 4.7,
    reviews: 1450,
    tags: ["fitness", "protein"],
    description:
      "Crunchy peanut butter made from slow-roasted peanuts with no hydrogenated oils.",
    highlights: ["100% roasted peanuts", "No added sugar", "26g protein per 100g"],
  }),
  product("rolled-oats", "Rolled Oats", "NutriBowl", "food-drinks", "1kg", 299, 239, "sachet", 38, {
    rating: 4.6,
    reviews: 990,
    tags: ["fitness", "breakfast"],
    description:
      "Whole-grain rolled oats for a filling, high-fibre breakfast. Ready in three minutes.",
    highlights: ["High in dietary fibre", "No added sugar", "Makes 20+ servings"],
  }),
];

export const seedAdminEmails = ["ash.intas@gmail.com"];
