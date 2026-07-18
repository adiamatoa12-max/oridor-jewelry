"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createCart,
  addCartLines,
  updateCartLine,
  removeCartLine,
  getCart,
  getFirstVariantId,
  isShopifyConfigured,
  type ShopifyCart,
  type ShopifyCartLine,
} from "@/lib/shopify";

const STORAGE_KEY = "oridor_cart_id";

/** UI-facing line item, mapped from a real Shopify cart line. */
export interface CartItem {
  /** Cart LINE id — used to update/remove this exact line. */
  id: string;
  title: string;
  variant?: string;
  price: number;
  /** Original unit price when on sale (renders as a struck-through discount). */
  compareAtPrice?: number;
  /**
   * One-line detail shown under the title, e.g.
   * "כסף 925 טהור בציפוי רודיום · 2 קראט" — material from the product
   * description, plus whichever options the shopper actually chose.
   */
  details?: string;
  quantity: number;
  image: string;
}

interface CartContextValue {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  items: CartItem[];
  subtotal: number;
  count: number;
  /** Real Shopify checkout URL — null until a cart exists. */
  checkoutUrl: string | null;
  /** A cart mutation is in flight. */
  busy: boolean;
  /** Add a specific Shopify variant (used by the product buy box). */
  addVariant: (variantId: string, quantity?: number) => void;
  /** Add a product's first variant by handle (used by quick-add buttons). */
  addByHandle: (handle: string) => void;
  /** Set an absolute quantity for a cart line. */
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [busy, setBusy] = useState(false);
  const cartRef = useRef<ShopifyCart | null>(null);
  // Serialize mutations so rapid clicks can't corrupt the cart.
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  const persist = useCallback((c: ShopifyCart | null) => {
    cartRef.current = c;
    setCart(c);
    try {
      if (c) localStorage.setItem(STORAGE_KEY, c.id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — cart still works for the session */
    }
  }, []);

  // Re-hydrate an existing Shopify cart on mount (never seeds dummy items).
  useEffect(() => {
    if (!isShopifyConfigured) return;
    let id: string | null = null;
    try {
      id = localStorage.getItem(STORAGE_KEY);
    } catch {
      id = null;
    }
    if (!id) return;
    getCart(id).then((c) => {
      if (c) persist(c);
      else
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
    });
  }, [persist]);

  // Run a cart mutation on the serialized queue, updating busy + state.
  const run = useCallback(
    (task: () => Promise<ShopifyCart>) => {
      const next = queue.current
        .catch(() => {})
        .then(async () => {
          setBusy(true);
          try {
            persist(await task());
          } catch (err) {
            console.error("Cart mutation failed:", err);
          } finally {
            setBusy(false);
          }
        });
      queue.current = next;
      return next;
    },
    [persist],
  );

  const addVariant = useCallback(
    (variantId: string, quantity = 1) => {
      if (!isShopifyConfigured) return;
      setIsOpen(true);
      run(() => {
        const current = cartRef.current;
        return current
          ? addCartLines(current.id, [{ merchandiseId: variantId, quantity }])
          : createCart([{ merchandiseId: variantId, quantity }]);
      });
    },
    [run],
  );

  const addByHandle = useCallback(
    (handle: string) => {
      if (!isShopifyConfigured) return;
      setIsOpen(true);
      run(async () => {
        const variantId = await getFirstVariantId(handle);
        if (!variantId) throw new Error(`No variant found for "${handle}"`);
        const current = cartRef.current;
        return current
          ? addCartLines(current.id, [{ merchandiseId: variantId, quantity: 1 }])
          : createCart([{ merchandiseId: variantId, quantity: 1 }]);
      });
    },
    [run],
  );

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      const current = cartRef.current;
      if (!current) return;
      if (quantity < 1) {
        run(() => removeCartLine(current.id, lineId));
        return;
      }
      run(() => updateCartLine(current.id, lineId, quantity));
    },
    [run],
  );

  const removeItem = useCallback(
    (lineId: string) => {
      const current = cartRef.current;
      if (!current) return;
      run(() => removeCartLine(current.id, lineId));
    },
    [run],
  );

  const value = useMemo<CartContextValue>(() => {
    /**
     * "Material · chosen options" for the cart line, e.g.
     * "כסף 925 טהור בציפוי רודיום · 2 קראט".
     *
     * A bare option VALUE is meaningless on its own — carat variants read as
     * just "2" — so measurable axes are labelled with their option name, while
     * descriptive ones (colour/finish) read better as the value alone.
     */
    const DESCRIPTIVE = /צבע|color|גימור|finish|מתכת|metal|חומר/i;
    const buildDetails = (l: ShopifyCartLine): string | undefined => {
      const parts = [
        l.material,
        ...l.options.map((o) =>
          DESCRIPTIVE.test(o.name) ? o.value : `${o.value} ${o.name}`,
        ),
      ].filter(Boolean);
      return parts.length ? parts.join(" · ") : undefined;
    };

    const items: CartItem[] = (cart?.lines ?? []).map((l) => ({
      id: l.id,
      title: l.title,
      variant: l.variantTitle || undefined,
      price: l.price,
      compareAtPrice: l.compareAtPrice,
      details: buildDetails(l),
      quantity: l.quantity,
      image: l.image ?? "",
    }));
    return {
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      items,
      subtotal: cart?.subtotal ?? 0,
      count: cart?.totalQuantity ?? 0,
      checkoutUrl: cart?.checkoutUrl ?? null,
      busy,
      addVariant,
      addByHandle,
      updateQuantity,
      removeItem,
    };
  }, [isOpen, cart, busy, addVariant, addByHandle, updateQuantity, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
