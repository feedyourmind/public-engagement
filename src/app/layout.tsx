import type { Metadata } from "next";
import { Suspense } from "react";
import { Lora, DM_Sans, DM_Mono } from "next/font/google";
import TopNav from "@/components/TopNav";
import LayoutProviders from "@/components/LayoutProviders";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The AI X-Risk Spectrum — Eversell",
  description:
    "An interactive scrollytelling visualization of how people perceive AI risk, from full dismissal to existential alarm.",
  openGraph: {
    title: "The AI X-Risk Spectrum",
    description:
      "Explore the spectrum of AI risk perception through an interactive distribution visualization.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body className="bg-bg text-text font-body pt-12">
        <LayoutProviders>
          <Suspense>
            <TopNav />
          </Suspense>
          {children}
        </LayoutProviders>
      </body>
    </html>
  );
}
