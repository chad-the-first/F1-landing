export type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
  shortDescription: string;
};

export type CartItem = {
  key: string;
  id: number;
  name: string;
  quantity: number;
  image: string;
  lineTotal: string;
};

export type Cart = {
  items: CartItem[];
  itemCount: number;
  total: string;
};

export const emptyCart: Cart = { items: [], itemCount: 0, total: "" };

type StorePrices = {
  price?: string;
  total_price?: string;
  line_total?: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
};

export function formatPrice(p: StorePrices, amount: string | undefined) {
  if (amount == null) return "";
  const value = Number(amount) / 10 ** p.currency_minor_unit;
  return `${p.currency_prefix}${value.toFixed(p.currency_minor_unit)}${p.currency_suffix}`;
}

const stripTags = (html: string) => html.replace(/<[^>]*>/g, "").trim();

/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: formatPrice(p.prices, p.prices?.price),
    image: p.images?.[0]?.src ?? "",
    shortDescription: stripTags(p.short_description ?? ""),
  };
}

export function mapCart(c: any): Cart {
  return {
    items: (c.items ?? []).map((i: any) => ({
      key: i.key,
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      image: i.images?.[0]?.thumbnail ?? i.images?.[0]?.src ?? "",
      lineTotal: formatPrice(i.totals, i.totals?.line_total),
    })),
    itemCount: c.items_count ?? 0,
    total: formatPrice(c.totals, c.totals?.total_price),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
