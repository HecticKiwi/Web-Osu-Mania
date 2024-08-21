import { Toaster } from "@/components/ui/toaster";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import "./globals.css";
import Script from "next/script";

export const varelaRound = Varela_Round({ subsets: ["latin"], weight: "400" });

gsap.registerPlugin(useGSAP);

export const metadata: Metadata = {
  title: "Web Osu Mania",
  description: "Play osu! Mania in your web browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scrollbar scrollbar-track-background scrollbar-thumb-primary"
    >
      <body className={`${varelaRound.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
