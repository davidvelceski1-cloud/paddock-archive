import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { AskPanel } from "@/components/ask/AskPanel";
import { AskFab } from "@/components/ask/AskFab";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Every lap of endurance history`, template: `%s · ${SITE_NAME}` },
  description: "An AI-assisted archive of world-championship endurance racing: Le Mans since 1923, the World Sportscar Championship, the ILMC and the FIA WEC to the Hypercar era.",
  openGraph: { siteName: SITE_NAME, type: "website" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d17" },
  ],
};

// Applies the saved/OS theme before first paint. ?theme=light|dark overrides (handy for sharing and screenshots).
const THEME_SCRIPT = `try{var t=new URLSearchParams(location.search).get("theme")||localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
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
      </body>
    </html>
  );
}
