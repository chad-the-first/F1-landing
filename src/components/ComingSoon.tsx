"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import helmet1 from "../../public/images/soon/helmet-1.webp";
import helmet2 from "../../public/images/soon/helmet-2.webp";
import helmet3 from "../../public/images/soon/helmet-3.webp";
import carShape from "../../public/images/soon/car.webp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Unknown helmets waiting in the dark, each lit from behind in a colour that isn't on the grid yet.
const HELMETS = [
  { src: helmet2, rim: "#27f4d2", x: "-112%", scale: 0.86, flip: true },
  { src: helmet1, rim: "#ffffff", x: "0%", scale: 1, flip: false },
  { src: helmet3, rim: "#c0a2ff", x: "112%", scale: 0.86, flip: false },
];

// After the driver series: a start-light gantry fills as you scroll in, then it's lights out and the
// next helmets are revealed as silhouettes.
export function HelmetsSoon() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 45%", scrub: 0.5 },
        });
        tl.fromTo(".hs-lamp", { opacity: 0.12 }, { opacity: 1, duration: 0.2, stagger: 0.3 }, 0)
          // Lights out: the gantry goes dark and the headline drops in.
          .to(".hs-lamp", { opacity: 0.12, duration: 0.08 }, 1.7)
          .fromTo(".hs-word", { yPercent: 110 }, { yPercent: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" }, 1.75)
          .fromTo(".hs-helmet", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" }, 1.8)
          .fromTo(".hs-fade", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 2.1);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="soon-helmets relative overflow-hidden px-5 py-28 md:px-12 md:py-36" aria-label="More helmets coming soon">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">Next on the grid</p>

        <div className="hs-gantry mt-8" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="hs-pod">
              <span className="hs-lamp" />
              <span className="hs-lamp" />
            </span>
          ))}
        </div>

        <h2 className="mt-10 font-display text-[15vw] uppercase leading-[0.9] md:text-[8.5vw]">
          {["More", "helmets"].map((w) => (
            <span key={w} className="inline-block overflow-hidden align-bottom">
              <span className="hs-word mr-[0.2em] inline-block">{w}</span>
            </span>
          ))}
          <br />
          <span className="inline-block overflow-hidden align-bottom">
            <span className="hs-word inline-block text-accent">incoming</span>
          </span>
        </h2>

        <div className="relative mt-14 h-[34vw] w-full max-w-3xl md:h-[22vw] md:max-h-[300px]" aria-hidden>
          <div className="hs-fog" />
          {HELMETS.map((h, i) => (
            <div
              key={i}
              className="hs-helmet absolute bottom-0 left-1/2 h-full"
              style={{ "--rim": h.rim, aspectRatio: `${h.src.width} / ${h.src.height}`, transform: `translateX(calc(-50% + ${h.x}))` } as React.CSSProperties}
            >
              <div className="hs-float h-full w-full" style={{ animationDelay: `${-i * 1.3}s`, scale: h.scale, transformOrigin: "50% 100%" }}>
                <Image src={h.src} alt="" fill sizes="(max-width: 768px) 30vw, 220px" className={`hs-shape object-contain ${h.flip ? "-scale-x-100" : ""}`} />
                <span className="hs-q">?</span>
              </div>
            </div>
          ))}
          <div className="hs-sweep" />
        </div>

        <p className="hs-fade mt-12 max-w-md text-white/60">
          More drivers and their helmets are on their way to the grid. Keep your eyes on the lights.
        </p>
        <p className="hs-fade mt-6 inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] ring-1 ring-white/15">
          <span className="hs-blink h-2 w-2 rounded-full bg-accent" aria-hidden />
          Coming soon
        </p>
      </div>
    </section>
  );
}

// After the car: a garage door rolls up as you scroll, light spills out underneath, and the next car
// waits inside as a silhouette.
export function CarsSoon() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 80%", scrub: 0.6 },
          })
          .fromTo(".cg-door", { yPercent: 0 }, { yPercent: -58, duration: 1 }, 0)
          .fromTo(".cg-spill", { opacity: 0.35, scaleY: 0.4 }, { opacity: 1, scaleY: 1, duration: 1 }, 0)
          .fromTo(".cg-car", { x: "6%" }, { x: "0%", duration: 1, ease: "power1.out" }, 0)
          .fromTo(".cg-word", { yPercent: 110 }, { yPercent: 0, duration: 0.3, stagger: 0.06, ease: "power3.out" }, 0.15)
          .fromTo(".cg-fade", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.45);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="soon-cars relative overflow-hidden px-5 py-28 md:px-12 md:py-36" aria-label="More cars coming soon">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_1.25fr] md:gap-16">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#ff8000]">In the garage</p>
          <h2 className="mt-5 font-display text-[15vw] uppercase leading-[0.9] md:text-[6.5vw]">
            {["More", "cars"].map((w) => (
              <span key={w} className="inline-block overflow-hidden align-bottom">
                <span className="cg-word mr-[0.2em] inline-block">{w}</span>
              </span>
            ))}
            <br />
            <span className="inline-block overflow-hidden align-bottom">
              <span className="cg-word inline-block text-[#ff8000]">coming soon</span>
            </span>
          </h2>
          <p className="cg-fade mt-6 max-w-sm text-white/60">
            The next desk displays are waiting behind this door. Keep a space on your desk.
          </p>
        </div>

        <div className="cg-bay relative aspect-[16/10] w-full overflow-hidden rounded-[28px] ring-1 ring-white/10" aria-hidden>
          <div className="cg-inside absolute inset-0" />
          <div className="cg-car absolute inset-x-[8%] bottom-[16%]" style={{ aspectRatio: `${carShape.width} / ${carShape.height}` }}>
            <Image src={carShape} alt="" fill sizes="(max-width: 768px) 80vw, 560px" className="cg-shape object-contain" />
          </div>
          <span className="cg-q">?</span>
          <div className="cg-door absolute inset-x-0 top-0 h-full">
            <div className="cg-spill" />
          </div>
          <span className="cg-tag">Bay 02 · Coming soon</span>
        </div>
      </div>
    </section>
  );
}
