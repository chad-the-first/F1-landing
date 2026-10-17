"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Product } from "@/lib/woo";
import { AddToCart } from "./AddToCart";
import carImg from "../../public/images/car/car.webp";
import bodyImg from "../../public/images/car/exploded-body.webp";
import sideImg from "../../public/images/car/side.webp";
import sideRear from "../../public/images/car/side-wheel-rear.webp";
import sideFront from "../../public/images/car/side-wheel-front.webp";
import wheelRL from "../../public/images/car/wheel-rl.webp";
import wheelRR from "../../public/images/car/wheel-rr.webp";
import wheelFL from "../../public/images/car/wheel-fl.webp";
import wheelFR from "../../public/images/car/wheel-fr.webp";
import sceneBase from "../../public/images/car/base/scene-base.webp";
import sceneCar from "../../public/images/car/base/scene-car.webp";
import sceneFront from "../../public/images/car/base/scene-front.webp";
import helmetImg from "../../public/images/car/base/helmet.webp";
import visorImg from "../../public/images/car/base/visor-lit.webp";
import kerbLight from "../../public/images/car/base/kerb-light.webp";
import buttonLight from "../../public/images/car/base/button-light.webp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The stage is a 1850x920 frame shared by the assembled car (car.webp), the wheel-less body and the
// four wheels cut from the "wheels detached" photo. Each wheel sits at its detached spot (left/top/
// width/height, % of the stage); dx/dy (% of the stage) and scale move it onto its hub on the car.
// Back-to-front order: the far-side wheels sit behind the body, the near-side wheels in front.
const STAGE = { w: 1850, h: 920 };
const WHEELS = [
  { id: "rr", src: wheelRR, left: 56.22, top: 16.52, width: 13.73, height: 26.74, dx: -10.22, dy: 3.7, scale: 0.846, front: false },
  { id: "fr", src: wheelFR, left: 83.73, top: 40.87, width: 14.05, height: 33.37, dx: -12.24, dy: 7.88, scale: 0.938, front: false },
  { id: "rl", src: wheelRL, left: 2.0, top: 28.26, width: 13.08, height: 30.98, dx: 9.16, dy: -1.14, scale: 0.982, front: true },
  { id: "fl", src: wheelFL, left: 20.32, top: 56.52, width: 13.46, height: 34.46, dx: 12.51, dy: -1.03, scale: 0.902, front: true },
];
const centre = (w: (typeof WHEELS)[number]) => ({ x: w.left + w.width / 2, y: w.top + w.height / 2 });
const hub = (w: (typeof WHEELS)[number]) => ({ x: centre(w).x + w.dx, y: centre(w).y + w.dy });

// Side view (1792x565) placed on the stage, and its two wheels (% of the side image), which spin as it drives in.
const SIDE = { left: 3.5, top: 35, width: 93 };
const SIDE_WHEELS = [
  { id: "rear", src: sideRear, left: 4.52, top: 50.97 },
  { id: "front", src: sideFront, left: 71.71, top: 51.68 },
];
const SIDE_WHEEL = { width: 13.616, height: 43.186 };
// Wheel radius in stage px, for rolling without sliding: degrees turned = distance / radius.
const ROLL = (122 * ((SIDE.width / 100) * STAGE.w)) / 1792;

// Speed streaks behind the car while it drives in. Fixed values so server and client match.
const STREAKS = [
  [12, 0.0, 38], [22, 0.35, 22], [31, 0.7, 30], [43, 0.15, 46], [51, 0.55, 26], [58, 0.9, 34],
  [66, 0.25, 50], [72, 0.6, 24], [79, 0.05, 40], [86, 0.45, 28], [91, 0.8, 36],
] as const;

// The car on its base, from the "car on base" photo (a 1720x1140 crop). It sits centred on the stage at
// full height. The base on its own and the helmet are lined up to that photo; everything below is % of it.
const SCENE = { w: 1720, h: 1140, width: 75.03 };
const HELMET = { left: 34.767, top: 3.947, width: 24.477, height: 45.351 };
// The halo's front bar and the car below it, layered over the helmet so it slides in behind them.
const FRONT = { left: 29.07, top: 35.088, width: 37.209, height: 35.088 };
const BUTTON = { left: 81.395, top: 57.018, width: 16.279, height: 24.561, cx: 89.36, cy: 69.035, r: 6.86 };
// Where the three-quarter car (scaled about the stage centre) lines up with the car on the base.
const LAND = { scale: 0.637, xPercent: -4.1, yPercent: -7.57 };
// Timeline time at which the helmet is seated and the lights come on.
const SEATED = 11.95;

const CAPTIONS = [
  { k: "Lights out", t: "The papaya #1 car, in miniature.", d: "Halo, T-cam, front and rear wings, and the full papaya and black livery." },
  { k: "Magnetic wheels", t: "Pull a wheel. It comes right off.", d: "All four wheels are detachable and held on by magnets." },
  { k: "Click", t: "Bring it close and it snaps back.", d: "Line a wheel up with its hub and the magnet does the rest." },
  { k: "The base", t: "Parked on carbon, between the kerbs.", d: "A carbon-weave display base with red and white kerbs and a start/stop engine button." },
  { k: "Start engine", t: "Helmet in. Lights on.", d: "Press START ENGINE STOP on the base to switch the kerb lights and the visor on and off." },
];

export function CarShowcase({ product }: { product?: Product }) {
  const root = useRef<HTMLElement>(null);
  // The lights need the helmet seated (driven by the scroll) and the engine switched on (the button).
  const [seated, setSeated] = useState(false);
  const [power, setPower] = useState(true);
  const [pressed, setPressed] = useState(false);
  const lit = seated && power;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const sideTravel = 135; // % of the side car's width it travels in from off-stage left
        const travelPx = (sideTravel / 100) * (SIDE.width / 100) * STAGE.w;
        const drive = { duration: 2.4, ease: "power3.out" };

        gsap.set(".cs-exploded, .cs-mag, .cs-wire, .cs-cap-1, .cs-cap-2, .cs-cap-3, .cs-cap-4, .cs-final", { autoAlpha: 0 });
        gsap.set(".cs-base, .cs-scene-car, .cs-front, .cs-helmet", { autoAlpha: 0 });
        gsap.set(".cs-turn", { autoAlpha: 0 });
        WHEELS.forEach((w) =>
          gsap.set(`.cs-wheel-${w.id}`, { xPercent: (w.dx / w.width) * 100, yPercent: (w.dy / w.height) * 100, scale: w.scale }),
        );

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=560%", scrub: 0.6, pin: true, anticipatePin: 1 },
          onUpdate: () => setSeated(tl.time() >= SEATED),
        });

        // 1. Drive in: the car brakes to a stop, wheels rolling, streaks and ghost trails fading.
        tl.fromTo(".cs-side", { xPercent: -sideTravel }, { xPercent: 0, ...drive }, 0)
          .fromTo(".cs-spin", { rotate: (-travelPx / ROLL) * (180 / Math.PI) }, { rotate: 0, ...drive }, 0)
          .fromTo(".cs-ghost-1", { xPercent: -9 }, { xPercent: 0, ...drive }, 0)
          .fromTo(".cs-ghost-2", { xPercent: -18 }, { xPercent: 0, ...drive }, 0)
          .fromTo(".cs-ghost", { autoAlpha: 0.35 }, { autoAlpha: 0, ...drive }, 0)
          .fromTo(".cs-streaks", { autoAlpha: 1 }, { autoAlpha: 0, duration: 2.2, ease: "power2.in" }, 0)
          // Weight shifts onto the nose as it stops, then settles.
          .to(".cs-side-body", { rotate: 1.2, duration: 0.35, ease: "power2.out" }, 2.0)
          .to(".cs-side-body", { rotate: 0, duration: 0.5, ease: "back.out(3)" }, 2.35)
          .fromTo(".cs-word", { xPercent: 10 }, { xPercent: -40, duration: 10 }, 0)

          // 2. The camera swings round to three-quarters, behind a light sweep.
          .to(".cs-side", { xPercent: -12, scale: 0.92, autoAlpha: 0, filter: "blur(10px)", duration: 0.8, ease: "power2.in" }, 3.0)
          .fromTo(".cs-turn", { autoAlpha: 0, scale: 1.12, xPercent: 8, filter: "blur(14px)" }, { autoAlpha: 1, scale: 1, xPercent: 0, filter: "blur(0px)", duration: 0.9, ease: "power2.out" }, 3.45)
          .fromTo(".cs-sweep-band", { xPercent: 0 }, { xPercent: 450, duration: 1.3, ease: "power1.inOut" }, 3.3)
          .to(".cs-cap-0", { autoAlpha: 0, y: -16, duration: 0.4 }, 3.0)
          .fromTo(".cs-cap-1", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 3.9)

          // 3. Wheels off: a flash at each hub hides the swap to the layered car, then the wheels pull away.
          .set(".cs-burst", { scale: 0.2, autoAlpha: 1 }, 4.6)
          .to(".cs-burst", { scale: 1.8, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, 4.6)
          .to(".cs-car", { autoAlpha: 0, duration: 0.15 }, 4.65)
          .to(".cs-exploded", { autoAlpha: 1, duration: 0.15 }, 4.6)
          .to(".cs-shake", { x: 4, duration: 0.05, repeat: 3, yoyo: true }, 4.6)
          .to(".cs-wheel", { xPercent: 0, yPercent: 0, scale: 1, duration: 1.4, ease: "power3.out", stagger: 0.08 }, 4.7)
          .to(".cs-wire", { autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 5.1)
          .to(".cs-mag", { autoAlpha: 1, duration: 0.5 }, 5.0)

          // 4. Hold, then the magnets pull them back: accelerating in, a snap, a jolt and the real car again.
          .to(".cs-cap-1", { autoAlpha: 0, y: -16, duration: 0.4 }, 6.6)
          .fromTo(".cs-cap-2", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 6.8)
          .to(".cs-wire", { autoAlpha: 0, duration: 0.6 }, 7.0)
          .to(".cs-mag", { scale: 0.6, duration: 1.2, ease: "power2.in" }, 7.0);
        WHEELS.forEach((w, i) =>
          tl.to(
            `.cs-wheel-${w.id}`,
            { xPercent: (w.dx / w.width) * 100, yPercent: (w.dy / w.height) * 100, scale: w.scale, duration: 1.2, ease: "power4.in" },
            7.0 + i * 0.05,
          ),
        );
        tl.to(".cs-mag", { autoAlpha: 0, duration: 0.2 }, 8.3)
          .set(".cs-burst", { scale: 0.2, autoAlpha: 1 }, 8.3)
          .to(".cs-burst", { scale: 2.2, autoAlpha: 0, duration: 0.6, ease: "power2.out" }, 8.3)
          .to(".cs-shake", { y: 6, duration: 0.05, repeat: 3, yoyo: true }, 8.3)
          .to(".cs-car", { autoAlpha: 1, duration: 0.15 }, 8.35)
          .to(".cs-exploded", { autoAlpha: 0, duration: 0.15 }, 8.4)
          .fromTo(".cs-sweep-band", { xPercent: 0 }, { xPercent: 450, duration: 1.1, ease: "power1.inOut", immediateRender: false }, 8.5)

          // 5. The camera pulls back as the base rises out of the floor; the car hovers over it, then drops on.
          .to(".cs-cap-2", { autoAlpha: 0, y: -16, duration: 0.4 }, 8.9)
          .to(".cs-turn", { scale: LAND.scale, xPercent: LAND.xPercent, yPercent: LAND.yPercent - 22, duration: 1.1, ease: "power2.inOut" }, 8.9)
          .fromTo(".cs-base", { autoAlpha: 0, yPercent: 45 }, { autoAlpha: 1, yPercent: 0, duration: 1.0, ease: "power3.out" }, 9.0)
          .to(".cs-turn", { yPercent: LAND.yPercent, duration: 0.45, ease: "power3.in" }, 10.0)
          // Touchdown: a flash across the plate hides the swap to the photo of the car on its base.
          .set(".cs-land", { scaleX: 0.3, autoAlpha: 1 }, 10.45)
          .to(".cs-land", { scaleX: 1.6, autoAlpha: 0, duration: 0.6, ease: "power2.out" }, 10.45)
          .to(".cs-shake", { y: 7, duration: 0.05, repeat: 3, yoyo: true }, 10.45)
          .to(".cs-scene-car, .cs-front", { autoAlpha: 1, duration: 0.12 }, 10.45)
          .to(".cs-turn", { autoAlpha: 0, duration: 0.12 }, 10.5)
          .to(".cs-base", { autoAlpha: 0, duration: 0.01 }, 10.6)
          .fromTo(".cs-cap-3", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 10.6)

          // 6. The helmet drops in from above and slides down behind the halo into the cockpit.
          .fromTo(".cs-helmet", { autoAlpha: 1, yPercent: -150, rotate: -10 }, { yPercent: 0, rotate: 0, duration: 1.0, ease: "power2.in", immediateRender: false }, 10.9)
          .set(".cs-helmet", { autoAlpha: 0 }, 10.89)
          .to(".cs-helmet", { yPercent: -4, duration: 0.1, ease: "power1.out" }, 11.9)
          .to(".cs-helmet", { yPercent: 0, duration: 0.25, ease: "bounce.out" }, 12.0)
          .to(".cs-shake", { y: 4, duration: 0.04, repeat: 3, yoyo: true }, 11.9)
          .to(".cs-cap-3", { autoAlpha: 0, y: -16, duration: 0.4 }, 12.1)
          .fromTo(".cs-cap-4", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 12.3)

          // 7. Settle with the buy panel.
          .to(".cs-cap-4", { autoAlpha: 0, y: -16, duration: 0.4 }, 13.2)
          .fromTo(".cs-final", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 13.4)
          .to({}, { duration: 0.6 }, 14.0);
      });
      // Without motion there is no story to scroll through: show the finished car with its lights on.
      mm.add("(prefers-reduced-motion: reduce)", () => setSeated(true));
    },
    { scope: root },
  );

  return (
    <section ref={root} className="car-show relative flex h-[100svh] flex-col overflow-hidden bg-ink" aria-labelledby="car-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_58%,rgba(255,128,0,0.22),transparent_70%)]" />
      <span
        className="cs-word text-outline pointer-events-none absolute top-1/2 left-0 -translate-y-[60%] whitespace-nowrap font-display text-[42vw] leading-none md:text-[30vw]"
        style={{ "--stroke": "rgba(255,128,0,.16)" } as React.CSSProperties}
        aria-hidden
      >
        MCL-40 MCL-40
      </span>

      <header className="relative px-5 pt-24 md:px-12">
        <p className="text-xs uppercase tracking-[0.35em] text-[#ff8000]">Desk display</p>
        <h2 id="car-title" className="mt-2 font-display text-6xl leading-none md:text-7xl">MCL-40</h2>
      </header>

      {/* Stage */}
      {/* On phones the stage runs a little wider than the screen, so the car isn't tiny; only the wheels' far
          detached spots and the side view's tips get trimmed. */}
      <div className="relative flex flex-1 items-center justify-center md:px-12">
        <div className="cs-shake relative aspect-[1850/920] w-[112vw] shrink-0 md:w-full md:max-w-[min(1250px,calc((100svh-330px)*2.01))]">
          <div className="cs-floor" aria-hidden />

          <div className="cs-streaks" aria-hidden>
            {STREAKS.map(([y, d, w], i) => (
              <span key={i} style={{ top: `${y}%`, width: `${w}%`, animationDelay: `${-d}s` }} />
            ))}
          </div>

          {/* Side view, driving in */}
          <div className="cs-side absolute" style={{ left: `${SIDE.left}%`, top: `${SIDE.top}%`, width: `${SIDE.width}%`, aspectRatio: "1792 / 565" }}>
            <Image src={sideImg} alt="" fill sizes="(max-width: 768px) 95vw, 1150px" className="cs-ghost cs-ghost-2 object-contain" aria-hidden />
            <Image src={sideImg} alt="" fill sizes="(max-width: 768px) 95vw, 1150px" className="cs-ghost cs-ghost-1 object-contain" aria-hidden />
            <div className="cs-side-body absolute inset-0" style={{ transformOrigin: "78% 96%" }}>
              <Image src={sideImg} alt="MCL-40 model car from the side" fill sizes="(max-width: 768px) 95vw, 1150px" className="object-contain" />
              {SIDE_WHEELS.map((w) => (
                <div
                  key={w.id}
                  className="cs-spin absolute"
                  style={{ left: `${w.left}%`, top: `${w.top}%`, width: `${SIDE_WHEEL.width}%`, height: `${SIDE_WHEEL.height}%` }}
                >
                  <Image src={w.src} alt="" fill sizes="160px" className="object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* The car on its base: the base alone rises in, then the photo of the car on it takes over at
              touchdown, and the helmet drops in between the car and the halo's front bar. */}
          <div className="cs-scene absolute top-0 h-full" data-on={lit || undefined} style={{ left: `${(100 - SCENE.width) / 2}%`, width: `${SCENE.width}%` }}>
            <Image src={sceneBase} alt="" fill sizes="(max-width: 768px) 84vw, 940px" className="cs-base object-contain" />
            <Image
              src={sceneCar}
              alt="MCL-40 model car on a carbon-weave base with red and white kerbs and a start/stop engine button"
              fill
              sizes="(max-width: 768px) 84vw, 940px"
              className="cs-scene-car object-contain"
            />
            <div className="cs-helmet absolute" style={box(HELMET)}>
              <Image src={helmetImg} alt="" fill sizes="(max-width: 768px) 21vw, 240px" className="object-contain" />
              <Image src={visorImg} alt="" fill sizes="(max-width: 768px) 21vw, 240px" className="cs-visor object-contain" />
            </div>
            <div className="cs-front absolute" style={box(FRONT)}>
              <Image src={sceneFront} alt="" fill sizes="(max-width: 768px) 32vw, 360px" className="object-contain" />
            </div>
            {/* Over the front of the car too, so the light falling on it isn't cut off where the helmet layers sit. */}
            <Image src={kerbLight} alt="" fill sizes="(max-width: 768px) 84vw, 940px" className="cs-kerb object-contain" />
            <div className="cs-btn-light absolute" style={box(BUTTON)}>
              <Image src={buttonLight} alt="" fill sizes="(max-width: 768px) 14vw, 160px" className="object-contain" />
            </div>
            <span className="cs-land" aria-hidden />
            <button
              type="button"
              className="cs-start"
              data-ready={seated || undefined}
              disabled={!seated}
              aria-pressed={power}
              aria-label={`Start/stop engine button: turn the lights ${power ? "off" : "on"}`}
              onClick={() => {
                setPower((p) => !p);
                setPressed(true);
              }}
              style={{ left: `${BUTTON.cx}%`, top: `${BUTTON.cy}%`, width: `${BUTTON.r * 2}%` }}
            >
              <span className="cs-start-tag" aria-hidden>
                {pressed ? (power ? "Lights on" : "Lights off") : "Press start"}
              </span>
            </button>
          </div>

          {/* Three-quarter view: the assembled car, and the layered car whose wheels come off */}
          <div className="cs-turn absolute inset-0">
            <Image src={carImg} alt="MCL-40 model car, papaya and black #1 livery" fill sizes="(max-width: 768px) 100vw, 1250px" className="cs-car object-contain" />
            <div className="cs-exploded absolute inset-0">
              <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} aria-hidden>
                {WHEELS.map((w) => {
                  const a = hub(w);
                  const b = centre(w);
                  return (
                    <line
                      key={w.id}
                      className="cs-wire"
                      x1={(a.x / 100) * STAGE.w}
                      y1={(a.y / 100) * STAGE.h}
                      x2={(b.x / 100) * STAGE.w}
                      y2={(b.y / 100) * STAGE.h}
                    />
                  );
                })}
              </svg>
              {WHEELS.filter((w) => !w.front).map((w) => (
                <Wheel key={w.id} w={w} />
              ))}
              <Image src={bodyImg} alt="" fill sizes="(max-width: 768px) 100vw, 1250px" className="object-contain" />
              {WHEELS.filter((w) => w.front).map((w) => (
                <Wheel key={w.id} w={w} />
              ))}
            </div>
            {/* Magnetic field on each hub while the wheels are off, and the flash when they connect. */}
            {WHEELS.map((w) => (
              <div key={w.id} className="cs-hub" style={{ left: `${hub(w).x}%`, top: `${hub(w).y}%` }} aria-hidden>
                <span className="cs-mag" />
                <span className="cs-burst" />
              </div>
            ))}
            {/* A band of light passing over the bodywork, masked to the car's shape. */}
            <div className="cs-sweep" style={{ "--mask": `url(${carImg.src})` } as React.CSSProperties} aria-hidden>
              <span className="cs-sweep-band" />
            </div>
          </div>
        </div>
      </div>

      {/* Captions, swapped as the story moves on */}
      <div className="relative grid min-h-[190px] px-5 pb-10 md:min-h-[136px] md:px-12">
        {CAPTIONS.map((c, i) => (
          <div key={c.k} className={`cs-cap-${i} col-start-1 row-start-1 max-w-xl`}>
            <p className="text-xs uppercase tracking-[0.35em] text-[#ff8000]">
              0{i + 1} · {c.k}
            </p>
            <p className="mt-2 text-2xl font-semibold md:text-3xl">{c.t}</p>
            <p className="mt-2 text-white/60">{c.d}</p>
          </div>
        ))}
        <div className="cs-final col-start-1 row-start-1 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <ul className="flex flex-wrap gap-2 text-xs uppercase tracking-widest text-white/80">
            {["Magnetic detachable wheels", "Helmet in the cockpit", "Carbon-weave kerb base", "Start / stop engine button"].map((f) => (
              <li key={f} className="rounded-full border border-white/20 px-3 py-2">
                {f}
              </li>
            ))}
          </ul>
          <AddToCart product={product} accent="#ff8000" ink="#141313" />
        </div>
      </div>
    </section>
  );
}

const box = (b: { left: number; top: number; width: number; height: number }) => ({
  left: `${b.left}%`,
  top: `${b.top}%`,
  width: `${b.width}%`,
  height: `${b.height}%`,
});

function Wheel({ w }: { w: (typeof WHEELS)[number] }) {
  return (
    <div
      className={`cs-wheel cs-wheel-${w.id} absolute`}
      style={{ left: `${w.left}%`, top: `${w.top}%`, width: `${w.width}%`, height: `${w.height}%` }}
    >
      <div className="cs-float absolute inset-0">
        <Image src={w.src} alt="" fill sizes="200px" className="object-contain" />
      </div>
    </div>
  );
}
