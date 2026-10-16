"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Product } from "@/lib/woo";
import { car, drivers } from "@/lib/showcase";
import { AddToCart } from "./AddToCart";
import { CartButton } from "./CartDrawer";
import { Hero } from "./Hero";
import { FigureStack } from "./FigureStack";
import { Podium } from "./Podium";
import { PODIUM_SLUG } from "@/lib/bundle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const statement =
  "Your favourite drivers, cast in miniature. Every figure stands on a carbon-weave base traced with the circuit and lap time of a race to remember.";

export function Landing({ products }: { products: Product[] }) {
  const root = useRef<HTMLDivElement>(null);
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero intro: the helmet focuses in while the headline rises from behind a mask.
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".hero-helmet-intro", { opacity: 0, scale: 0.8, filter: "blur(16px)", duration: 1.6 })
          .from(".hero-word", { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.2)
          .from(".hero-fade", { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, 0.8);

        // Hero exit: words split apart and the helmet rushes toward the camera. Explicit start
        // values mean scrolling back up always returns the hero to its resting state.
        gsap
          .timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "+=100%", scrub: true, pin: true } })
          .fromTo(".hero-l", { xPercent: 0 }, { xPercent: -60, ease: "none" }, 0)
          .fromTo(".hero-r", { xPercent: 0 }, { xPercent: 60, ease: "none" }, 0)
          .fromTo(".hero-helmet", { scale: 1 }, { scale: 1.9, ease: "power1.in" }, 0)
          .fromTo(".hero-ui", { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.3 }, 0)
          .fromTo(".hero-helmet, .hero-title", { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.35 }, 0.65);

        gsap.to(".marquee-track", {
          xPercent: -25,
          ease: "none",
          scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: true },
        });

        // Statement lights up word by word as it scrolls through.
        gsap.fromTo(
          ".word",
          { opacity: 0.12 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".statement", start: "top 70%", end: "bottom 45%", scrub: true } },
        );

        // Driver series: pinned horizontal scroll, with parallax inside each panel.
        const track = root.current!.querySelector<HTMLElement>(".h-track")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: ".h-section", start: "top top", end: () => `+=${distance()}`, scrub: 1, pin: true, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>(".driver-panel").forEach((panel) => {
          const st = { containerAnimation: slide, trigger: panel, start: "left right", end: "right left", scrub: true };
          gsap.fromTo(panel.querySelector(".surname"), { xPercent: 25 }, { xPercent: -25, ease: "none", scrollTrigger: st });
          gsap.fromTo(panel.querySelector(".figure"), { yPercent: 8, rotate: 2 }, { yPercent: -8, rotate: -2, ease: "none", scrollTrigger: st });
        });

        // Car: the studio shot opens up from a slit as you arrive.
        gsap
          .timeline({ scrollTrigger: { trigger: ".car", start: "top 80%", end: "center center", scrub: true } })
          .fromTo(".car-frame", { clipPath: "inset(35% 40% 35% 40% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none" }, 0)
          .fromTo(".car-img", { scale: 1.35 }, { scale: 1, ease: "none" }, 0)
          .from(".car-title", { xPercent: -30, opacity: 0, ease: "none" }, 0);
        gsap.from(".car-feature", { y: 30, opacity: 0, stagger: 0.12, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".car-features", start: "top 85%" } });

        ScrollTrigger.batch(".grid-card", {
          start: "top 90%",
          onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }),
        });
      });
    },
    { scope: root },
  );

  const carProduct = bySlug.get(car.slug);

  return (
    <div ref={root} className="overflow-x-clip">
      <nav className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 mix-blend-difference md:px-12">
        <span className="font-display text-2xl tracking-wide">F1 COLLECTIBLES</span>
        <CartButton />
      </nav>

      <Hero />

      {/* Marquee */}
      <section className="marquee -rotate-2 overflow-hidden bg-accent py-4 text-accent-ink transition-colors" aria-hidden>
        <div className="marquee-track whitespace-nowrap font-display text-5xl uppercase md:text-7xl">
          {"Lights out and away we go ✦ ".repeat(8)}
        </div>
      </section>

      {/* Statement */}
      <section className="statement mx-auto max-w-6xl px-5 py-40 md:px-12 md:py-56">
        <p className="text-4xl font-medium leading-[1.15] tracking-tight md:text-6xl">
          {statement.split(" ").map((w, i) => (
            <span key={i} className="word">{w} </span>
          ))}
        </p>
      </section>

      {/* Driver series */}
      <section className="h-section relative h-[100svh] overflow-hidden" aria-label="Driver series">
        <div className="h-track flex h-full w-max">
          {drivers.map((d) => (
            <article
              key={d.slug}
              className="driver-panel relative flex h-[100svh] w-screen shrink-0 flex-col items-center justify-center gap-6 overflow-hidden px-5 md:flex-row md:gap-20 md:px-16"
              style={{ background: `radial-gradient(ellipse at 30% 50%, ${d.accent}40, transparent 65%)` }}
            >
              <span
                className="surname text-outline pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap font-display text-[34vw] leading-none md:text-[22vw]"
                style={{ "--stroke": `${d.accent}aa` } as React.CSSProperties}
                aria-hidden
              >
                {d.surname}
              </span>
              <div className="figure relative shrink-0">
                <div
                  className="pointer-events-none absolute inset-x-[10%] bottom-[2%] h-[12%] rounded-[50%] blur-2xl"
                  style={{ backgroundColor: `${d.accent}66` }}
                />
                <FigureStack item={d} sizes="(max-width: 768px) 60vw, 30vw" className="h-[50svh] md:h-[78svh]" />
              </div>
              <div className="relative max-w-md text-center md:text-left">
                <p className="text-xs uppercase tracking-[0.35em]" style={{ color: d.accent }}>{d.team} · 2026 FW</p>
                <h3 className="mt-3 font-display text-[13vw] uppercase leading-none md:text-8xl">{d.name}</h3>
                <dl className="mt-6 flex justify-center gap-8 text-sm md:justify-start">
                  <div><dt className="text-white/50">Plaque</dt><dd className="mt-1">{d.race}</dd></div>
                  <div><dt className="text-white/50">Lap</dt><dd className="mt-1 font-mono">{d.lap}</dd></div>
                </dl>
                <div className="mt-8"><AddToCart product={bySlug.get(d.slug)} accent={d.accent} /></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Podium products={products} />

      {/* Car showcase */}
      <section className="car bg-studio px-5 py-28 text-ink md:px-12 md:py-40">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
          <div className="car-frame relative aspect-[3/4] overflow-hidden rounded-3xl">
            <Image src={car.image} alt="MCL-40 papaya race car model on a kerb-striped carbon display base" fill sizes="(max-width: 768px) 100vw, 55vw" className="car-img object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#ff8000]">Desk display</p>
            <h2 className="car-title mt-3 font-display text-[22vw] leading-[0.85] md:text-[9vw]">MCL-40</h2>
            <p className="mt-6 max-w-md text-lg text-ink/70">
              The papaya car, helmet in the cockpit, parked on a carbon-weave base with red and white kerbs and a start/stop engine plaque.
            </p>
            <ul className="car-features mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {["Driver helmet in the cockpit", "Kerb-striped carbon-weave base", "Start / stop engine plaque"].map((f, i) => (
                <li key={f} className="car-feature flex items-center gap-6 py-4">
                  <span className="font-mono text-sm text-ink/40">0{i + 1}</span>
                  <span className="text-lg">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10"><AddToCart product={carProduct} accent="#ff8000" /></div>
          </div>
        </div>
      </section>

      {/* Full collection */}
      <section id="shop" className="px-5 py-32 md:px-12">
        <div className="mb-14 flex items-end justify-between gap-6">
          <h2 className="font-display text-6xl uppercase leading-none md:text-8xl">The full grid</h2>
          <span className="hidden text-sm text-white/50 md:block">{products.length} pieces</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <article key={p.id} className="grid-card group flex flex-col overflow-hidden rounded-3xl bg-white/[0.04] ring-1 ring-white/10">
              {(() => {
                const driver = drivers.find((d) => d.slug === p.slug);
                return driver ? (
                  <div
                    className="relative flex aspect-[3/4] items-end justify-center overflow-hidden pt-6"
                    style={{ background: `radial-gradient(ellipse at 50% 70%, ${driver.accent}38, transparent 70%)` }}
                  >
                    <FigureStack item={driver} sizes="(max-width: 640px) 80vw, 25vw" className="h-full" />
                  </div>
                ) : p.slug === PODIUM_SLUG ? (
                  <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_60%,color-mix(in_srgb,var(--accent-2)_25%,transparent),transparent_70%)] p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="w-full transition duration-700 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-800">
                    {p.image && (
                      <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${p.image})` }} />
                    )}
                  </div>
                );
              })()}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold">{p.name}</h3>
                  <span className="shrink-0 text-accent">{p.price}</span>
                </div>
                <p className="mt-2 flex-1 text-sm text-white/55">{p.shortDescription}</p>
                <div className="mt-5"><AddToCart product={p} accent="var(--accent)" ink="var(--accent-ink)" /></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="flex flex-col justify-between gap-4 border-t border-white/10 px-5 py-10 text-sm text-white/40 md:flex-row md:px-12">
        <span className="font-display text-lg tracking-wide text-white/70">F1 COLLECTIBLES</span>
        <span>© F1 Collectibles</span>
      </footer>
    </div>
  );
}
