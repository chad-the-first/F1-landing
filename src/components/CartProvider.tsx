"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Cart, emptyCart, mapCart } from "@/lib/woo";

type CartContextValue = {
  cart: Cart;
  open: boolean;
  busy: boolean;
  error: string | null;
  setOpen: (open: boolean) => void;
  addItem: (id: number, quantity?: number) => Promise<void>;
  updateItem: (key: string, quantity: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

async function call(path: string, body?: object) {
  const res = await fetch(`/api/cart/${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? json.error ?? "Cart request failed");
  return mapCart(json);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (path: string, body?: object) => {
    setBusy(true);
    setError(null);
    try {
      setCart(await call(path, body));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    call("cart").then(setCart).catch(() => {});
  }, []);

  const value: CartContextValue = {
    cart,
    open,
    busy,
    error,
    setOpen,
    addItem: async (id, quantity = 1) => {
      await run("add-item", { id, quantity });
      setOpen(true);
    },
    updateItem: (key, quantity) => run("update-item", { key, quantity }),
    removeItem: (key) => run("remove-item", { key }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
