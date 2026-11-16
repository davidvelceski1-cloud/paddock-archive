import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { AskPanel } from "@/components/ask/AskPanel";
import { AskFab } from "@/components/ask/AskFab";
import { HoverPreviews } from "@/components/layout/HoverPreviews";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

// Apple devices use the system font (see globals.css); Inter is the close match everywhere else.
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Every lap of endurance history`, template: `%s · ${SITE_NAME}` },
  description: "An AI-assisted archive of world-championship endurance racing: Le Mans since 1923, the World Sportscar Championship, the ILMC and the FIA WEC to the Hypercar era.",
  openGraph: { siteName: SITE_NAME, type: "website" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Applies the saved/OS theme before first paint. ?theme=light|dark overrides (handy for sharing and screenshots).
const THEME_SCRIPT = `try{var t=new URLSearchParams(location.search).get("theme")||localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <CommandPalette />
        <AskPanel />
        <AskFab />
        <HoverPreviews />
      </body>
    </html>
  );
}
