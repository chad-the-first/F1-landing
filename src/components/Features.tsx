"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import norrisThumb from "../../public/images/norris-helmet-thumb.webp";
import hamiltonThumb from "../../public/images/hamilton-helmet-thumb.webp";
import verstappenThumb from "../../public/images/verstappen-helmet-thumb.webp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HELMETS = [norrisThumb, hamiltonThumb, verstappenThumb];

const FEATURES = [
  {
    k: "Modular",
    t: "Any helmet. Any driver. Any car.",
    d: "Every helmet fits every driver figure and every car, so you can swap them around and build the line-up you want.",
    wide: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h11m0 0-3.5-3.5M15 7l-3.5 3.5M20 17H9m0 0 3.5-3.5M9 17l3.5 3.5" />
      </svg>
    ),
  },
  {
    k: "Key station",
    t: "Your keys finally have a home.",
    d: "Every piece doubles as a key station, so your keys land in the same place every time and stop going missing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="15" r="4.5" />
        <path d="m11.2 11.8 8.3-8.3M16.5 6.5l2.5 2.5M14 9l2 2" />
      </svg>
    ),
  },
  {
    k: "Hand painted",
    t: "No two are alike.",
    d: "Each piece is painted by hand, so the one you unbox is 100% unique.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.5 3.5a2.1 2.1 0 0 1 3 3L12 16l-4-4z" />
        <path d="M8 12c-2.5 0-4 1.6-4 4 0 1.8-.8 2.8-2 3.5 4.5.9 9-.5 10-3.5z" />
      </svg>
    ),
  },
  {
    k: "Real carbon fiber",
    t: "Built on the real thing.",
    d: "The base is made with real carbon fiber plates, the same kind of material the race cars are built from.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2.5" />
        <path d="M3 9h6V3M9 21v-6h6v6M15 3v6h6M3 15h6M15 15h6" />
      </svg>
    ),
  },
  {
    k: "USB-C rechargeable",
    t: "Charge it. Forget it for weeks.",
    d: "The lights run on a USB-C rechargeable battery, and one charge lasts for weeks.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="7" width="17" height="10" rx="2.5" />
        <path d="M22 10.5v3" />
        <path d="m11.5 8.8-2.5 3.7h4l-2.5 3.7" />
      </svg>
    ),
  },
  {
    k: "Ships worldwide",
    t: "Wherever you race from, we deliver.",
    d: "We ship internationally with DHL, so you can order from anywhere in the world. Most orders arrive in about two weeks.",
    full: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
      </svg>
    ),
  },
];

// The reasons the pieces earn their spot on a desk, rising in as the section scrolls into view.
export function Features() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".feat-card",
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 55%", scrub: 0.5 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-5 pb-32 md:px-12 md:pb-44" aria-labelledby="features-title">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.35em] text-accent">More than a model</p>
        <h2 id="features-title" className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[0.95] md:text-7xl">
          Made to live on your desk
        </h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li
              key={f.k}
              className={`feat-card group relative overflow-hidden rounded-3xl bg-white/[0.04] p-7 ring-1 ring-white/10 ${f.wide ? "sm:col-span-2 md:flex md:items-center md:gap-10" : ""} ${f.full ? "sm:col-span-full md:flex md:items-center md:gap-10" : ""}`}
            >
              <span className="feat-glow" aria-hidden />
              <div className="relative md:flex-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-ink [&>svg]:h-6 [&>svg]:w-6">
                  {f.icon}
                </span>
                <p className="mt-8 text-xs uppercase tracking-[0.3em] text-accent">{f.k}</p>
                <h3 className="mt-2 text-2xl font-semibold leading-tight">{f.t}</h3>
                <p className="mt-3 text-white/60">{f.d}</p>
              </div>
              {/* Quick shipping facts, so the promise reads at a glance. */}
              {f.full && (
                <ul className="relative mt-8 flex flex-wrap gap-2 text-xs uppercase tracking-widest text-white/80 md:mt-0 md:shrink-0">
                  {["Worldwide", "DHL", "About 2 weeks"].map((c) => (
                    <li key={c} className="rounded-full border border-white/20 px-3 py-2">
                      {c}
                    </li>
                  ))}
                </ul>
              )}
              {/* The three helmets taking turns in the spotlight, to show they're interchangeable. */}
              {f.wide && (
                <div className="feat-swap relative mt-8 flex shrink-0 items-end justify-center gap-3 md:mt-0" aria-hidden>
                  {HELMETS.map((h, i) => (
                    <span key={i} className="feat-swap-helmet relative h-24 w-20 md:h-32 md:w-28" style={{ animationDelay: `${i * 1.2}s` }}>
                      <Image src={h} alt="" fill sizes="112px" className="object-contain" />
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
