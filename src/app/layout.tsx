import type { Metadata } from "next";
import { Anton, Geist } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { DEFAULT_TEAM, restoreTeamScript } from "@/lib/team";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F1 Collectibles | Driver figures and desk displays",
  description: "Hand-painted F1 driver figures and race car desk displays on real carbon fiber bases. Every helmet fits every driver and car, with a key station and USB-C rechargeable lights.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-team={DEFAULT_TEAM} className={`${geistSans.variable} ${anton.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: restoreTeamScript }} />
      </head>
      <body className="bg-ink font-sans text-white">
        <CartProvider>
          <SmoothScroll />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
