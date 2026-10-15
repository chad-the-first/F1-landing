import "server-only";
import { demoProducts } from "./products";

// A cookie-backed stand-in for the WooCommerce cart, used only while WOO_URL is not set,
// so the drawer can be tried before the store is connected. Responds in Store API shape.
export const DEMO_COOKIE = "demo_cart";
type Lines = Record<string, number>;

const money = { currency_minor_unit: 2, currency_prefix: "$", currency_suffix: "" };

export function parseLines(raw: string | undefined): Lines {
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function applyAction(lines: Lines, path: string, body: { id?: number; key?: string; quantity?: number }): Lines {
  const next = { ...lines };
  if (path === "cart/add-item" && body.id) next[body.id] = (next[body.id] ?? 0) + (body.quantity ?? 1);
  if (path === "cart/update-item" && body.key) next[body.key] = body.quantity ?? 0;
  if (path === "cart/remove-item" && body.key) delete next[body.key];
  for (const k of Object.keys(next)) if (next[k] <= 0) delete next[k];
  return next;
}

export function toStoreCart(lines: Lines) {
  const items = Object.entries(lines).flatMap(([id, quantity]) => {
    const p = demoProducts.find((d) => String(d.id) === id);
    if (!p) return [];
    return [{ key: id, id: p.id, name: p.name, quantity, images: [{ src: p.image }], totals: { ...money, line_total: String(p.cents * quantity) } }];
  });
  const total = items.reduce((sum, i) => sum + Number(i.totals.line_total), 0);
  return { items, items_count: items.reduce((n, i) => n + i.quantity, 0), totals: { ...money, total_price: String(total) } };
}
