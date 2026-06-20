"use client";

import { createContext, useContext, useMemo, useState } from "react";

export interface CartItem {
  id: string;
  title: string;
  variant?: string;
  price: number;
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
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// Placeholder line items until real cart logic / product data is wired in.
const PLACEHOLDER_ITEMS: CartItem[] = [
  {
    id: "crystal-oval",
    title: "שרשרת קריסטל אובלית",
    variant: "כסף 925",
    price: 280,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "tennis-drops",
    title: "צמיד טניס טיפות",
    variant: "כסף 925",
    price: 280,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=400&q=80",
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>(PLACEHOLDER_ITEMS);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      items,
      subtotal,
      count,
      updateQuantity: (id, delta) =>
        setItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
          ),
        ),
      removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    };
  }, [isOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
