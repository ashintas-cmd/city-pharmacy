import { initializeFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

export const firebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

export const firebaseProjectId = config.projectId ?? "city-pharmacy-ccfc3";

const app: FirebaseApp = getApps()[0] ?? initializeApp(config);

export const auth = getAuth(app);

// The project's Firestore database is named "default" (not the SDK's
// conventional "(default)"), so the database id must be passed explicitly.
// ignoreUndefinedProperties lets optional form fields (email, userId…)
// be omitted cleanly instead of throwing on write.
export const db = initializeFirestore(
  app,
  { ignoreUndefinedProperties: true },
  "default",
);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
