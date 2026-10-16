# F1 landing page

A Next.js landing page with scroll animations and an on-page cart, backed by your WooCommerce store.

- **Animations:** GSAP ScrollTrigger (pinned hero, horizontal scroll, product reveals), Lenis smooth scrolling, Motion for the cart drawer. Respects reduced-motion.
- **Products:** read from the WooCommerce Store API, refreshed every 15 minutes. Until `WOO_URL` is set, demo products and a demo cart are used so the page can be tried end to end.
- **Team themes:** the hero lets visitors pick McLaren, Ferrari or Red Bull. The helmet swaps and the site's accent colours change; the choice is remembered on their device. Colours are in `src/app/globals.css` under `[data-team]`, and helmets in `src/lib/showcase.ts`.
- **Featured items:** the hero, driver series and MCL-40 sections are set up in `src/lib/showcase.ts`. Each item's `slug` must match the product's slug in WooCommerce so its Add to cart button uses the real product and price.
- **Cart:** slide-out drawer. The browser talks to `/api/cart/*` on this site, which forwards to the Store API and keeps the cart token in an httpOnly cookie.
- **Checkout:** `/checkout` sends the shopper to WooCommerce's own checkout, carrying the cart over.

## Run it

```bash
cp .env.example .env.local   # set WOO_URL to your WordPress site
npm install
npm run dev
```

## WordPress side

Copy `wordpress/f1-cart-handoff.php` to `wp-content/mu-plugins/` on your WordPress site. It loads the landing page's cart into WooCommerce before showing checkout. Test this step on a staging site first.

## Deploy

Push to GitHub and import the repo in Vercel. Add `WOO_URL` as an environment variable.
