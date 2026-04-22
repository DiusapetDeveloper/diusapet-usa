import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { IntroSequence } from "@/components/intro-sequence";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Diusapet USA — Strategic Business Case",
  description:
    "Business case interno per l'espansione di Diusapet negli Stati Uniti. Riservato — uso interno.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="it"
      className={`${plexSans.variable} ${plexSerif.variable}`}
    >
      <body>
        <IntroSequence />
        <SmoothScrollProvider>
          <Navbar />
          <main className="pt-24 md:pt-28">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
