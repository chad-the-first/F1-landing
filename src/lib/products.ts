import "server-only";
import { formatMoney, mapProduct, Product } from "./woo";
import { car, drivers } from "./showcase";
import { PODIUM_SLUG } from "./bundle";

// Shown when WOO_URL is not set, so the page can be designed before the store is connected.
// Prices are placeholders; real prices come from WooCommerce.
const usd = { minorUnit: 2, prefix: "$", suffix: "" };
const demo = (id: number, name: string, slug: string, amount: number, image: string, shortDescription: string): Product => ({
  id, name, slug, amount, money: usd, price: formatMoney(usd, amount), image, shortDescription,
});

export const demoProducts: Product[] = [
  demo(1, "Lando Norris Figure", "lando-norris-figure", 7900, "/images/figure-norris.webp", "Hand painted, 2026 FW. Hungarian GP plaque on a real carbon fiber base."),
  demo(2, "Lewis Hamilton Figure", "lewis-hamilton-figure", 7900, "/images/figure-hamilton.webp", "Hand painted, 2026 FW. Barcelona-Catalunya GP plaque on a real carbon fiber base."),
  demo(3, "Max Verstappen Figure", "max-verstappen-figure", 7900, "/images/figure-verstappen.webp", "Hand painted, 2026 FW. Bahrain GP plaque on a real carbon fiber base."),
  demo(4, "MCL-40 Desk Display", "mcl40-desk-display", 14900, "/images/mcl40-display.webp", "Hand-painted papaya race car on a real carbon fiber kerb base. USB-C rechargeable lights."),
  demo(5, "Podium Display", "podium-display", 4900, "/images/podium.webp", "Three-step real carbon fiber podium for your figures. Free with any three figures."),
];

// Only the products this page features are shown, in this order; the rest of the store's catalogue is left out.
const PAGE_SLUGS = [...drivers.map((d) => d.slug), car.slug, PODIUM_SLUG];

export async function getProducts(): Promise<Product[]> {
  "use cache";
  const base = process.env.WOO_URL;
  if (!base) return demoProducts;
  // If the store is down or answers with an error page, show the page without products (their buttons
  // read "Coming soon") rather than failing the deploy; the cached result is retried after 15 minutes.
  try {
    const res = await fetch(`${base}/wp-json/wc/store/v1/products?slug=${PAGE_SLUGS.join(",")}&per_page=100`);
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    // Filtered here too, in case an older store ignores the slug filter and returns everything.
    const products: Product[] = JSON.parse(text).map(mapProduct);
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    return PAGE_SLUGS.flatMap((slug) => bySlug.get(slug) ?? []);
  } catch (e) {
    console.error("WooCommerce products request failed:", e instanceof Error ? e.message : e);
    return [];
  }
}
