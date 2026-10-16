import type { StaticImageData } from "next/image";
import norrisBody from "../../public/images/norris-body.webp";
import norrisHelmet from "../../public/images/norris-helmet.webp";
import norrisVisor from "../../public/images/norris-visor.webp";
import hamiltonBody from "../../public/images/hamilton-body.webp";
import hamiltonHelmet from "../../public/images/hamilton-helmet.webp";
import hamiltonVisor from "../../public/images/hamilton-visor.webp";
import verstappenBody from "../../public/images/verstappen-body.webp";
import verstappenHelmet from "../../public/images/verstappen-helmet.webp";
import verstappenVisor from "../../public/images/verstappen-visor.webp";
import mcl40 from "../../public/images/mcl40-display.webp";
import helmetMclaren from "../../public/images/helmet-mclaren.webp";
import helmetFerrari from "../../public/images/helmet-ferrari.webp";
import helmetRedbull from "../../public/images/helmet-redbull.webp";
import type { TeamId } from "./team";

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
  // Body+base and helmet are separate transparent layers on the same frame. The helmet layer
  // floats above the body; `seat` is how far (as % of the frame height) it drops to sit on the neck.
  body: StaticImageData;
  helmet: StaticImageData;
  seat: string;
  // Lit copy of the visor (same frame) and its centre, used for the glow when the helmet seats.
  visor: StaticImageData;
  visorAt: { x: string; y: string };
};

export const drivers: ShowcaseItem[] = [
  { slug: "lando-norris-figure", name: "Lando Norris", surname: "NORRIS", team: "McLaren", race: "Hungarian GP", lap: "1.39.56.180", accent: "#ff8000", body: norrisBody, helmet: norrisHelmet, seat: "6.7%", visor: norrisVisor, visorAt: { x: "51%", y: "16%" } },
  { slug: "lewis-hamilton-figure", name: "Lewis Hamilton", surname: "HAMILTON", team: "Ferrari", race: "Barcelona-Catalunya GP", lap: "1:22.78.109", accent: "#e8002d", body: hamiltonBody, helmet: hamiltonHelmet, seat: "6.5%", visor: hamiltonVisor, visorAt: { x: "54%", y: "18%" } },
  { slug: "max-verstappen-figure", name: "Max Verstappen", surname: "VERSTAPPEN", team: "Red Bull", race: "Bahrain GP", lap: "1:47:14.808", accent: "#3671c6", body: verstappenBody, helmet: verstappenHelmet, seat: "6.5%", visor: verstappenVisor, visorAt: { x: "50%", y: "17%" } },
];

export const car = { slug: "mcl40-desk-display", name: "MCL-40 Desk Display", image: mcl40 };

// Teams offered in the hero picker. Each team's colours are defined in globals.css under [data-team].
export const teams: { id: TeamId; name: string; swatch: string; helmet: StaticImageData; alt: string }[] = [
  { id: "mclaren", name: "McLaren", swatch: "#ff8000", helmet: helmetMclaren, alt: "Neon yellow McLaren race helmet with black tiger-stripe livery" },
  { id: "ferrari", name: "Ferrari", swatch: "#e8002d", helmet: helmetFerrari, alt: "Yellow Ferrari race helmet with red pinstripes and stars" },
  { id: "redbull", name: "Red Bull", swatch: "#e4002b", helmet: helmetRedbull, alt: "White Red Bull race helmet with red and blue livery" },
];
