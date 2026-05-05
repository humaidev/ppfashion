import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pakistani Passion for Fashion | Elite Designer Collective",
  description: "The digital home for elite Pakistani fashion designers. Join the most exclusive fashion community in the UK.",
  keywords: ["Pakistani Fashion", "South Asian Designers", "Fashion Show UK", "Designer Membership", "PPFF"],
  openGraph: {
    title: "Pakistani Passion for Fashion | Elite Designer Collective",
    description: "The digital home for elite Pakistani fashion designers.",
    type: "website",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-warm-ivory text-luxury-black dark:bg-luxury-black dark:text-warm-ivory"
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1 pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
