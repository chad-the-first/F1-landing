"use client";

import Image from "next/image";
import { useLightSwitch } from "@/lib/useLightSwitch";
import podiumP1 from "../../public/images/podium-p1.webp";
import podiumP2 from "../../public/images/podium-p2.webp";
import podiumP3 from "../../public/images/podium-p3.webp";
import tagP1 from "../../public/images/podium-tag-p1.webp";
import tagP2 from "../../public/images/podium-tag-p2.webp";
import tagP3 from "../../public/images/podium-tag-p3.webp";
import tagF1 from "../../public/images/podium-tag-f1.webp";

// Lit copies of the position tags and F1 plaque, placed in % of the podium image. They switch on in
// podium order, with the plaque last.
const TAGS = [
  { id: "p1", src: tagP1, left: 47.587, top: 53.68, width: 4.915, height: 12.771, delay: 0.05 },
  { id: "p2", src: tagP2, left: 14.075, top: 71.861, width: 4.96, height: 12.554, delay: 0.2 },
  { id: "p3", src: tagP3, left: 81.055, top: 76.19, width: 5.049, height: 12.771, delay: 0.35 },
  { id: "f1", src: tagF1, left: 43.655, top: 70.13, width: 13.003, height: 21.861, delay: 0.55 },
];

// The three-step podium, whose side strips and tags light up on hover or tap (like the figures).
// The steps are separate layers so the podium section can animate each one.
export function PodiumBase({ sizes, className = "", style }: { sizes: string; className?: string; style?: React.CSSProperties }) {
  const light = useLightSwitch();

  return (
    <div
      className={`pd-podium ${className}`}
      style={style}
      role="button"
      tabIndex={0}
      aria-pressed={light.toggled}
      aria-label="Podium: switch the lights on"
      data-on={light.on || undefined}
      onPointerEnter={(e) => e.pointerType === "mouse" && light.setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && light.setHovered(false)}
      onPointerDown={light.onPointerDown}
      onPointerUp={light.onPointerUp}
      onPointerCancel={light.onPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          light.setToggled((t) => !t);
        }
      }}
    >
      {/* Yellow light from strips on the podium's hidden sides; the steps cover the source. */}
      <div className="pd-side pd-side-l" aria-hidden>
        <div className="pd-sheet" />
      </div>
      <div className="pd-side pd-side-r" aria-hidden>
        <div className="pd-sheet" />
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <Image src={podiumP2} alt="" fill sizes={sizes} draggable={false} className="pd-step-2 object-contain" />
        <Image src={podiumP3} alt="" fill sizes={sizes} draggable={false} className="pd-step-3 object-contain" />
        <Image src={podiumP1} alt="Three-step carbon fiber podium" fill sizes={sizes} draggable={false} className="pd-step-1 object-contain" />
      </div>
      {/* The 1, 2, 3 tags and the F1 plaque light up cold white. */}
      {TAGS.map((t) => (
        <div
          key={t.id}
          className="pd-tag"
          style={{ left: `${t.left}%`, top: `${t.top}%`, width: `${t.width}%`, height: `${t.height}%`, "--d": `${t.delay}s` } as React.CSSProperties}
          aria-hidden
        >
          <div className="pd-tag-spill" />
          <Image src={t.src} alt="" fill sizes="10vw" draggable={false} className="pd-tag-img" />
        </div>
      ))}
    </div>
  );
}
