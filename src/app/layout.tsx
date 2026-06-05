import type { Metadata } from "next";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget";
import { LangProvider } from "@/i18n/LangContext";

export const metadata: Metadata = {
  title: "Honglajiao Auto Export | Used Car & Vehicle Export Sourcing from China",
  description:
    "Source used cars, commercial trucks, EVs and construction machinery from China. Supplier verification, real photo inspection and export coordination support. Serving Africa, Middle East and worldwide LHD markets.",
  keywords: [
    "China used car export sourcing",
    "source vehicles from China",
    "China car sourcing service",
    "used car export from China",
    "China vehicle procurement",
    "Chinese EV export sourcing",
    "commercial vehicles from China",
    "China machinery export",
    "China car export to Africa",
    "China used cars Middle East",
    "supplier verification China",
    "vehicle inspection China export",
    "中国二手车出口",
    "中国汽车出口采购",
    "中国电动车出口",
    "китайские автомобили",
    "авто из Китая",
  ],
  authors: [{ name: "Honglajiao Auto Export" }],
  creator: "Honglajiao Auto Export",
  publisher: "Honglajiao Auto Export",
  robots: "index, follow",
  googlebot: "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
  category: "automotive",
  formatDetection: { telephone: false, address: false, email: false },
  alternates: {
    canonical: "https://honglajiao1688.com",
    languages: {
      en: "https://honglajiao1688.com",
      es: "https://honglajiao1688.com/es",
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Honglajiao Auto Export | Used Car & Vehicle Export Sourcing from China",
    description:
      "Source used cars, commercial trucks, EVs and construction machinery from China. Supplier verification, real photo inspection and export coordination support. Serving Africa, Middle East and worldwide LHD markets.",
    url: "https://honglajiao1688.com",
    siteName: "Honglajiao Auto Export",
    locale: "en",
    type: "website",
    images: [
      {
        url: "https://honglajiao1688.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Honglajiao Auto Export - Vehicle Export Sourcing from China",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Honglajiao Auto Export | Used Car & Vehicle Export Sourcing from China",
    description:
      "Source used cars, commercial trucks, EVs and construction machinery from China. Supplier verification, real photo inspection and export coordination support. Serving Africa, Middle East and worldwide LHD markets.",
    images: ["https://honglajiao1688.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <LangProvider>{children}<ChatWidget /></LangProvider>
      </body>
    </html>
  );
}
