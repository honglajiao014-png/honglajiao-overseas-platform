import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { LangProvider } from "@/i18n/LangContext";

// 强制动态渲染 — 确保 cookies() 在请求时执行，而非 build 时
export const dynamic = "force-dynamic";

// 本地常量，不引用 client module，避免 RSC 序列化成 client reference
const LANGS = ["en", "fr", "ar", "zh"] as const;
const DEFAULT_LANG = "en";
const RTL_LANGS = new Set(["ar"]);
type Lang = (typeof LANGS)[number];

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
  alternates: {
    canonical: "https://honglajiao1688.com",
    languages: {
      en: "https://honglajiao1688.com",
      fr: "https://honglajiao1688.com/fr",
      ar: "https://honglajiao1688.com/ar",
      zh: "https://honglajiao1688.com/zh",
      "x-default": "https://honglajiao1688.com",
    },
  },
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
    card: "summary_large_image",
    title: "ChinaCarExport | Used Car & Vehicle Export Sourcing from China",
    description:
      "Source used cars, commercial trucks, EVs and construction machinery from China.",
    images: ["https://honglajiao1688.com/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // SSR: 直接读取请求 cookie，确定初始语言
  // 注意：不要引用 client module 的 DEFAULT_LANG，用本地常量避免 RSC 序列化问题
  let initialLang: Lang = DEFAULT_LANG;
  try {
    const cookieStore = await cookies();
    const langCookie = cookieStore.get("hlj-lang")?.value;
    if (langCookie && LANGS.includes(langCookie as Lang)) {
      initialLang = langCookie as Lang;
    }
  } catch {
    // build/edge 环境下可能不可用
  }

  return (
    <html lang={initialLang} dir={RTL_LANGS.has(initialLang) ? "rtl" : "ltr"}>
      <body className="min-h-screen flex flex-col">
        <LangProvider initialLang={initialLang}>
          {children}
          <ChatWidget />
          <WhatsAppButton />
        </LangProvider>
        {/* Organization 结构化数据 — JSON-LD Schema（body 底部，搜索引擎可解析） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ChinaCarExport",
              url: "https://honglajiao1688.com",
              logo: "https://honglajiao1688.com/logo.png",
              description:
                "Source used cars, commercial trucks, EVs and construction machinery from China. Supplier verification, real photo inspection and export coordination support. Serving Central Asia, Africa and worldwide markets.",
              sameAs: [],
            }),
          }}
        />
      </body>
    </html>
  );
}
