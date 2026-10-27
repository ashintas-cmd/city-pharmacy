import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  AdminEntry,
  Category,
  ContactMessage,
  Enquiry,
  Offer,
  Order,
  OrderStatus,
  Product,
  StoreSettings,
  UserProfile,
} from "@/types";
import { seedCategories, seedOffer, seedProducts, seedSettings } from "@/data/seed";

const nowIso = () => new Date().toISOString();

function docsToArray<T>(snapshot: Awaited<ReturnType<typeof getDocs>>): T[] {
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as object) })) as T[];
}

export async function fetchCatalog(): Promise<{
  categories: Category[];
  products: Product[];
  offer: Offer | null;
  settings: StoreSettings;
}> {
  const [catSnap, prodSnap, offerSnap, settingsSnap] = await Promise.all([
    getDocs(query(collection(db, "categories"), orderBy("order", "asc"))),
    getDocs(collection(db, "products")),
    getDoc(doc(db, "offers", "diwali-15")),
    getDoc(doc(db, "settings", "store")),
  ]);

  const categories = docsToArray<Category>(catSnap).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const products = docsToArray<Product>(prodSnap);
  const offer = offerSnap.exists() ? ({ id: offerSnap.id, ...offerSnap.data() } as Offer) : null;
  const settings = settingsSnap.exists()
    ? ({ ...seedSettings, ...settingsSnap.data() } as StoreSettings)
    : seedSettings;

  return {
    categories: categories.length ? categories : seedCategories,
    products: products.length ? products : seedProducts,
    offer: offer ?? seedOffer,
    settings,
  };
}

export async function createOrder(order: Omit<Order, "createdAt" | "updatedAt">) {
  const ref = doc(db, "orders", order.id);
  await setDoc(ref, {
    ...order,
    timeline: [{ status: "PLACED", at: nowIso(), note: "Order placed on citypharmacy.in" }],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return order.id;
}

export async function fetchMyOrders(uid: string): Promise<Order[]> {
  const snap = await getDocs(query(collection(db, "orders"), where("userId", "==", uid)));
  return docsToArray<Order>(snap).sort((a, b) => {
    const at = a.createdAt as { seconds?: number } | string | undefined;
    const bt = b.createdAt as { seconds?: number } | string | undefined;
    const av = typeof at === "string" ? Date.parse(at) : (at?.seconds ?? 0) * 1000;
    const bv = typeof bt === "string" ? Date.parse(bt) : (bt?.seconds ?? 0) * 1000;
    return bv - av;
  });
}

export async function fetchOrder(orderId: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, "orders", orderId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null;
}

export async function cancelOrder(orderId: string) {
  await updateDoc(doc(db, "orders", orderId), {
    status: "CANCELLED" satisfies OrderStatus,
    cancelledAt: nowIso(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) throw new Error("Order not found");
  const current = snap.data() as Order;
  const timeline = Array.isArray(current.timeline) ? current.timeline : [];
  await updateDoc(doc(db, "orders", orderId), {
    status,
    updatedAt: serverTimestamp(),
    ...(status === "CANCELLED" ? { cancelledAt: nowIso() } : {}),
    timeline: [...timeline, { status, at: nowIso(), note: note ?? "" }],
  });
}

export async function fetchAllOrders(limitTo = 300): Promise<Order[]> {
  const snap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
  return docsToArray<Order>(snap).slice(0, limitTo);
}

export async function saveProfile(profile: Partial<UserProfile> & { uid: string }) {
  await setDoc(
    doc(db, "users", profile.uid),
    { ...profile, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function fetchProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? ({ uid: snap.id, ...snap.data() } as UserProfile) : null;
}

export async function checkIsAdmin(email?: string | null): Promise<boolean> {
  if (!email) return false;
  try {
    const snap = await getDoc(doc(db, "admins", email.toLowerCase()));
    return snap.exists();
  } catch {
    return false;
  }
}

export async function fetchAdmins(): Promise<AdminEntry[]> {
  const snap = await getDocs(collection(db, "admins"));
  return docsToArray<AdminEntry>(snap);
}

export async function addAdmin(email: string, name?: string) {
  await setDoc(doc(db, "admins", email.toLowerCase()), {
    email: email.toLowerCase(),
    name: name ?? "",
    addedAt: serverTimestamp(),
  });
}

export async function removeAdmin(email: string) {
  await deleteDoc(doc(db, "admins", email.toLowerCase()));
}

export async function submitEnquiry(enquiry: Omit<Enquiry, "id" | "createdAt" | "updatedAt" | "status">) {
  const payload = Object.fromEntries(
    Object.entries({
      ...enquiry,
      status: "new",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).filter(([, value]) => value !== undefined),
  );
  const ref = await addDoc(collection(db, "enquiries"), payload);
  return ref.id;
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  const snap = await getDocs(query(collection(db, "enquiries"), orderBy("createdAt", "desc")));
  return docsToArray<Enquiry>(snap);
}

export async function updateEnquiry(id: string, patch: Partial<Enquiry>) {
  await updateDoc(doc(db, "enquiries", id), { ...patch, updatedAt: serverTimestamp() });
}

export async function submitContactMessage(
  message: Omit<ContactMessage, "id" | "createdAt" | "status">,
) {
  const payload = Object.fromEntries(
    Object.entries({
      ...message,
      status: "new",
      createdAt: serverTimestamp(),
    }).filter(([, value]) => value !== undefined),
  );
  const ref = await addDoc(collection(db, "messages"), payload);
  return ref.id;
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
  return docsToArray<ContactMessage>(snap);
}

export async function uploadPrescriptionFile(dataUrl: string, name: string, userId?: string) {
  const ref = await addDoc(collection(db, "prescriptionFiles"), {
    data: dataUrl,
    name,
    userId: userId ?? "",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function fetchPrescriptionFile(id: string): Promise<{ data: string; name: string } | null> {
  const snap = await getDoc(doc(db, "prescriptionFiles", id));
  return snap.exists() ? (snap.data() as { data: string; name: string }) : null;
}

export async function updateMessage(id: string, patch: Partial<ContactMessage>) {
  await updateDoc(doc(db, "messages", id), patch);
}

export async function saveProduct(product: Product) {
  await setDoc(
    doc(db, "products", product.id),
    { ...product, updatedAt: nowIso(), ...(product.createdAt ? {} : { createdAt: nowIso() }) },
    { merge: true },
  );
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}

export async function saveOffer(offer: Offer) {
  await setDoc(doc(db, "offers", offer.id), { ...offer, updatedAt: nowIso() }, { merge: true });
}

export async function saveSettings(settings: StoreSettings) {
  await setDoc(doc(db, "settings", "store"), settings, { merge: true });
}

export async function seedCatalogToFirestore() {
  const batch = writeBatch(db);
  seedCategories.forEach((category) => {
    batch.set(doc(db, "categories", category.id), category, { merge: true });
  });
  seedProducts.forEach((product) => {
    batch.set(
      doc(db, "products", product.id),
      { ...product, createdAt: nowIso(), updatedAt: nowIso() },
      { merge: true },
    );
  });
  batch.set(doc(db, "offers", seedOffer.id), seedOffer, { merge: true });
  batch.set(doc(db, "settings", "store"), seedSettings, { merge: true });
  await batch.commit();
}

export function firestoreStampToDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "object" && "seconds" in (value as object)) {
    return new Date(((value as { seconds: number }).seconds ?? 0) * 1000);
  }
  return null;
}
