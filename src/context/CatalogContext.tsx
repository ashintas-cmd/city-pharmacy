import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchCatalog } from "@/lib/firestore";
import { isOfferLive } from "@/lib/pricing";
import { seedCategories, seedOffer, seedProducts, seedSettings } from "@/data/seed";
import type { Catalog, Category, Offer, Product, StoreSettings } from "@/types";

const CACHE_KEY = "cp_catalog_v2";
const CACHE_TTL = 1000 * 60 * 15;

const fallbackCatalog: Catalog = {
  categories: seedCategories,
  products: seedProducts,
  offer: seedOffer,
  settings: seedSettings,
  loadedAt: 0,
};

type CatalogContextValue = {
  categories: Category[];
  products: Product[];
  offerProducts: Product[];
  offer: Offer | null;
  liveOffer: Offer | null;
  settings: StoreSettings;
  loading: boolean;
  error: string;
  lastLoadedAt: number;
  usingCache: boolean;
  refresh: () => Promise<void>;
  getProduct: (slug: string) => Product | undefined;
  getCategory: (idOrSlug: string) => Category | undefined;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

function readCache(): Catalog | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Catalog;
    if (!parsed?.products?.length || !parsed?.categories?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const cached = useRef<Catalog | null>(readCache());
  const [catalog, setCatalog] = useState<Catalog>(cached.current ?? fallbackCatalog);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usingCache, setUsingCache] = useState(Boolean(cached.current));

  const refresh = useCallback(async () => {
    try {
      const next = await fetchCatalog();
      const loaded: Catalog = { ...next, loadedAt: Date.now() };
      setCatalog(loaded);
      setUsingCache(false);
      setError("");
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(loaded));
      } catch {
        /* cache is best-effort */
      }
    } catch (err) {
      console.error("Catalog load failed", err);
      setError("We could not reach the pharmacy catalogue. Showing the last saved catalogue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cached.current && Date.now() - cached.current.loadedAt < CACHE_TTL) {
      setLoading(false);
      void refresh();
      return;
    }
    void refresh();
  }, [refresh]);

  const getProduct = useCallback(
    (slug: string) => catalog.products.find((p) => p.slug === slug || p.id === slug),
    [catalog.products],
  );

  const getCategory = useCallback(
    (idOrSlug: string) =>
      catalog.categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug),
    [catalog.categories],
  );

  const liveOffer = useMemo(
    () => (catalog.offer && isOfferLive(catalog.offer) ? catalog.offer : null),
    [catalog.offer],
  );

  const offerProducts = useMemo(
    () => catalog.products.filter((product) => product.active && product.offerEligible),
    [catalog.products],
  );

  const value = useMemo<CatalogContextValue>(
    () => ({
      categories: catalog.categories,
      products: catalog.products,
      offerProducts,
      offer: catalog.offer,
      liveOffer,
      settings: catalog.settings ?? seedSettings,
      loading,
      error,
      lastLoadedAt: catalog.loadedAt,
      usingCache,
      refresh,
      getProduct,
      getCategory,
    }),
    [catalog, offerProducts, liveOffer, loading, error, usingCache, refresh, getProduct, getCategory],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used inside CatalogProvider");
  return context;
}
