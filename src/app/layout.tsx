import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChinaCarExport | Used Car & Vehicle Export Sourcing from China",
  description:
    "Source used cars, commercial trucks, EVs and construction machinery from China. Supplier verification, real photo inspection and export coordination support. Serving Central Asia, Russia, Africa and worldwide markets.",
  keywords: [
    "China used car export sourcing",
    "source vehicles from China",
    "China car sourcing service",
    "used car export from China",
    "China vehicle procurement",
    "Chinese EV export sourcing",
    "commercial vehicles from China",
    "China machinery export",
    "China car export to Kazakhstan",
    "China used cars Central Asia",
    "supplier verification China",
    "vehicle inspection China export",
    "китайские автомобили",
    "авто из Китая",
    "экспорт авто из Китая",
    "中国二手车出口",
    "中国汽车出口采购",
  ],
  authors: [{ name: "ChinaCarExport" }],
  creator: "ChinaCarExport",
  publisher: "ChinaCarExport",
  robots: "index, follow",
  googlebot: "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
  category: "automotive",
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: "https://honglajiao1688.com" },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "ChinaCarExport | Used Car & Vehicle Export Sourcing from China",
    description:
      "Source used cars, commercial trucks, EVs and construction machinery from China. Supplier verification, real photo inspection and export coordination support.",
    url: "https://honglajiao1688.com",
    siteName: "ChinaCarExport",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChinaCarExport | Used Car & Vehicle Export Sourcing from China",
    description:
      "Source used cars, commercial trucks, EVs and construction machinery from China.",
  },
  verification: { google: "7kuVqqd5ahwieWZAhj-UbOVZmeytI79FbUyD4DFCYWo" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
