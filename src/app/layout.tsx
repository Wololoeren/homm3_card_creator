import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import StoreProvider from "./StoreProvider";
import Toaster from "@/components/Toaster";
config.autoAddCss = false;

const liberationSerif = localFont({
  src: [
    {
      path: "../assets/fonts/LiberationSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/LiberationSerif-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/LiberationSerif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/LiberationSerif-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-liberation-serif",
  display: "swap",
});

// The card face font. Two weights exist, and both cover Latin-1 only, so
// Liberation Serif stays behind them as the fallback.
//
// Semibold is declared as 600-900 rather than a bare 600 so that `font-weight:
// bold` (700) on card titles lands on the real Semibold face instead of a
// synthetic bolding of Regular.
const timesNrMtStd = localFont({
  src: [
    {
      path: "../assets/fonts/TimesNRMTStd-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/TimesNRMTStd-SemiBold.otf",
      weight: "600 900",
      style: "normal",
    },
  ],
  variable: "--font-times-nr-mt-std",
  display: "swap",
  // Without this Next injects a `local(Arial)` fallback face ahead of our own
  // stack, so the Cyrillic this font lacks would render sans-serif.
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Card Creator",
  description: "Card Creator - Heroes 3 Board Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${liberationSerif.variable} ${timesNrMtStd.variable}`}
    >
      <head>
        <link rel="icon" href="images/initiative.png" type="image/png" />
      </head>
      {/*
        Grammarly and friends stamp their own attributes onto <body> before
        React hydrates, which reads as a mismatch no amount of our own care can
        prevent. The flag covers this element's attributes and text only, not
        anything below it, so a real mismatch inside the app still reports.
      */}
      <body suppressHydrationWarning>
        <StoreProvider>{children}</StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
