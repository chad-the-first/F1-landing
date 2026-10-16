"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { cart, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      className="relative rounded-full border border-white/20 px-5 py-2 text-sm font-medium uppercase tracking-widest transition hover:border-accent hover:text-accent"
    >
      Cart
      {cart.itemCount > 0 && (
        <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-accent-ink">
          {cart.itemCount}
        </span>
      )}
    </button>
  );
}

export function CartDrawer() {
  const { cart, open, setOpen, busy, error, updateItem, removeItem } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-ink text-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <header className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="text-lg font-semibold uppercase tracking-widest">Your cart</h2>
              <button onClick={() => setOpen(false)} aria-label="Close cart" className="text-2xl leading-none text-white/60 hover:text-white">
                ×
              </button>
            </header>

            <div className={`flex-1 overflow-y-auto p-6 transition ${busy ? "opacity-50" : ""}`}>
              {error && <p className="mb-4 rounded bg-red-950 p-3 text-sm text-red-300">{error}</p>}
              {cart.items.length === 0 ? (
                <p className="text-white/50">Your cart is empty.</p>
              ) : (
                <ul className="space-y-5">
                  {cart.items.map((item) => (
                    <motion.li layout key={item.key} className="flex gap-4">
                      <div
                        className="h-20 w-20 shrink-0 rounded-lg bg-neutral-800 bg-cover bg-center"
                        style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
                      />
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-white/60">{item.lineTotal}</span>
                        <div className="mt-auto flex items-center gap-3 text-sm">
                          <button disabled={busy} onClick={() => updateItem(item.key, item.quantity - 1)} className="h-7 w-7 rounded-full border border-white/20" aria-label="Decrease">−</button>
                          <span>{item.quantity}</span>
                          <button disabled={busy} onClick={() => updateItem(item.key, item.quantity + 1)} className="h-7 w-7 rounded-full border border-white/20" aria-label="Increase">+</button>
                          <button disabled={busy} onClick={() => removeItem(item.key)} className="ml-auto text-white/50 hover:text-red-400">Remove</button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-white/10 p-6">
              <div className="mb-4 flex justify-between text-lg">
                <span>Total</span>
                <span className="font-semibold">{cart.total || "—"}</span>
              </div>
              <a
                href="/checkout"
                aria-disabled={cart.items.length === 0}
                className={`block rounded-full bg-accent py-4 text-center font-semibold text-accent-ink uppercase tracking-widest transition hover:brightness-110 ${cart.items.length === 0 ? "pointer-events-none opacity-40" : ""}`}
              >
                Checkout
              </a>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
