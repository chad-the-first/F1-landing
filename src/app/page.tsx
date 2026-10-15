import { getProducts } from "@/lib/products";
import { Landing } from "@/components/Landing";

export default async function Home() {
  const products = await getProducts();
  return <Landing products={products} />;
}
