import type { StaticImageData } from "next/image";
import norris from "../../public/images/figure-norris.webp";
import hamilton from "../../public/images/figure-hamilton.webp";
import verstappen from "../../public/images/figure-verstappen.webp";
import mcl40 from "../../public/images/mcl40-display.webp";

// Curated items featured on the landing page. `slug` must match the WooCommerce product slug,
// which is how the page finds the real product id and price for the cart.
export type ShowcaseItem = {
  slug: string;
  name: string;
  surname: string;
  team: string;
  race: string;
  lap: string;
  accent: string;
  image: StaticImageData;
};

export const drivers: ShowcaseItem[] = [
  { slug: "lando-norris-figure", name: "Lando Norris", surname: "NORRIS", team: "McLaren", race: "Hungarian GP", lap: "1.39.56.180", accent: "#ff8000", image: norris },
  { slug: "lewis-hamilton-figure", name: "Lewis Hamilton", surname: "HAMILTON", team: "Ferrari", race: "Barcelona-Catalunya GP", lap: "1:22.78.109", accent: "#e8002d", image: hamilton },
  { slug: "max-verstappen-figure", name: "Max Verstappen", surname: "VERSTAPPEN", team: "Red Bull", race: "Bahrain GP", lap: "1:47:14.808", accent: "#3671c6", image: verstappen },
];

export const car = { slug: "mcl40-desk-display", name: "MCL-40 Desk Display", image: mcl40 };
