import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Proxies the WooCommerce Store API cart so the browser only ever talks to this domain.
// The Store API identifies the cart by a Cart-Token header, which we keep in an httpOnly cookie.
const TOKEN_COOKIE = "woo_cart_token";
const ALLOWED = new Set(["cart", "cart/add-item", "cart/update-item", "cart/remove-item"]);

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const base = process.env.WOO_URL;
  if (!base) return NextResponse.json({ error: "WOO_URL is not set" }, { status: 503 });

  const path = ["cart", ...(await params).path.filter((p) => p !== "cart")].join("/");
  if (!ALLOWED.has(path)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const jar = await cookies();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = jar.get(TOKEN_COOKIE)?.value;
  if (token) headers["Cart-Token"] = token;

  const upstream = await fetch(`${base}/wp-json/wc/store/v1/${path}`, {
    method: req.method,
    headers,
    body: req.method === "GET" ? undefined : await req.text(),
    cache: "no-store",
  });

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
  const newToken = upstream.headers.get("Cart-Token");
  if (newToken && newToken !== token) {
    res.cookies.set(TOKEN_COOKIE, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 2,
    });
  }
  return res;
}

export { proxy as GET, proxy as POST };
