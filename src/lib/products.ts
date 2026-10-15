import "server-only";
import { mapProduct, Product } from "./woo";

// Shown when WOO_URL is not set, so the page can be designed before the store is connected.
// Prices are placeholders; real prices come from WooCommerce.
export const demoProducts: (Product & { cents: number })[] = [
  { id: 1, name: "Lando Norris Figure", slug: "lando-norris-figure", price: "$79.00", cents: 7900, image: "/images/figure-norris.webp", shortDescription: "2026 FW. Hungarian GP plaque on a carbon-weave base." },
  { id: 2, name: "Lewis Hamilton Figure", slug: "lewis-hamilton-figure", price: "$79.00", cents: 7900, image: "/images/figure-hamilton.webp", shortDescription: "2026 FW. Barcelona-Catalunya GP plaque on a carbon-weave base." },
  { id: 3, name: "Max Verstappen Figure", slug: "max-verstappen-figure", price: "$79.00", cents: 7900, image: "/images/figure-verstappen.webp", shortDescription: "2026 FW. Bahrain GP plaque on a carbon-weave base." },
  { id: 4, name: "MCL-40 Desk Display", slug: "mcl40-desk-display", price: "$149.00", cents: 14900, image: "/images/mcl40-display.webp", shortDescription: "Papaya race car on a kerb-striped carbon base." },
];

export async function getProducts(): Promise<Product[]> {
  "use cache";
  const base = process.env.WOO_URL;
  if (!base) return demoProducts;
  const res = await fetch(`${base}/wp-json/wc/store/v1/products?per_page=24`);
  if (!res.ok) throw new Error(`WooCommerce products request failed: ${res.status}`);
  return (await res.json()).map(mapProduct);
}
