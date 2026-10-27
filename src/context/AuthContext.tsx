import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { checkIsAdmin } from "@/lib/firestore";
import { firebaseErrorMessage } from "@/lib/utils";
import type { UserProfile } from "@/types";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  adminLoading: boolean;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<boolean>;
  reloadProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function ensureProfile(user: User) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const base = {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName || user.email?.split("@")[0] || "Patient",
    photoURL: user.photoURL ?? "",
    updatedAt: serverTimestamp(),
  };
  if (!snap.exists()) {
    await setDoc(ref, { ...base, createdAt: serverTimestamp() });
  } else {
    await setDoc(ref, base, { merge: true });
  }
  return snap.exists()
    ? ({ ...snap.data(), ...base, uid: user.uid } as UserProfile)
    : ({ ...base, uid: user.uid } as UserProfile);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        setAdminLoading(true);
        try {
          const nextProfile = await ensureProfile(nextUser);
          setProfile(nextProfile);
        } catch (error) {
          console.error("Profile sync failed", error);
          setProfile({
            uid: nextUser.uid,
            email: nextUser.email ?? "",
            displayName: nextUser.displayName ?? "",
            photoURL: nextUser.photoURL ?? "",
          });
        }
        const admin = await checkIsAdmin(nextUser.email);
        setIsAdmin(admin);
        setAdminLoading(false);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setAdminLoading(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      throw new Error(firebaseErrorMessage(error));
    }
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      throw new Error(firebaseErrorMessage(error));
    }
  }, []);

  const signUpEmail = useCallback(async (name: string, email: string, password: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (name.trim()) {
        await updateProfile(credential.user, { displayName: name.trim() });
      }
    } catch (error) {
      throw new Error(firebaseErrorMessage(error));
    }
  }, []);

  const sendReset = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      throw new Error(firebaseErrorMessage(error));
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const refreshAdmin = useCallback(async () => {
    if (!auth.currentUser?.email) {
      setIsAdmin(false);
      return false;
    }
    setAdminLoading(true);
    const admin = await checkIsAdmin(auth.currentUser.email);
    setIsAdmin(admin);
    setAdminLoading(false);
    return admin;
  }, []);

  const reloadProfile = useCallback(async () => {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (snap.exists()) {
      setProfile({ uid: auth.currentUser.uid, ...snap.data() } as UserProfile);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAdmin,
      adminLoading,
      signInGoogle,
      signInEmail,
      signUpEmail,
      sendReset,
      logout,
      refreshAdmin,
      reloadProfile,
    }),
    [user, profile, loading, isAdmin, adminLoading, signInGoogle, signInEmail, signUpEmail, sendReset, logout, refreshAdmin, reloadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
