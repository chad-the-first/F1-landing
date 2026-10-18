"use client";

import Image from "next/image";
import { useLightSwitch } from "@/lib/useLightSwitch";
import type { ShowcaseItem } from "@/lib/showcase";

// A driver figure built from two transparent layers. The helmet hovers above the body; it seats
// on the neck while a mouse hovers, on tap (toggles), or while a finger presses and holds.
// When it connects, the visor lights up and the name tag and body are lit (see .fs-* in globals.css).
// Pass `on` to control the helmet from outside, and `interactive={false}` when a parent handles input.
export function FigureStack({
  item,
  sizes,
  className = "",
  on: forcedOn,
  interactive = true,
}: {
  item: ShowcaseItem;
  sizes: string;
  className?: string;
  on?: boolean;
  interactive?: boolean;
}) {
  const { on: switchedOn, toggled, setHovered, setToggled, onPointerDown, onPointerUp, onPointerCancel } = useLightSwitch();
  const on = forcedOn ?? switchedOn;

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? toggled : undefined}
      aria-label={interactive ? `${item.name} figure: put the helmet on` : undefined}
      data-on={on || undefined}
      data-static={interactive ? undefined : true}
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
      onPointerEnter={(e) => interactive && e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => interactive && e.pointerType === "mouse" && setHovered(false)}
      onPointerDown={interactive ? onPointerDown : undefined}
      onPointerUp={interactive ? onPointerUp : undefined}
      onPointerCancel={interactive ? onPointerCancel : undefined}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setToggled((t) => !t);
        }
      }}
    >
      <div className="fs-backglow" aria-hidden />
      <Image src={item.body} alt={`${item.name} figure on a carbon fiber base`} fill sizes={sizes} draggable={false} className="object-contain" />
      <div className="fs-uplight" aria-hidden />
      <div className="fs-beam fs-beam-l" aria-hidden />
      <div className="fs-beam fs-beam-r" aria-hidden />
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

