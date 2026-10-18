// Links shown in the footer. "#" marks a link that hasn't been filled in yet: it renders, but does nothing.
export const SOCIALS = [
  { id: "instagram", name: "Instagram", line: "New drops", href: "#" },
  { id: "tiktok", name: "TikTok", line: "Short clips", href: "#" },
  { id: "youtube", name: "YouTube", line: "Full videos", href: "#" },
  { id: "etsy", name: "Etsy", line: "Our Etsy shop", href: "#" },
] as const;

export type SocialId = (typeof SOCIALS)[number]["id"];

export const HELP_LINKS = [
  { name: "Shipping", href: "#" },
  { name: "Returns & refunds", href: "#" },
  { name: "Contact us", href: "#" },
  { name: "Privacy policy", href: "#" },
];
