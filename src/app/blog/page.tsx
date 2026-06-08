"use client";

import { Header } from "@/components/Header";
import { Footer, ResourceSection } from "@/components/Footer";

import { useT, T } from "@/i18n/useT";

const articles = [
  {
    slug: "china-used-car-export-guide",
    title: "China Used Car Export Guide 2026: Complete Step-by-Step",
    summary: "Covers sourcing, inspection, documentation, customs, shipping, and costs for exporting used cars from China. Updated for 2026.",
    date: "2026-05-15",
    category: "Export Guide",
  },
  {
    slug: "how-to-import-from-china-to-kazakhstan",
    title: "How to Import Used Cars from China to Kazakhstan (2026)",
    summary: "Step-by-step guide for Kazakh buyers covering customs duties, required documents, shipping options, and first-time importer tips.",
    date: "2026-05-12",
    category: "Import Guide",
  },
  {
    slug: "best-used-cars-china-for-central-asia",
    title: "Best Used Cars from China for Central Asia Markets (2026)",
    summary: "Top 10 used car models offering best value for Central Asian buyers, comparing Toyota, BMW, Mercedes, Hyundai, and Chinese brands.",
    date: "2026-05-10",
    category: "Buying Guide",
  },
  {
    slug: "china-ev-export-sourcing-guide",
    title: "China EV Export Sourcing Guide: BYD, NIO, Xpeng & More (2026)",
    summary: "Complete EV sourcing guide with BYD vs NIO vs Xpeng comparison, battery health checks, and export regulations for EVs.",
    date: "2026-05-08",
    category: "EV Guide",
  },
  {
    slug: "commercial-vehicle-sourcing-from-china",
    title: "Commercial Vehicle Sourcing from China: Trucks, Vans & Buses",
    summary: "How to source commercial vehicles including HOWO, Foton, Dongfeng, BYD commercial, covering bulk ordering, quality inspection, and shipping logistics.",
    date: "2026-05-05",
    category: "Commercial",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Export Guide": "bg-blue-100 text-blue-700",
  "Import Guide": "bg-green-100 text-green-700",
  "Buying Guide": "bg-purple-100 text-purple-700",
  "EV Guide": "bg-emerald-100 text-emerald-700",
  "Commercial": "bg-orange-100 text-orange-700",
};

export default function BlogPage() {
  const t = useT();

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t(T.blogPage.heading)}</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">{t(T.blogPage.subheading)}</p>
          </div>
        </section>

        {/* 文章列表 */}
        <section className="max-w-[900px] mx-auto px-4 py-10">
          <div className="space-y-6">
            {articles.map(a => (
              <a
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${CATEGORY_COLORS[a.category] || "bg-gray-100 text-gray-600"}`}>
                    {a.category}
                  </span>
                  <span className="text-xs text-gray-400">{a.date}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                  {a.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                  {a.summary}
                </p>
                <span className="text-sm font-bold text-primary group-hover:underline">
                  {t(T.blogPage.readMore)}
                </span>
              </a>
            ))}
          </div>

          {/* CTA — 直接展示联系方式 */}
          <div className="mt-12 bg-primary-light rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">联系我们</h2>
            <p className="text-sm text-gray-500 mb-5">如需了解更多出口服务，请通过以下方式直接联系</p>
            <div className="flex flex-col items-center gap-3 mb-5">
              <a href="tel:+8615208423621" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary transition-colors">
                <span>📱</span> +86 152 0842 3621
              </a>
              <a href="mailto:info@honglajiao1688.com" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary transition-colors">
                <span>📧</span> info@honglajiao1688.com
              </a>
            </div>
            <div className="flex items-center justify-center gap-3">
              <a href="https://wa.me/8615208423621" className="inline-flex items-center gap-1.5 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark transition-all">
                <span>💬</span> WhatsApp
              </a>
              <a href="/contact" className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-white hover:border-primary transition-all">
                询价表单
              </a>
            </div>
          </div>
        </section>

        <ResourceSection />
      </main>
      <Footer />
    </>
  );
}
