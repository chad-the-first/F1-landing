"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { drivers } from "@/lib/showcase";
import { PODIUM_SLUG } from "@/lib/bundle";
import { confetti } from "@/lib/confetti";
import { TEAM_IDS } from "@/lib/team";
import { formatMoney, Product } from "@/lib/woo";
import { useCart } from "./CartProvider";
import { FigureStack } from "./FigureStack";
import podiumP1 from "../../public/images/podium-p1.webp";
import podiumP2 from "../../public/images/podium-p2.webp";
import podiumP3 from "../../public/images/podium-p3.webp";
import norrisThumb from "../../public/images/norris-helmet-thumb.webp";
import hamiltonThumb from "../../public/images/hamilton-helmet-thumb.webp";
import verstappenThumb from "../../public/images/verstappen-helmet-thumb.webp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const thumbs = [norrisThumb, hamiltonThumb, verstappenThumb];

// Stage geometry, in % of the stage box. The stage is the podium photo (2238x462 crop) with
// headroom above for the figures; each figure's base sits inside the recess on top of its step.
// Index 0 is P1 (the centre step), 1 is P2 (left), 2 is P3 (right).
const FIG = { w: 28.69, h: 79.49 };
const SLOTS = [
  { label: "P1", left: 35.75, top: 4.05, x: 50.1, y: 76.2 },
  { label: "P2", left: 2.9, top: 9.92, x: 17.25, y: 82.3 },
  { label: "P3", left: 68.63, top: 10.26, x: 82.98, y: 82.7 },
];
// Where the steps meet, as a fraction of the stage width, for working out which step a drop lands on.
const slotAt = (fx: number) => (fx < 0.335 ? 1 : fx < 0.666 ? 0 : 2);

// Dust drifting through the spotlights. Fixed values so server and client render the same.
const DUST = [
  [12, 30, 0],
  [19, 55, 1.4],
  [26, 18, 2.6],
  [44, 40, 0.6],
  [49, 22, 3.1],
  [55, 58, 1.9],
  [61, 35, 4.2],
  [78, 25, 0.9],
  [84, 50, 2.2],
  [90, 32, 3.6],
  [33, 62, 4.8],
  [70, 60, 5.4],
] as const;

type Slot = { uid: string; driver: number };
let uidSeq = 0;
const nextUid = () => `fig-${++uidSeq}`;

export function Podium({ products }: { products: Product[] }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLButtonElement>(null);
  const { addItems, busy, setOpen } = useCart();

  const [slots, setSlots] = useState<Slot[]>([
    { uid: "init-0", driver: 0 },
    { uid: "init-1", driver: 1 },
    { uid: "init-2", driver: 2 },
  ]);
  const [landed, setLanded] = useState<ReadonlySet<string>>(new Set());
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const [announce, setAnnounce] = useState("");

  // GSAP callbacks run outside React renders, so they read the latest line-up from a ref.
  const slotsRef = useRef(slots);
  const touched = useRef(false);
  // Where the pointer went down, to tell a tap from a drag (Motion reports a tap after a drag too).
  const downAt = useRef({ x: 0, y: 0 });
  const selectedRef = useRef(selectedUid);
  useLayoutEffect(() => {
    slotsRef.current = slots;
    selectedRef.current = selectedUid;
  }, [slots, selectedUid]);
  const selectedAt = slots.findIndex((x) => x.uid === selectedUid);
  const selected = selectedAt < 0 ? null : selectedAt;
  // Motion can hold on to a figure's first gesture handlers, so handlers look the figure up by id.
  const indexOf = (uid: string) => slotsRef.current.findIndex((x) => x.uid === uid);
  // The step under a dragged figure's centre, from how far it has moved sideways.
  const dropTarget = (uid: string, dx: number) => slotAt(SLOTS[indexOf(uid)].x / 100 + dx / stage.current!.getBoundingClientRect().width);

  const land = (uid: string) => setLanded((s) => (s.has(uid) ? s : new Set(s).add(uid)));

  const swap = (a: number, b: number) => {
    if (a === b) return;
    touched.current = true;
    setAdded(false);
    const n = [...slotsRef.current];
    slotsRef.current = n;
    [n[a], n[b]] = [n[b], n[a]];
    setSlots(n);
    setAnnounce(`${drivers[n[a].driver].name} is now ${SLOTS[a].label}, ${drivers[n[b].driver].name} is now ${SLOTS[b].label}.`);
  };

  const choose = (slot: number, driver: number) => {
    touched.current = true;
    setAdded(false);
    setSelectedUid(null);
    setSlots((s) => s.map((x, i) => (i === slot && x.driver !== driver ? { uid: nextUid(), driver } : x)));
  };

  const chooseAll = (driverFor: (slot: number) => number) => {
    touched.current = true;
    setAdded(false);
    setSelectedUid(null);
    setSlots((s) => s.map((x, i) => (x.driver === driverFor(i) ? x : { uid: nextUid(), driver: driverFor(i) })));
  };

  const tap = (uid: string) => {
    const picked = selectedRef.current;
    if (picked === null) setSelectedUid(uid);
    else {
      swap(indexOf(picked), indexOf(uid));
      setSelectedUid(null);
    }
    selectedRef.current = picked === null ? uid : null;
  };

  useGSAP(
    () => {
      const st = stage.current!;
      // Unless they have already picked, the visitor's hero team takes the top step.
      const crownTeam = () => {
        if (touched.current) return;
        const i = TEAM_IDS.indexOf(document.documentElement.dataset.team as (typeof TEAM_IDS)[number]);
        const at = slotsRef.current.findIndex((s) => s.driver === i);
        if (at > 0) {
          setSlots((s) => {
            const n = [...s];
            [n[0], n[at]] = [n[at], n[0]];
            return n;
          });
        }
      };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        crownTeam();
        slotsRef.current.forEach((s) => land(s.uid));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Big outline word drifting behind everything.
        gsap.fromTo(
          ".pd-word",
          { xPercent: 12 },
          {
            xPercent: -28,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              refreshPriority: -1,
            },
          },
        );

        gsap.set(".pd-intro", { yPercent: -70, autoAlpha: 0 });

        // A figure falls onto its step, the stage thuds, and a ring of light spreads from the base.
        const drop = (slot: number) => {
          const uid = slotsRef.current[slot].uid;
          const el = st.querySelector(`[data-uid="${uid}"] .pd-intro`);
          gsap.fromTo(
            el,
            { yPercent: -70, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "power3.in",
              onComplete: () => {
                land(uid);
                gsap.fromTo(
                  ".pd-shake",
                  { y: 0 },
                  {
                    y: slot === 0 ? 7 : 4,
                    duration: 0.05,
                    repeat: 3,
                    yoyo: true,
                    ease: "none",
                  },
                );
              },
            },
          );
        };

        gsap
          .timeline({
            scrollTrigger: {
              trigger: st,
              start: "top 70%",
              once: true,
              refreshPriority: -1,
            },
            defaults: { ease: "power4.out" },
          })
          .call(crownTeam)
          .from(".pd-title-word", { yPercent: 110, duration: 1, stagger: 0.08 }, 0)
          // The steps rise out of the floor: the winner's step first, so it covers the seams.
          .from(".pd-step-1", { yPercent: 105, duration: 0.9 }, 0.1)
          .from(".pd-step-2", { yPercent: 105, duration: 0.9 }, 0.25)
          .from(".pd-step-3", { yPercent: 105, duration: 0.9 }, 0.38)
          .from(".pd-floor", { opacity: 0, duration: 1.2, ease: "power2.out" }, 0.1)
          // Spotlights swing in from the sides and settle on each step.
          .from(
            ".pd-beam",
            {
              opacity: 0,
              rotate: (i: number) => [0, -38, 38][i],
              duration: 1.4,
              ease: "power3.out",
              stagger: 0.1,
            },
            0.5,
          )
          // Third place lands first and the winner last.
          .call(() => drop(2), [], 1.0)
          .call(() => drop(1), [], 1.45)
          .call(() => drop(0), [], 1.95)
          .from(
            ".pd-panel > *",
            {
              y: 24,
              opacity: 0,
              duration: 0.8,
              stagger: 0.07,
              ease: "power3.out",
            },
            0.3,
          );
      });
    },
    { scope: root },
  );

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const figures = slots.map((s) => bySlug.get(drivers[s.driver].slug));
  const podium = bySlug.get(PODIUM_SLUG);
  const ready = podium && figures.every(Boolean);
  const money = podium?.money ?? figures[0]?.money;
  const total = figures.reduce((sum, p) => sum + (p?.amount ?? 0), 0);

  const addBundle = async () => {
    if (!ready) return;
    const counts = new Map<number, number>();
    for (const p of figures) counts.set(p!.id, (counts.get(p!.id) ?? 0) + 1);
    const lines = [...counts].map(([id, quantity]) => ({ id, quantity })).concat({ id: podium.id, quantity: 1 });
    const ok = await addItems(lines, { open: false });
    if (ok) {
      setAdded(true);
      const box = (stage.current ?? cta.current)!.getBoundingClientRect();
      confetti({
        x: box.left + box.width / 2,
        y: box.top + box.height * 0.35,
        colors: slots.map((s) => drivers[s.driver].accent).concat("#ffd400"),
      });
    }
    window.setTimeout(() => setOpen(true), ok ? 1100 : 0);
  };

  return (
    <section ref={root} className="podium relative overflow-hidden px-5 py-28 md:px-12 md:py-36" aria-labelledby="podium-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_35%_70%,color-mix(in_srgb,var(--accent-2)_22%,transparent),transparent_70%)]" />
      <span
        className="pd-word text-outline pointer-events-none absolute top-[6%] left-0 whitespace-nowrap font-display text-[34vw] leading-none md:top-[10%] md:text-[24vw]"
        style={{ "--stroke": "rgba(255,255,255,.09)" } as React.CSSProperties}
        aria-hidden
      >
        PODIUM BUNDLE
      </span>

      <div className="relative mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">The podium bundle</p>
          <h2 id="podium-title" className="mt-4 font-display text-[16vw] uppercase leading-[0.88] md:text-[8.5vw] lg:text-[7.5rem]">
            {["Build", "your", "podium"].map((w) => (
              <span key={w} className="inline-block overflow-hidden pr-[0.18em] align-bottom">
                <span className="pd-title-word inline-block">{w}</span>
              </span>
            ))}
          </h2>
        </header>

        <div className="mt-10 grid items-center gap-10 md:mt-14 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          {/* Stage */}
          <div className="-mx-5 md:mx-0">
            <div ref={stage} className="pd-stage relative isolate aspect-[2238/1482] select-none">
              <div className="pd-shake absolute inset-0">
                {SLOTS.map((s, i) => (
                  <div
                    key={s.label}
                    className="pd-beam"
                    style={
                      {
                        left: `${s.x}%`,
                        "--beam": drivers[slots[i].driver].accent,
                      } as React.CSSProperties
                    }
                    aria-hidden
                  >
                    <div className="pd-beam-sway" style={{ animationDelay: `${-i * 1.7}s` }} />
                  </div>
                ))}
                {DUST.map(([x, y, d], i) => (
                  <span
                    key={i}
                    className="pd-dust"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      animationDelay: `${-d}s`,
                    }}
                    aria-hidden
                  />
                ))}

                <div className="pd-floor" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ top: "68.83%" }}>
                  <Image src={podiumP2} alt="" fill sizes="(max-width: 1024px) 100vw, 60vw" draggable={false} className="pd-step-2 object-contain" />
                  <Image src={podiumP3} alt="" fill sizes="(max-width: 1024px) 100vw, 60vw" draggable={false} className="pd-step-3 object-contain" />
                  <Image
                    src={podiumP1}
                    alt="Three-step carbon-weave podium"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    draggable={false}
                    className="pd-step-1 object-contain"
                  />
                </div>

                {/* Glow on a step while a figure is dragged over it, or offered for a swap. */}
                {SLOTS.map((s, i) => (
                  <div
                    key={s.label}
                    className="pd-zone"
                    data-active={over === i || undefined}
                    data-offer={(selected !== null && selected !== i) || undefined}
                    style={
                      {
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        "--beam": drivers[slots[i].driver].accent,
                      } as React.CSSProperties
                    }
                    aria-hidden
                  />
                ))}

                <AnimatePresence initial={false}>
                  {slots.map((s, i) => {
                    const d = drivers[s.driver];
                    const isDragging = dragging === s.uid;
                    return (
                      <motion.div
                        key={s.uid}
                        data-uid={s.uid}
                        role="button"
                        tabIndex={0}
                        aria-pressed={selected === i}
                        aria-label={`${d.name}, ${SLOTS[i].label}. ${selected === null ? "Select to swap places" : selected === i ? "Selected" : `Swap with ${SLOTS[selected].label}`}`}
                        className="pd-figure absolute cursor-grab outline-none active:cursor-grabbing"
                        style={{
                          width: `${FIG.w}%`,
                          height: `${FIG.h}%`,
                          zIndex: isDragging ? 30 : selected === i ? 20 : 10,
                        }}
                        animate={{
                          left: `${SLOTS[i].left}%`,
                          top: `${SLOTS[i].top}%`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 210,
                          damping: 24,
                        }}
                        // Sideways only, so a vertical swipe over a figure still scrolls the page on phones.
                        drag="x"
                        dragSnapToOrigin
                        dragMomentum={false}
                        dragElastic={0.6}
                        whileDrag={{ scale: 1.06 }}
                        onPointerDown={(e) => {
                          downAt.current = { x: e.clientX, y: e.clientY };
                        }}
                        onPointerUp={(e) => {
                          if (Math.hypot(e.clientX - downAt.current.x, e.clientY - downAt.current.y) < 6) tap(s.uid);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            tap(s.uid);
                          }
                        }}
                        onDragStart={() => {
                          setDragging(s.uid);
                          setSelectedUid(null);
                        }}
                        onDrag={(_, info) => {
                          const target = dropTarget(s.uid, info.offset.x);
                          setOver(target === indexOf(s.uid) ? null : target);
                        }}
                        onDragEnd={(e, info) => {
                          // A cancelled drag (the browser took the touch to scroll) never moves a figure.
                          if (e.type !== "pointercancel") swap(indexOf(s.uid), dropTarget(s.uid, info.offset.x));
                          setDragging(null);
                          setOver(null);
                        }}
                      >
                        <div className="pd-intro absolute inset-0">
                          <motion.div
                            className="absolute inset-0"
                            initial={{ y: "-55%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{
                              y: "10%",
                              scale: 0.9,
                              opacity: 0,
                              filter: "blur(10px)",
                              transition: { duration: 0.28, ease: "easeIn" },
                            }}
                            transition={{
                              y: {
                                type: "spring",
                                stiffness: 380,
                                damping: 17,
                                delay: 0.12 + i * 0.1,
                              },
                              opacity: { duration: 0.2, delay: 0.12 + i * 0.1 },
                            }}
                            onAnimationComplete={() => land(s.uid)}
                          >
                            <div className="pd-shadow" aria-hidden />
                            {landed.has(s.uid) && <span className="pd-ring" style={{ "--beam": d.accent } as React.CSSProperties} aria-hidden />}
                            {selected === i && <span className="pd-picked" style={{ "--beam": d.accent } as React.CSSProperties} aria-hidden />}
                            {/* A picked figure lifts off its step and its helmet floats up. */}
                            <div className="pd-lift absolute inset-0" data-picked={selected === i || undefined}>
                              <FigureStack
                                item={d}
                                sizes="(max-width: 1024px) 30vw, 18vw"
                                interactive={false}
                                on={landed.has(s.uid) && !isDragging && selected !== i}
                                className="h-full"
                              />
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {selected !== null && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="pointer-events-none absolute top-0 left-1/2 z-40 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest whitespace-nowrap text-ink"
                  >
                    Tap another figure to swap
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <p className="mt-4 px-5 text-center text-sm text-white/50 md:px-0">
              Drag a figure onto another step, or tap two figures, to swap places.
            </p>
          </div>

          {/* Builder */}
          <div className="pd-panel">
            <p className="text-lg text-white/70">
              Pick any three drivers, three of the same or one of each. Put them in your order, and the podium is on us.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-widest">
              <button onClick={() => chooseAll((i) => i)} className="pd-preset">
                One of each
              </button>
              {drivers.map((d, di) => (
                <button key={d.slug} onClick={() => chooseAll(() => di)} className="pd-preset">
                  3× {d.surname}
                </button>
              ))}
            </div>

            <ol className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {slots.map((s, i) => (
                <li key={SLOTS[i].label} className="flex items-center gap-4 py-4">
                  <span className="w-12 font-display text-4xl leading-none text-white/90">{SLOTS[i].label}</span>
                  <div className="min-w-0 flex-1">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.p
                        key={s.driver}
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        className="truncate font-semibold"
                      >
                        {drivers[s.driver].name}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-xs uppercase tracking-widest" style={{ color: drivers[s.driver].accent }}>
                      {drivers[s.driver].team}
                    </p>
                  </div>
                  <div role="radiogroup" aria-label={`${SLOTS[i].label} driver`} className="flex gap-1.5">
                    {drivers.map((d, di) => (
                      <button
                        key={d.slug}
                        role="radio"
                        aria-checked={s.driver === di}
                        aria-label={d.name}
                        onClick={() => choose(i, di)}
                        className="pd-chip"
                        style={{ "--beam": d.accent } as React.CSSProperties}
                      >
                        <Image src={thumbs[di]} alt="" width={44} height={44} className="h-full w-full object-contain" />
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ol>

            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/60">3 driver figures</dt>
                <dd>{money ? formatMoney(money, total) : "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">Podium display</dt>
                <dd className="flex gap-3">
                  {podium && <s className="text-white/40">{podium.price}</s>}
                  <span className="font-semibold text-accent">FREE</span>
                </dd>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-lg">
                <dt>Bundle total</dt>
                <dd className="font-semibold">{money ? formatMoney(money, total) : "—"}</dd>
              </div>
            </dl>

            <div className="mt-6">
              {ready ? (
                <button
                  ref={cta}
                  disabled={busy}
                  onClick={addBundle}
                  className="pd-cta flex w-full items-center justify-center gap-4 rounded-full bg-accent px-7 py-5 text-sm font-semibold uppercase tracking-widest text-accent-ink transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={added ? "added" : "add"}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                    >
                      {added ? "Bundle added ✓" : "Add bundle to cart"}
                    </motion.span>
                  </AnimatePresence>
                  <span className="h-4 w-px bg-current opacity-40" />
                  <span>{money && formatMoney(money, total)}</span>
                </button>
              ) : (
                <p className="rounded-full border border-white/20 px-7 py-5 text-center text-sm uppercase tracking-widest text-white/60">
                  Coming soon
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </section>
  );
}
