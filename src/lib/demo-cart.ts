import "server-only";
import { demoProducts } from "./products";
import { BUNDLE_FIGURE_SLUGS, PODIUM_SLUG } from "./bundle";

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
    return [{ key: id, id: p.id, name: p.name, quantity, images: [{ src: p.image }], totals: { ...money, line_total: String(p.amount * quantity) } }];
  });
  // Same rule as wordpress/f1-podium-bundle.php: one podium free for every three figures.
  const qty = (slugs: string[]) =>
    items.filter((i) => slugs.includes(demoProducts.find((d) => d.id === i.id)!.slug)).reduce((n, i) => n + i.quantity, 0);
  const podium = demoProducts.find((d) => d.slug === PODIUM_SLUG)!;
  const free = Math.min(qty([PODIUM_SLUG]), Math.floor(qty(BUNDLE_FIGURE_SLUGS) / 3));
  const fees = free ? [{ key: "podium-bundle", name: "Podium bundle: podium free", totals: { ...money, total: String(-podium.amount * free) } }] : [];
  const total = items.reduce((sum, i) => sum + Number(i.totals.line_total), 0) - podium.amount * free;
  return { items, fees, items_count: items.reduce((n, i) => n + i.quantity, 0), totals: { ...money, total_price: String(total) } };
}
