// Links shown in the footer. "#" marks a link that hasn't been filled in yet: a help link still renders but
// does nothing, and a social button stays hidden until it has a link.
export const SOCIALS = [
  { id: "instagram", name: "Instagram", line: "@3d_minime", href: "https://www.instagram.com/3d_minime" },
  { id: "tiktok", name: "TikTok", line: "@3d_minime", href: "https://www.tiktok.com/@3d_minime" },
  { id: "youtube", name: "YouTube", line: "Full videos", href: "#" },
  { id: "etsy", name: "Etsy", line: "3DminimeShop", href: "https://www.etsy.com/shop/3DminimeShop" },
] as const;

export type SocialId = (typeof SOCIALS)[number]["id"];
export const socialHref = (id: SocialId) => SOCIALS.find((s) => s.id === id)!.href;

export const HELP_LINKS = [
  { name: "Shipping", href: "#" },
  { name: "Returns & refunds", href: "#" },
  { name: "Contact us", href: "#" },
  { name: "Privacy policy", href: "#" },
];
