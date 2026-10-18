"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { HELP_LINKS, SOCIALS, type SocialId } from "@/lib/site";

const ICONS: Record<SocialId, ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.75 15.02 15.5 12 9.75 8.98z"
      />
    </svg>
  ),
  etsy: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 4h10.2l.4 4h-1.2l-.6-1.9c-.2-.6-.5-.8-1.2-.8h-3.9v5.2h2.7c.6 0 .9-.3 1-.9l.2-1h1.1v5.3h-1.1l-.2-1.1c-.1-.6-.4-.9-1-.9h-2.7v4.8c0 .7.3 1 1 1h2.6c.8 0 1.2-.3 1.5-.9l.9-2h1.1L18.6 20H7v-1l1.2-.3c.4-.1.6-.3.6-.8V6.1c0-.5-.2-.7-.6-.8L7 5z" />
    </svg>
  ),
};

const TRUST = [
  {
    title: "Secure checkout",
    text: "You pay on our own store's checkout, over an encrypted connection.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
        <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        <path d="M12 14.5v2.5" />
      </svg>
    ),
  },
  {
    title: "Also on Etsy",
    text: "See our Etsy shop and what buyers there say about us.",
    link: { label: "Visit our Etsy shop", href: SOCIALS[3].href },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" />
      </svg>
    ),
  },
  {
    title: "Real people, real answers",
    text: "Questions before you order? Send us a message and we'll get back to you.",
    link: { label: "Message us on Instagram", href: SOCIALS[0].href },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M4 5.5h16v10.5H10l-4.5 3.5V16H4z" />
        <path d="M8.5 10.75h.01M12 10.75h.01M15.5 10.75h.01" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

// A link that may still be a "#" placeholder: it keeps its place in the layout but goes nowhere.
function Out({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const ready = href !== "#";
  return (
    <a
      href={href}
      {...(ready ? { target: "_blank", rel: "noopener noreferrer" } : { onClick: (e) => e.preventDefault() })}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="site-footer relative overflow-hidden border-t border-white/10">
      <div className="ft-checker" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 md:px-12 md:pt-24">
        {/* Why it's safe to buy here */}
        <ul className="grid gap-4 md:grid-cols-3">
          {TRUST.map((t) => (
            <li key={t.title} className="ft-trust flex gap-4 rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent [&>svg]:h-5 [&>svg]:w-5">
                {t.icon}
              </span>
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-white/55">{t.text}</p>
                {t.link && (
                  <Out href={t.link.href} className="ft-link mt-3 inline-block text-sm text-accent">
                    {t.link.label} <span aria-hidden>→</span>
                  </Out>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-14 md:grid-cols-[1.1fr_1.4fr_0.7fr] md:gap-12">
          <div>
            <p className="font-display text-4xl uppercase leading-none tracking-wide md:text-5xl">F1 Collectibles</p>
            <p className="mt-4 max-w-xs text-white/55">Hand-finished F1 driver figures and race car desk displays.</p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.35em] text-white/45">Follow the grid</h3>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {SOCIALS.map((s) => (
                <li key={s.id}>
                  <Out
                    href={s.href}
                    aria-label={`F1 Collectibles on ${s.name}`}
                    className="ft-social group flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10 md:p-4"
                  >
                    <span className="ft-social-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 [&>svg]:h-5 [&>svg]:w-5">
                      {ICONS[s.id]}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{s.name}</span>
                      <span className="block text-xs text-white/50">{s.line}</span>
                    </span>
                  </Out>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Help">
            <h3 className="text-xs uppercase tracking-[0.35em] text-white/45">Help</h3>
            <ul className="mt-5 space-y-3">
              {HELP_LINKS.map((l) => (
                <li key={l.name}>
                  <Out href={l.href} className="ft-link text-white/70 hover:text-white">
                    {l.name}
                  </Out>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* The name again, huge and outlined, running off the bottom of the page. */}
      <p
        className="text-outline pointer-events-none mt-16 select-none whitespace-nowrap text-center font-display text-[15.6vw] uppercase leading-[0.8] md:mt-20"
        style={{ "--stroke": "rgba(255,255,255,.09)" } as React.CSSProperties}
        aria-hidden
      >
        F1 Collectibles
      </p>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between md:px-12">
          <p>© F1 Collectibles. Independent fan collectibles, not affiliated with Formula 1, the FIA, or any team or driver.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="ft-link self-start whitespace-nowrap uppercase tracking-[0.3em] text-white/60 hover:text-white md:self-auto"
          >
            Back to the start <span aria-hidden>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
