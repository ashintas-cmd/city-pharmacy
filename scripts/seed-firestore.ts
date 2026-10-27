import fs from "node:fs";
import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  seedAdminEmails,
  seedCategories,
  seedOffer,
  seedProducts,
  seedSettings,
} from "../src/data/seed";

const projectId = process.env.FIREBASE_PROJECT_ID || "city-pharmacy-ccfc3";
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const app = initializeApp({
  projectId,
  credential: keyPath ? cert(fs.readFileSync(keyPath, "utf8")) : applicationDefault(),
});

// The project database is deliberately named "default" (not "(default)").
const db = getFirestore(app, "default");

type SeedWrite = { collection: string; id: string; data: Record<string, unknown> };

async function commitAll(writes: SeedWrite[]) {
  const chunkSize = 400;
  for (let index = 0; index < writes.length; index += chunkSize) {
    const batch = db.batch();
    for (const write of writes.slice(index, index + chunkSize)) {
      batch.set(db.collection(write.collection).doc(write.id), write.data, { merge: true });
    }
    await batch.commit();
    console.log(`Committed ${Math.min(index + chunkSize, writes.length)} / ${writes.length}`);
  }
}

async function main() {
  console.log(`Seeding ${projectId} / database "default"…`);
  const writes: SeedWrite[] = [];

  for (const category of seedCategories) {
    writes.push({ collection: "categories", id: category.id, data: category });
  }

  const now = new Date().toISOString();
  for (const product of seedProducts) {
    writes.push({
      collection: "products",
      id: product.id,
      data: { ...product, createdAt: product.createdAt ?? now, updatedAt: now },
    });
  }

  writes.push({ collection: "offers", id: seedOffer.id, data: seedOffer });
  writes.push({ collection: "settings", id: "store", data: seedSettings });

  const adminEmails = (process.env.SEED_ADMIN_EMAILS || seedAdminEmails.join(","))
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  for (const email of adminEmails) {
    writes.push({
      collection: "admins",
      id: email,
      data: { email, name: "City Pharmacy Admin", addedAt: new Date() },
    });
  }

  await commitAll(writes);
  console.log(`Done. ${seedProducts.length} products, ${seedCategories.length} categories, 1 offer, store settings.`);
  console.log(`Admins seeded: ${adminEmails.join(", ")}`);
  console.log("Tip: you can also restore the demo catalogue from Admin → Store settings.");
}

main().catch((error) => {
  console.error(error);
  console.error(
    "\nCould not seed Firestore. Set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON file, or use Admin → Store settings → Restore demo catalogue.",
  );
  process.exitCode = 1;
});
