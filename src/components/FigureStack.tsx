import Image from "next/image";
import type { ShowcaseItem } from "@/lib/showcase";

// A driver figure built from two transparent layers. The helmet hovers above the body with a slow
// bob; on devices with a mouse, hovering the figure drops the helmet onto the neck.
// (Tailwind only applies hover styles on devices that support hover, so touch screens keep it floating.)
export function FigureStack({ item, sizes, className = "" }: { item: ShowcaseItem; sizes: string; className?: string }) {
  return (
    <div className={`group/figure relative aspect-[900/1652] ${className}`} style={{ "--seat": item.seat } as React.CSSProperties}>
      <Image src={item.body} alt={`${item.name} figure on a carbon-weave base`} fill sizes={sizes} className="object-contain" />
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.3,1.35,0.5,1)] group-hover/figure:translate-y-(--seat)">
        <div className="helmet-float absolute inset-0 group-hover/figure:[animation:none]">
          <Image
            src={item.helmet}
            alt=""
            fill
            sizes={sizes}
            className="object-contain drop-shadow-[0_45px_28px_rgba(0,0,0,0.55)] transition-[filter] duration-700 group-hover/figure:drop-shadow-[0_4px_4px_rgba(0,0,0,0.45)]"
          />
        </div>
      </div>
    </div>
  );
}
