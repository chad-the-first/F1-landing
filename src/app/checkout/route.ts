import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Hands the cart over to WooCommerce's own checkout. The small plugin in /wordpress
// reads the token, loads that cart into the shopper's WooCommerce session, then shows checkout.
export async function GET() {
  const base = process.env.WOO_URL;
  if (!base) return NextResponse.json({ error: "WOO_URL is not set" }, { status: 503 });
  const token = (await cookies()).get("woo_cart_token")?.value ?? "";
  return NextResponse.redirect(`${base}/?f1_cart_token=${encodeURIComponent(token)}`);
}
