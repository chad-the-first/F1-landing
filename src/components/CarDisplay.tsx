"use client";

import Image from "next/image";
import { useLightSwitch } from "@/lib/useLightSwitch";
import { BUTTON, FRONT, HELMET, VISOR, box } from "./CarShowcase";
import sceneCar from "../../public/images/car/base/scene-car.webp";
import sceneFront from "../../public/images/car/base/scene-front.webp";
import helmetImg from "../../public/images/car/base/helmet.webp";
import visorImg from "../../public/images/car/base/visor-lit.webp";
import kerbLight from "../../public/images/car/base/kerb-light.webp";
import buttonLight from "../../public/images/car/base/button-light.webp";

// The finished desk display from the car section (car on its base, helmet seated behind the halo) on a
// transparent background. Hover or tap switches on the kerb strips, the visor and the start button.
export function CarDisplay({ sizes, className = "" }: { sizes: string; className?: string }) {
  const light = useLightSwitch();

  return (
    <div
      className={`car-display relative aspect-[1700/1100] ${className}`}
      role="button"
      tabIndex={0}
      aria-pressed={light.toggled}
      aria-label="MCL-40 desk display: switch the lights on"
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
      <Image src={sceneCar} alt="MCL-40 model car on its carbon fiber kerb base" fill sizes={sizes} draggable={false} className="object-contain" />
      <div className="absolute" style={box(HELMET)}>
        <Image src={helmetImg} alt="" fill sizes={sizes} draggable={false} className="object-contain" />
      </div>
      <div className="absolute" style={box(FRONT)}>
        <Image src={sceneFront} alt="" fill sizes={sizes} draggable={false} className="object-contain" />
      </div>
      <div className="cs-visor absolute" style={box(VISOR)}>
        <Image src={visorImg} alt="" fill sizes={sizes} draggable={false} className="object-contain" />
      </div>
      <Image src={kerbLight} alt="" fill sizes={sizes} draggable={false} className="cs-kerb object-contain" />
      <div className="cs-btn-light absolute" style={box(BUTTON)}>
        <Image src={buttonLight} alt="" fill sizes={sizes} draggable={false} className="object-contain" />
      </div>
    </div>
  );
}
