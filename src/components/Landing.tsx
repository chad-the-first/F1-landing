"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Product } from "@/lib/woo";
import { useCart } from "./CartProvider";
import { CartButton } from "./CartDrawer";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Landing({ products }: { products: Product[] }) {
  const root = useRef<HTMLDivElement>(null);
  const { addItem, busy } = useCart();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero: headline letters race in, then the hero zooms and fades as you scroll away.
        gsap.from(".hero-char", { yPercent: 120, opacity: 0, stagger: 0.03, duration: 0.9, ease: "power4.out" });
        gsap.to(".hero-inner", {
          scale: 1.4,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true, pin: true },
        });

        // Speed stripes slide horizontally as the page scrolls.
        gsap.to(".stripe", {
          xPercent: (i) => (i % 2 ? 30 : -30),
          ease: "none",
          scrollTrigger: { trigger: ".stripes", start: "top bottom", end: "bottom top", scrub: true },
        });

        // Horizontal scroll through the feature panels.
        const track = root.current!.querySelector<HTMLElement>(".h-track")!;
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: ".h-section",
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        // Product cards rise in.
        gsap.from(".product-card", {
          y: 80,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".products", start: "top 75%" },
        });
      });
    },
    { scope: root },
  );

  const headline = "BUILT FOR SPEED";

  return (
    <div ref={root} className="bg-neutral-950 text-white">
      <nav className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 mix-blend-difference md:px-12">
        <span className="text-xl font-black italic tracking-tighter">F1 STORE</span>
        <CartButton />
      </nav>

      <section className="hero relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.35),transparent_60%)]" />
        <div className="hero-inner relative flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-red-500">Official merchandise</p>
          <h1 className="overflow-hidden text-6xl font-black italic leading-none tracking-tighter md:text-[8rem]" aria-label={headline}>
            {headline.split(" ").map((word, w) => (
              <span key={w} className="inline-block whitespace-nowrap px-[0.15em]" aria-hidden>
                {word.split("").map((c, i) => (
                  <span key={i} className="hero-char inline-block">{c}</span>
                ))}
              </span>
            ))}
          </h1>
          <a href="#shop" className="mt-12 rounded-full bg-red-600 px-8 py-4 font-semibold uppercase tracking-widest transition hover:bg-red-500">
            Shop the collection
          </a>
        </div>
      </section>

      <section className="stripes overflow-hidden py-24" aria-hidden>
        {["LIGHTS OUT", "AND AWAY WE GO", "LIGHTS OUT"].map((t, i) => (
          <div key={i} className="stripe whitespace-nowrap text-7xl font-black italic text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)] md:text-9xl">
            {`${t} — `.repeat(4)}
          </div>
        ))}
      </section>

      <section className="h-section h-screen overflow-hidden">
        <div className="h-track flex h-full w-max items-center gap-8 px-12">
          {[
            ["01", "Track-tested", "Materials chosen for the paddock, not the shelf."],
            ["02", "Limited runs", "Every drop is numbered. When it's gone, it's gone."],
            ["03", "Fast shipping", "Dispatched within 24 hours, tracked to your door."],
          ].map(([n, title, body]) => (
            <article key={n} className="flex h-[70vh] w-[80vw] shrink-0 flex-col justify-end rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 p-12 md:w-[50vw]">
              <span className="text-8xl font-black italic text-red-600">{n}</span>
              <h3 className="mt-4 text-4xl font-bold">{title}</h3>
              <p className="mt-3 max-w-md text-lg text-white/60">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="shop" className="products px-6 py-32 md:px-12">
        <h2 className="mb-16 text-5xl font-black italic tracking-tighter md:text-7xl">THE COLLECTION</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="product-card group overflow-hidden rounded-3xl bg-neutral-900">
              <div
                className="aspect-square bg-gradient-to-br from-neutral-800 to-red-950 bg-cover bg-center transition duration-700 group-hover:scale-105"
                style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}
              />
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <span className="text-red-500">{p.price}</span>
                </div>
                <p className="mt-2 text-sm text-white/60">{p.shortDescription}</p>
                <button
                  disabled={busy}
                  onClick={() => addItem(p.id)}
                  className="mt-6 w-full rounded-full border border-white/20 py-3 text-sm font-semibold uppercase tracking-widest transition hover:border-red-600 hover:bg-red-600 disabled:opacity-50"
                >
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-12 text-sm text-white/40 md:px-12">© F1 Store</footer>
    </div>
  );
}
