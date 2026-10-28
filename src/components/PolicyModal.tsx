"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { socialHref } from "@/lib/site";

export type PolicyId = "shipping" | "returns" | "privacy";

const UPDATED = "19 January 2026";

const Contact = ({ children = "Message us on Instagram" }: { children?: ReactNode }) => (
  <a href={socialHref("instagram")} target="_blank" rel="noopener noreferrer" className="ft-link text-accent">
    {children}
  </a>
);

type Policy = {
  title: string;
  short: string; // tab label on phones
  intro: string;
  // Two big facts shown as cards above the details.
  highlights?: { label: string; value: string; text: string }[];
  sections: { heading: string; body: ReactNode }[];
};

const POLICIES: Record<PolicyId, Policy> = {
  shipping: {
    title: "Shipping",
    short: "Shipping",
    intro: "We ship worldwide. Every order is packed with care and sent with DHL, so your figures and displays reach you quickly and safely, wherever you are.",
    highlights: [
      { label: "Ships to", value: "Worldwide", text: "We deliver internationally, so you can order from anywhere in the world." },
      { label: "Carrier", value: "DHL only", text: "We ship every order with DHL for fast, reliable and secure delivery." },
      { label: "Delivery time", value: "About 2 weeks", text: "Most orders arrive around two weeks after they're placed." },
    ],
    sections: [
      {
        heading: "When your order starts",
        body: <p>We start preparing your order as soon as payment is complete. Payment is taken in full at checkout.</p>,
      },
      {
        heading: "Delivery times",
        body: (
          <p>
            About two weeks is our usual delivery time, but it&apos;s an estimate rather than a guarantee. Customs checks, carrier
            disruptions and other things outside our control can occasionally add a few days.
          </p>
        ),
      },
      {
        heading: "Your delivery address",
        body: (
          <p>
            Please double-check your address at checkout. If a parcel has to be sent again because the address was incomplete or
            incorrect, the cost of re-delivery is paid by the customer.
          </p>
        ),
      },
      {
        heading: "Damaged or lost parcels",
        body: (
          <p>
            Once DHL collects your parcel it&apos;s in their care. If it arrives damaged, or DHL officially declares it lost, we&apos;ll
            remake your order. See <em>Returns &amp; refunds</em> for how to tell us.
          </p>
        ),
      },
    ],
  },

  returns: {
    title: "Returns & refunds",
    short: "Returns",
    intro: "Each piece is made and hand-finished for your order, so we can't take returns. If something's wrong when it arrives, we'll put it right.",
    sections: [
      {
        heading: "All sales are final",
        body: (
          <p>
            Because every order is made for you, sales are final and not refundable. Once production has started an order can&apos;t be
            cancelled, and changes may not be possible (or may cost extra).
          </p>
        ),
      },
      {
        heading: "When we remake your order",
        body: (
          <>
            <p>We review every claim and remake your order when:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-accent">
              <li>it arrives damaged or defective,</li>
              <li>it has a significant structural defect, or differs in a major way from what&apos;s shown on this page, or</li>
              <li>DHL officially declares the parcel lost.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "How to make a claim",
        body: (
          <p>
            Contact us within <strong className="text-white">48–72 hours of delivery</strong> with clear photos or a video of the
            problem, including the packaging if it was damaged in transit. <Contact /> and we&apos;ll take it from there.
          </p>
        ),
      },
      {
        heading: "Hand-painted, not mass-produced",
        body: (
          <p>
            Every figure is painted by hand, so small differences in colour, proportions or texture are part of its character. They
            aren&apos;t treated as defects and aren&apos;t grounds for a remake or refund.
          </p>
        ),
      },
      {
        heading: "Collectibles, not toys",
        body: <p>Our products are for display only. They contain small parts and aren&apos;t suitable for children.</p>,
      },
      {
        heading: "If we can't agree",
        body: (
          <p>
            We&apos;ll always try to resolve any issue with you directly first. These terms are governed by the laws of Finland, and
            any dispute we can&apos;t settle together goes to the competent courts in Finland, unless the consumer law where you live
            says otherwise.
          </p>
        ),
      },
    ],
  },

  privacy: {
    title: "Privacy policy",
    short: "Privacy",
    intro: "We only use your details to get your order to you and to help when you contact us.",
    sections: [
      {
        heading: "What we collect and why",
        body: (
          <p>
            We collect the details you give us when you order or get in touch, such as your name, contact details and delivery
            address. We use them only to fulfil your order, provide customer service and meet our legal obligations.
          </p>
        ),
      },
      {
        heading: "Who we share it with",
        body: (
          <>
            <p>Your details are shared only with the services needed to complete your order:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-accent">
              <li>our payment processors, to take payment,</li>
              <li>DHL, to deliver your parcel, and</li>
              <li>service providers that are essential to fulfilling your order.</li>
            </ul>
            <p className="mt-3">We don&apos;t share your data with anyone else.</p>
          </>
        ),
      },
      {
        heading: "Keeping it safe",
        body: (
          <p>
            Checkout runs over an encrypted connection and we take reasonable measures to protect your data. No online system can be
            completely immune to cyber threats, but we work to keep the risk as low as possible.
          </p>
        ),
      },
      {
        heading: "On this page",
        body: (
          <p>
            This page uses a cookie to remember what&apos;s in your cart, and your browser remembers the team colours you picked. We
            don&apos;t use advertising trackers.
          </p>
        ),
      },
      {
        heading: "Who we are",
        body: (
          <p>
            F1 Collectibles is run by 3dminime. Parent companies: Ketonen Import Export (FI25101203) and Panda Coding (3916928).
            Questions about your data? <Contact>Message us on Instagram</Contact>.
          </p>
        ),
      },
    ],
  },
};

export const POLICY_IDS = Object.keys(POLICIES) as PolicyId[];

export function PolicyModal({ open, onSelect }: { open: PolicyId | null; onSelect: (id: PolicyId | null) => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  // Escape closes; focus moves into the dialog and back to the link that opened it.
  useEffect(() => {
    if (!open) return;
    opener.current ??= document.activeElement;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onSelect(null);
    window.addEventListener("keydown", onKey);
    // Hold the page still behind the dialog (Lenis ignores events inside it via data-lenis-prevent).
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = "";
    };
  }, [open, onSelect]);

  useEffect(() => {
    if (open) {
      panel.current?.focus({ preventScroll: true });
      panel.current?.querySelector("[data-scroll]")?.scrollTo({ top: 0 });
    } else if (opener.current) {
      (opener.current as HTMLElement).focus?.({ preventScroll: true });
      opener.current = null;
    }
  }, [open]);

  const p = open && POLICIES[open];

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => onSelect(null)} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-title"
            tabIndex={-1}
            className="relative flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-ink shadow-2xl outline-none ring-1 ring-white/10 md:max-h-[85vh] md:rounded-3xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="ft-checker shrink-0" aria-hidden />

            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-6 pb-5 pt-6 md:px-10 md:pt-8">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Help</p>
                <h2 id="policy-title" className="mt-2 font-display text-3xl uppercase leading-none tracking-wide md:text-4xl">
                  {p.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onSelect(null)}
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-2xl leading-none text-white/70 ring-1 ring-white/10 transition hover:bg-accent hover:text-accent-ink"
              >
                ×
              </button>
            </header>

            <div data-scroll className="flex-1 overscroll-contain overflow-y-auto px-6 py-6 md:px-10 md:py-8">
              <p className="text-lg text-white/80">{p.intro}</p>

              {p.highlights && (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {p.highlights.map((h) => (
                    <li key={h.label} className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 sm:first:col-span-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/45">{h.label}</p>
                      <p className="mt-2 font-display text-2xl uppercase tracking-wide text-accent">{h.value}</p>
                      <p className="mt-1 text-sm text-white/55">{h.text}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 space-y-7">
                {p.sections.map((s) => (
                  <section key={s.heading}>
                    <h3 className="font-semibold">{s.heading}</h3>
                    <div className="mt-2 text-[15px] leading-relaxed text-white/60">{s.body}</div>
                  </section>
                ))}
              </div>

              <p className="mt-10 text-xs text-white/35">Last updated {UPDATED}</p>
            </div>

            <nav aria-label="Other policies" className="grid shrink-0 grid-cols-3 gap-2 border-t md:flex border-white/10 px-6 py-4 md:px-10">
              {POLICY_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelect(id)}
                  aria-current={id === open ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-xs md:px-4 uppercase tracking-[0.2em] ring-1 transition ${
                    id === open ? "bg-accent text-accent-ink ring-accent" : "text-white/60 ring-white/15 hover:text-white hover:ring-white/40"
                  }`}
                >
                  <span className="md:hidden">{POLICIES[id].short}</span>
                  <span className="hidden md:inline">{POLICIES[id].title}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
