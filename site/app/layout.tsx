import type { Metadata } from "next";
import { Instrument_Serif, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Vroom Diaries — Varun Teja Cherukuthota",
  description:
    "Photography portfolio of Varun Teja Cherukuthota — Design Head, CBIT Photography Club. Street, portrait, and landscape frames from @vrooms_diaries.",
  openGraph: {
    title: "Vroom Diaries — Varun Teja Cherukuthota",
    description: "Frames that speak louder than words.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-bg text-ink font-body antialiased">
        {children}
      </body>
    </html>
  );
}
