"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ShowcaseItem } from "@/lib/showcase";

// A driver figure built from two transparent layers. The helmet hovers above the body; it seats
// on the neck while a mouse hovers, on tap (toggles), or while a finger presses and holds.
// When it connects, the visor lights up and the name tag and body are lit (see .fs-* in globals.css).
export function FigureStack({ item, sizes, className = "" }: { item: ShowcaseItem; sizes: string; className?: string }) {
  const [hovered, setHovered] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [held, setHeld] = useState(false);
  const holdTimer = useRef<number | undefined>(undefined);
  const longPress = useRef(false);
  const on = hovered || toggled || held;

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    longPress.current = false;
    holdTimer.current = window.setTimeout(() => {
      longPress.current = true;
      setHeld(true);
    }, 300);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    window.clearTimeout(holdTimer.current);
    if (longPress.current) setHeld(false);
    else setToggled((t) => !t);
  };
  // Fires when the finger starts scrolling instead, so a scroll never toggles the helmet.
  const onPointerCancel = () => {
    window.clearTimeout(holdTimer.current);
    setHeld(false);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={toggled}
      aria-label={`${item.name} figure: put the helmet on`}
      data-on={on || undefined}
      className={`fs relative aspect-[900/1652] ${className}`}
      style={
        {
          "--seat": item.seat,
          "--team": item.accent,
          "--visor-x": item.visorAt.x,
          "--visor-y": item.visorAt.y,
          "--body-mask": `url(${item.body.src})`,
        } as React.CSSProperties
      }
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setToggled((t) => !t);
        }
      }}
    >
      <div className="fs-backglow" aria-hidden />
      <Image src={item.body} alt={`${item.name} figure on a carbon-weave base`} fill sizes={sizes} draggable={false} className="object-contain" />
      <div className="fs-uplight" aria-hidden />
      <TagBeams />
      <div className="fs-flare fs-flare-l" aria-hidden />
      <div className="fs-flare fs-flare-r" aria-hidden />
      <div className="fs-helmet">
        <div className="helmet-float absolute inset-0">
          <Image src={item.helmet} alt="" fill sizes={sizes} draggable={false} className="fs-helmet-img object-contain" />
          <Image src={item.visor} alt="" fill sizes={sizes} draggable={false} className="fs-visor object-contain" />
          <div className="fs-visor-spill" aria-hidden />
        </div>
      </div>
    </div>
  );
}

// Two narrow beams of cold white light leaving the name tag's bottom corners at 45°, crossing in an X.
// Drawn in the figure's own 900x1652 coordinates so the angle is a true 45° at any size.
const TAG_CORNERS: [number, number][] = [
  [171, 1594],
  [765, 1594],
];

function beam([x, y]: [number, number], dir: 1 | -1, length: number, startWidth: number, endWidth: number) {
  const d = Math.SQRT1_2;
  const [dx, dy] = [dir * d, -d]; // up and towards the other corner
  const [nx, ny] = [d, dir * d]; // perpendicular to the beam
  const ex = x + dx * length;
  const ey = y + dy * length;
  const pts = [
    [x + (nx * startWidth) / 2, y + (ny * startWidth) / 2],
    [ex + (nx * endWidth) / 2, ey + (ny * endWidth) / 2],
    [ex - (nx * endWidth) / 2, ey - (ny * endWidth) / 2],
    [x - (nx * startWidth) / 2, y - (ny * startWidth) / 2],
  ];
  return { points: pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" "), x2: ex, y2: ey };
}

function TagBeams() {
  return (
    <svg className="fs-beams" viewBox="0 0 900 1652" preserveAspectRatio="none" aria-hidden>
      <defs>
        <filter id="fs-beam-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="fs-beam-core" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
      {TAG_CORNERS.map((corner, i) => {
        const dir = i === 0 ? 1 : -1;
        const soft = beam(corner, dir, 600, 8, 44);
        const core = beam(corner, dir, 520, 2, 12);
        const id = `fs-beam-fade-${i}`;
        return (
          <g key={i}>
            <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={corner[0]} y1={corner[1]} x2={soft.x2} y2={soft.y2}>
              <stop offset="0" stopColor="#f4f8ff" stopOpacity="1" />
              <stop offset="0.45" stopColor="#dce9ff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#dce9ff" stopOpacity="0" />
            </linearGradient>
            <polygon points={soft.points} fill={`url(#${id})`} opacity="0.7" filter="url(#fs-beam-soft)" />
            <polygon points={core.points} fill={`url(#${id})`} filter="url(#fs-beam-core)" />
          </g>
        );
      })}
    </svg>
  );
}
