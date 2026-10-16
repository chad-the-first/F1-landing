// A short burst of paper confetti on a throwaway canvas over the page. No-op with reduced motion.
export function confetti({ x, y, colors, count = 140 }: { x: number; y: number; colors: string[]; count?: number }) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "60" });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const pieces = Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
    const speed = 7 + Math.random() * 11;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 6 + Math.random() * 7,
      h: 3 + Math.random() * 5,
      spin: Math.random() * Math.PI,
      vspin: (Math.random() - 0.5) * 0.4,
      tilt: Math.random() * Math.PI,
      color: i % 9 === 0 ? "#ffffff" : colors[i % colors.length],
    };
  });

  const start = performance.now();
  const life = 2600;
  const frame = (now: number) => {
    const t = now - start;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalAlpha = Math.min(1, (life - t) / 600);
    for (const p of pieces) {
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.32;
      p.x += p.vx;
      p.y += p.vy;
      p.spin += p.vspin;
      p.tilt += 0.12;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      // Flip the paper around its long axis so it flutters.
      ctx.scale(1, Math.cos(p.tilt));
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (t < life) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
