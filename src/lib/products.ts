import "server-only";
import { formatMoney, mapProduct, Product } from "./woo";

// Shown when WOO_URL is not set, so the page can be designed before the store is connected.
// Prices are placeholders; real prices come from WooCommerce.
const usd = { minorUnit: 2, prefix: "$", suffix: "" };
const demo = (id: number, name: string, slug: string, amount: number, image: string, shortDescription: string): Product => ({
  id, name, slug, amount, money: usd, price: formatMoney(usd, amount), image, shortDescription,
});

export const demoProducts: Product[] = [
  demo(1, "Lando Norris Figure", "lando-norris-figure", 7900, "/images/figure-norris.webp", "2026 FW. Hungarian GP plaque on a carbon-weave base."),
  demo(2, "Lewis Hamilton Figure", "lewis-hamilton-figure", 7900, "/images/figure-hamilton.webp", "2026 FW. Barcelona-Catalunya GP plaque on a carbon-weave base."),
  demo(3, "Max Verstappen Figure", "max-verstappen-figure", 7900, "/images/figure-verstappen.webp", "2026 FW. Bahrain GP plaque on a carbon-weave base."),
  demo(4, "MCL-40 Desk Display", "mcl40-desk-display", 14900, "/images/mcl40-display.webp", "Papaya race car on a kerb-striped carbon base."),
  demo(5, "Podium Display", "podium-display", 4900, "/images/podium.webp", "Three-step carbon-weave podium for your figures. Free with any three figures."),
];

export async function getProducts(): Promise<Product[]> {
  "use cache";
  const base = process.env.WOO_URL;
  if (!base) return demoProducts;
  const res = await fetch(`${base}/wp-json/wc/store/v1/products?per_page=24`);
  if (!res.ok) throw new Error(`WooCommerce products request failed: ${res.status}`);
  return (await res.json()).map(mapProduct);
}
