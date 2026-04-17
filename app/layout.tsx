import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Fraunces,
  IBM_Plex_Mono,
  Instrument_Sans,
} from "next/font/google";
import "./globals.css";

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const accentFont = Fraunces({
  variable: "--font-accent",
  subsets: ["latin"],
});

const bodyFont = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Vibe Rock Band",
  description:
    "A cinematic AI concert app where the user directs a virtual band with typed music directions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${accentFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
