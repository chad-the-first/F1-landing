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

## WordPress side

Copy both files in `wordpress/` to `wp-content/mu-plugins/` on your WordPress site. Test them on a staging site first.

- `f1-cart-handoff.php` loads the landing page's cart into WooCommerce before showing checkout.
- `f1-podium-bundle.php` takes the podium's price off once for every three driver figures in the cart. It needs a product with the slug `podium-display`, and the figure slugs listed at the top of the file.

## Deploy

Push to GitHub and import the repo in Vercel. Add `WOO_URL` as an environment variable.
