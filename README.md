# F1 landing page

A Next.js landing page with scroll animations and an on-page cart, backed by your WooCommerce store.

- **Animations:** GSAP ScrollTrigger (pinned hero, horizontal scroll, product reveals), Lenis smooth scrolling, Motion for the cart drawer. Respects reduced-motion.
- **Products:** read from the WooCommerce Store API, refreshed every 15 minutes. Until `WOO_URL` is set, demo products and a demo cart are used so the page can be tried end to end.
- **Team themes:** the hero lets visitors pick McLaren, Ferrari or Red Bull. The helmet swaps and the site's accent colours change; the choice is remembered on their device. Colours are in `src/app/globals.css` under `[data-team]`, and helmets in `src/lib/showcase.ts`.
- **Driver figures:** each figure is two transparent layers on the same frame, `<driver>-body.webp` and `<driver>-helmet.webp` in `public/images`. The helmet floats above the body; hovering with a mouse drops it onto the neck. `seat` in `src/lib/showcase.ts` sets how far it drops.
- **Featured items:** the hero, driver series and MCL-40 sections are set up in `src/lib/showcase.ts`. Each item's `slug` must match the product's slug in WooCommerce so its Add to cart button uses the real product and price.
- **Podium bundle:** after the driver series, visitors pick any three figures (repeats allowed), see them on the podium, and swap places by dragging or tapping two figures. Adding the bundle puts the three figures and the podium in the cart, and the store makes the podium free. The podium's product slug is `podium-display` (set in `src/lib/bundle.ts`); its step images are `public/images/podium-p1/p2/p3.webp`.
- **Cart:** slide-out drawer. The browser talks to `/api/cart/*` on this site, which forwards to the Store API and keeps the cart token in an httpOnly cookie.
- **Checkout:** `/checkout` sends the shopper to WooCommerce's own checkout, carrying the cart over.

## Run it

```bash
cp .env.example .env.local   # set WOO_URL to your WordPress site
npm install
npm run dev
```

## Connecting the store

How the cart reaches checkout: the browser only ever talks to this site. `/api/cart/*` forwards each
cart change to the WooCommerce Store API from the server and keeps the cart's token in an httpOnly
cookie on this site. **Checkout** sends the shopper to `WOO_URL/?f1_cart_token=…`, where the
`f1-cart-handoff.php` plugin loads that cart into their WooCommerce session and shows WooCommerce's
own checkout. Because the browser never calls WordPress directly, no CORS settings or shared cookies
are needed, and the two sites can live on different domains or subdomains.

1. **WordPress:** WooCommerce up to date (9.x or later), HTTPS on, and Settings → Permalinks set to
   anything except "Plain" (the Store API lives at `/wp-json/`). Turn off WooCommerce's "Coming soon"
   mode once you're ready to sell. If a security plugin or firewall blocks `/wp-json/wc/store/`, allow it.
2. **Plugins:** copy both files in `wordpress/` to `wp-content/mu-plugins/` (create the folder if needed).
   Must-use plugins run automatically; they show under Plugins → Must-Use.
   - `f1-cart-handoff.php` loads the landing page's cart into WooCommerce before showing checkout, and
     empties the landing page's cart once an order is placed.
   - `f1-podium-bundle.php` takes the podium's price off once for every three driver figures in the cart.
3. **Products:** each featured product is matched by its WooCommerce **slug** (the product's URL name),
   not its ID. IDs and prices come from the store automatically. The products must be published, have a
   price, and be in stock. Slugs used by the page:
   - `lando-norris-figure`, `lewis-hamilton-figure`, `max-verstappen-figure` (`src/lib/showcase.ts`, `src/lib/bundle.ts`)
   - `mcl40-desk-display` (`src/lib/showcase.ts`)
   - `podium-display` (`src/lib/bundle.ts`, and the top of `wordpress/f1-podium-bundle.php`)
   To use other slugs, change them in those files. "The full grid" lists the first 24 published products.
4. **Vercel:** Project → Settings → Environment Variables → add `WOO_URL` = your WordPress address exactly
   as in WordPress Settings → General → Site Address, with `https://` and no trailing slash. Then redeploy
   (environment changes only apply to new deployments). The store must be reachable while Vercel builds,
   since products are read at build time and then refreshed every 15 minutes.
5. **Domains:** add the landing page's domain or subdomain in Vercel → Settings → Domains and create the
   DNS record Vercel shows at your registrar. WordPress keeps its own address; `WOO_URL` points at it.
6. **Test:** on the live page, add a figure, open the cart and press Checkout. WooCommerce's checkout should
   show the same items and total (with the podium free when three figures and a podium are in the cart).
   Place a test order (e.g. with "Cash on delivery" or your payment plugin's test mode), then go back to the
   landing page: the cart should be empty.
   - Checkout opens empty: WooCommerce is too old for the handoff, or the plugin isn't in `mu-plugins`.
   - A product's button says "Coming soon" instead of Add to cart: its slug doesn't match, or it isn't published.

## Deploy

Push to GitHub and import the repo in Vercel. Add `WOO_URL` as an environment variable (see above).
