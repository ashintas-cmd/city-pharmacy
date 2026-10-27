export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  tone: string;
  order: number;
};

export type ArtType = "box" | "bottle" | "tube" | "device" | "jar" | "sachet" | "strip";
export type ProductArt = { type: ArtType; hue: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  packSize: string;
  mrp: number;
  price: number;
  rx: boolean;
  stock: number;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  tags: string[];
  art: ProductArt;
  offerEligible: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Offer = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  percent: number;
  active: boolean;
  startDate: string;
  endDate: string;
  badge: string;
  terms: string[];
  updatedAt?: string;
};

export type StoreSettings = {
  name: string;
  tagline: string;
  owner: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  hours: string;
  licence: string;
  deliveryFee: number;
  freeDeliveryAbove: number;
  deliveryEta: string;
  mapQuery: string;
  supportEmail: string;
};

export type Address = {
  id?: string;
  label?: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
};

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  addresses?: Address[];
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type AdminEntry = { email: string; name?: string; addedAt?: unknown };

export type OrderStatus = "PLACED" | "PACKED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  packSize: string;
  art: ProductArt;
  mrp: number;
  unitPrice: number;
  qty: number;
  offerApplied: boolean;
  lineTotal: number;
};

export type OrderTimelineItem = { status: OrderStatus; at: string; note?: string };

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  customer: { name: string; phone: string; email: string };
  address: Address;
  paymentMethod: "COD" | "UPI_ON_DELIVERY";
  deliverySlot?: string;
  notes?: string;
  mrpTotal: number;
  subtotal: number;
  offerDiscount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  offerTitle?: string;
  offerPercent?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
  cancelledAt?: string;
  timeline: OrderTimelineItem[];
};

export type EnquiryType =
  | "medicine-availability"
  | "home-delivery"
  | "prescription-help"
  | "health-advice"
  | "order-support"
  | "feedback"
  | "other";

export type Enquiry = {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  age?: string;
  area?: string;
  type: EnquiryType;
  message: string;
  preferredTime?: string;
  consent: boolean;
  status: "new" | "contacted" | "closed";
  adminNote?: string;
  userId?: string;
  prescriptionFileId?: string;
  prescriptionName?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type ContactMessage = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  adminNote?: string;
  createdAt?: unknown;
};

export type Pricing = {
  mrpTotal: number;
  subtotal: number;
  offerDiscount: number;
  productSavings: number;
  deliveryFee: number;
  total: number;
  savings: number;
  itemCount: number;
  freeDeliveryGap: number;
};

export type Catalog = {
  categories: Category[];
  products: Product[];
  offer: Offer | null;
  settings: StoreSettings;
  loadedAt: number;
};
