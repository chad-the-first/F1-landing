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
      <div className="fs-taglight" aria-hidden />
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
