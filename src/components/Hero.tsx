"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { teams } from "@/lib/showcase";
import { setTeam, TeamId, useTeam } from "@/lib/team";

// Scroll and intro animations for the hero live in Landing (GSAP); this component owns the
// team picker and the helmet swap (Motion).
export function Hero() {
  const teamId = useTeam();
  const index = teams.findIndex((t) => t.id === teamId);
  const team = teams[index];
  const [direction, setDirection] = useState(1);

  const choose = (id: TeamId) => {
    const next = teams.findIndex((t) => t.id === id);
    if (next === index) return;
    setDirection(next > index ? 1 : -1);
    setTeam(id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = teams[(index + step + teams.length) % teams.length];
    choose(next.id);
    (e.currentTarget.querySelector(`[data-id="${next.id}"]`) as HTMLElement | null)?.focus();
  };

  return (
    <section className="hero relative h-[100svh] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 55%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%)" }}
      />
      <h1 className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between pt-[13svh] pb-[22svh] font-display uppercase leading-none tracking-tight md:pt-[6svh] md:pb-[13svh]">
        <span className="overflow-hidden"><span className="hero-word hero-l block text-[26vw] md:text-[14vw]">Lights</span></span>
        <span className="overflow-hidden"><span className="hero-word hero-r block text-[26vw] text-accent md:text-[14vw]">Out</span></span>
      </h1>

      <div className="hero-helmet absolute inset-0 flex items-center justify-center md:-translate-y-[3svh]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={team.id}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: `${d * 18}%`, rotate: d * 8, scale: 0.85, filter: "blur(12px)" }),
              center: { opacity: 1, x: "0%", rotate: 0, scale: 1, filter: "blur(0px)" },
              exit: (d: number) => ({ opacity: 0, x: `${d * -18}%`, rotate: d * -8, scale: 0.85, filter: "blur(12px)" }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 140, damping: 20, mass: 0.9 }}
            className="flex justify-center"
          >
            <Image
              src={team.helmet}
              alt={team.alt}
              preload={team.id === teams[0].id}
              sizes="(max-width: 768px) 170vw, 60vw"
              className="h-auto w-[170vw] max-w-none mix-blend-lighten [mask-image:radial-gradient(ellipse_45%_50%_at_50%_50%,black_55%,transparent_100%)] md:w-[60vw]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hero-fade absolute inset-x-0 bottom-14 flex flex-col items-center gap-3 px-5 md:bottom-10">
        <span className="text-[11px] uppercase tracking-[0.35em] text-white/50">Pick your team</span>
        <div role="radiogroup" aria-label="Team" onKeyDown={onKeyDown} className="flex gap-1 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10 backdrop-blur">
          {teams.map((t) => {
            const active = t.id === team.id;
            return (
              <button
                key={t.id}
                data-id={t.id}
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => choose(t.id)}
                className="relative flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition-colors md:px-6 md:text-sm"
                style={{ color: active ? "var(--accent-ink)" : "rgba(255,255,255,0.7)" }}
              >
                {active && (
                  <motion.span layoutId="team-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                )}
                <span className="relative h-2 w-2 rounded-full ring-1 ring-black/20" style={{ backgroundColor: t.swatch }} />
                <span className="relative">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 hidden items-end justify-between px-12 text-xs uppercase tracking-[0.3em] text-white/50 md:flex">
        <span className="hero-fade">{team.name} · 2026 driver series</span>
        <span className="hero-fade">Scroll</span>
      </div>
    </section>
  );
}
