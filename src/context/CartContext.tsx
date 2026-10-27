import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { getUnitPricing, priceCart } from "@/lib/pricing";
import type { Pricing, Product } from "@/types";

const CART_KEY = "cp_cart_v1";

type CartItem = { product: Product; qty: number; unitPrice: number; offerApplied: boolean };

type CartContextValue = {
  items: Record<string, number>;
  lines: CartItem[];
  pricing: Pricing;
  count: number;
  ready: boolean;
  addItem: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getQty: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): Record<string, number> {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const result: Record<string, number> = {};
    for (const [key, value] of Object.entries(parsed ?? {})) {
      const qty = Number(value);
      if (Number.isFinite(qty) && qty > 0) result[key] = Math.min(20, Math.floor(qty));
    }
    return result;
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, offer, settings } = useCatalog();
  const toast = useToast();
  const [items, setItems] = useState<Record<string, number>>(() => readCart());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items, ready]);

  const lines = useMemo<CartItem[]>(() => {
    return Object.entries(items)
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === id);
        if (!product || !product.active || qty <= 0) return null;
        const unit = getUnitPricing(product, offer);
        return { product, qty, unitPrice: unit.unitPrice, offerApplied: unit.offerApplied };
      })
      .filter((line): line is CartItem => Boolean(line));
  }, [items, products, offer]);

  const pricing = useMemo(
    () => priceCart(lines.map(({ product, qty }) => ({ product, qty })), offer, settings),
    [lines, offer, settings],
  );

  const count = useMemo(() => Object.values(items).reduce((sum, qty) => sum + qty, 0), [items]);

  const addItem = useCallback(
    (productId: string, qty = 1) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      if (!product.active || product.stock <= 0) {
        toast.error("Out of stock", `${product.name} is currently unavailable.`);
        return;
      }
      setItems((current) => {
        const nextQty = Math.min(product.stock, (current[productId] ?? 0) + qty);
        if (nextQty === current[productId]) {
          toast.info("Stock limit reached", `Only ${product.stock} units are available right now.`);
        }
        return { ...current, [productId]: nextQty };
      });
      toast.success("Added to cart", `${product.name} · ${product.packSize}`);
    },
    [products, toast],
  );

  const setQty = useCallback(
    (productId: string, qty: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      const next = Math.max(1, Math.min(product.stock, Math.floor(qty)));
      setItems((current) => ({ ...current, [productId]: next }));
    },
    [products],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setItems({}), []);

  const getQty = useCallback((productId: string) => items[productId] ?? 0, [items]);

  const value = useMemo<CartContextValue>(
    () => ({ items, lines, pricing, count, ready, addItem, setQty, removeItem, clearCart, getQty }),
    [items, lines, pricing, count, ready, addItem, setQty, removeItem, clearCart, getQty],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
