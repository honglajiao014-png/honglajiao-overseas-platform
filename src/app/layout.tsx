import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget";
import { LangProvider, LANGS, DEFAULT_LANG } from "@/i18n/LangContext";
import type { Lang } from "@/i18n/LangContext";

// 元数据兜底 — 固定英文（SEO 需要稳定）
export const metadata: Metadata = {
  title: "ChinaCarExport | Used Car & Vehicle Export Sourcing from China",
  description:
    "Source used cars, commercial trucks, EVs and construction machinery from China. Supplier verification, real photo inspection and export coordination support. Serving Central Asia, Africa and worldwide markets.",
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
    "China used cars Africa",
    "supplier verification China",
    "vehicle inspection China export",
    "中国二手车出口",
    "中国汽车出口采购",
  ],
  authors: [{ name: "ChinaCarExport" }],
  creator: "ChinaCarExport",
  publisher: "ChinaCarExport",
  robots: "index, follow",
  category: "automotive",
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: "https://honglajiao1688.com" },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    title: "ChinaCarExport | Used Car & Vehicle Export Sourcing from China",
    description:
      "Source used cars, commercial trucks, EVs and construction machinery from China. Supplier verification, real photo inspection and export coordination support.",
    url: "https://honglajiao1688.com",
    siteName: "ChinaCarExport",
    locale: "en",
    type: "website",
    images: [
      {
        url: "https://honglajiao1688.com/logo.png",
        width: 384,
        height: 384,
        alt: "ChinaCarExport",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ChinaCarExport | Used Car & Vehicle Export Sourcing from China",
    description:
      "Source used cars, commercial trucks, EVs and construction machinery from China.",
    images: ["https://honglajiao1688.com/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // SSR: 从 middleware 设置的请求头读取语言
  // 比 cookies() 更可靠，因为 middleware 在每个请求前执行
  let initialLang: Lang = DEFAULT_LANG;
  try {
    const headersList = await headers();
    const langFromHeader = headersList.get("x-hlj-lang");
    if (langFromHeader && LANGS.includes(langFromHeader as Lang)) {
      initialLang = langFromHeader as Lang;
    }
  } catch {
    // headers() 在 build 时可能不可用，兜底
  }

  return (
    <html lang={initialLang}>
      <body className="min-h-screen flex flex-col">
        <LangProvider initialLang={initialLang}>
          {children}
          <ChatWidget />
        </LangProvider>
      </body>
    </html>
  );
}
