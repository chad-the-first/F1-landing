import "server-only";
import { mapProduct, Product } from "./woo";

// Shown when WOO_URL is not set, so the page can be designed before the store is connected.
const demoProducts: Product[] = [
  { id: 1, name: "Team Cap", slug: "team-cap", price: "$45.00", image: "", shortDescription: "Curved brim, embroidered crest." },
  { id: 2, name: "Pit Crew Jacket", slug: "pit-crew-jacket", price: "$180.00", image: "", shortDescription: "Lightweight softshell in race red." },
  { id: 3, name: "1:18 Scale Car", slug: "scale-car", price: "$220.00", image: "", shortDescription: "Die-cast replica, display case included." },
];

export async function getProducts(): Promise<Product[]> {
  "use cache";
  const base = process.env.WOO_URL;
  if (!base) return demoProducts;
  const res = await fetch(`${base}/wp-json/wc/store/v1/products?per_page=12`);
  if (!res.ok) throw new Error(`WooCommerce products request failed: ${res.status}`);
  return (await res.json()).map(mapProduct);
}
