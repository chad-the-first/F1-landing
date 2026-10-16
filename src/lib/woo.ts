export type Money = { minorUnit: number; prefix: string; suffix: string };

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  // Price in the currency's minor unit (cents), for adding up bundles.
  amount: number;
  money: Money;
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
  // Store-wide fees and discounts, e.g. the free podium in the podium bundle.
  fees: { key: string; name: string; total: string }[];
  itemCount: number;
  total: string;
};

export const emptyCart: Cart = { items: [], fees: [], itemCount: 0, total: "" };

type StorePrices = {
  price?: string;
  total_price?: string;
  line_total?: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
};

export function formatMoney(m: Money, minor: number) {
  const value = Math.abs(minor) / 10 ** m.minorUnit;
  return `${minor < 0 ? "−" : ""}${m.prefix}${value.toFixed(m.minorUnit)}${m.suffix}`;
}

const toMoney = (p: StorePrices): Money => ({ minorUnit: p.currency_minor_unit, prefix: p.currency_prefix, suffix: p.currency_suffix });

export function formatPrice(p: StorePrices, amount: string | undefined) {
  if (amount == null) return "";
  return formatMoney(toMoney(p), Number(amount));
}

const stripTags = (html: string) => html.replace(/<[^>]*>/g, "").trim();

/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: formatPrice(p.prices, p.prices?.price),
    amount: Number(p.prices?.price ?? 0),
    money: toMoney(p.prices),
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
    fees: (c.fees ?? []).map((f: any) => ({ key: f.key, name: f.name, total: formatPrice(f.totals, f.totals?.total) })),
    itemCount: c.items_count ?? 0,
    total: formatPrice(c.totals, c.totals?.total_price),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
