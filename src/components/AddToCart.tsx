"use client";

import { Product } from "@/lib/woo";
import { useCart } from "./CartProvider";

export function AddToCart({ product, accent, ink = "#fff" }: { product?: Product; accent: string; ink?: string }) {
  const { addItem, busy } = useCart();
  if (!product) {
    return <span className="inline-block rounded-full border border-current/30 px-7 py-4 text-sm uppercase tracking-widest opacity-60">Coming soon</span>;
  }
  return (
    <button
      disabled={busy}
      onClick={() => addItem(product.id)}
      style={{ backgroundColor: accent, color: ink }}
      className="group inline-flex items-center gap-4 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-widest transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
    >
      Add to cart
      <span className="h-4 w-px bg-current opacity-40" />
      <span>{product.price}</span>
    </button>
  );
}
