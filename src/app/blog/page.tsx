"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useT, T } from "@/i18n/useT";

const articles = [
  {
    slug: "china-used-car-export-guide",
    title: "China Used Car Export Guide 2026: Complete Step-by-Step",
    excerpt: "从市场分析、车辆采购、出口流程到物流运输的完整指南，帮助国际买家顺利从中国进口二手汽车。",
    date: "2026-05-28",
    category: "市场指南",
  },
  {
    slug: "how-to-import-from-china-to-kazakhstan",
    title: "How to Import Used Cars from China to Kazakhstan (2026)",
    excerpt: "详细介绍从中国向哈萨克斯坦进口二手车的流程、关税政策和注意事项。",
    date: "2026-05-25",
    category: "区域指南",
  },
  {
    slug: "best-used-cars-china-for-central-asia",
    title: "Best Used Cars from China for Central Asia Markets (2026)",
    excerpt: "分析中亚市场最受欢迎的中国二手车品牌和车型，包括价格区间和市场趋势。",
    date: "2026-05-22",
    category: "市场分析",
  },
  {
    slug: "china-ev-export-sourcing-guide",
    title: "China EV Export Sourcing Guide: BYD, NIO, Xpeng & More (2026)",
    excerpt: "中国新能源汽车出口采购全攻略，涵盖比亚迪、蔚来、小鹏等主流品牌。",
    date: "2026-05-20",
    category: "新能源车",
  },
  {
    slug: "commercial-vehicle-sourcing-from-china",
    title: "Commercial Vehicle Sourcing from China: Trucks, Vans & Buses",
    excerpt: "从中国采购商用车的完整指南，包括卡车、厢式货车和大巴车。",
    date: "2026-05-18",
    category: "商用车",
  },
];

export default function BlogPage() {
  const t = useT();

  return (
    <>
      <Header />
      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-guazi-dark mb-3">{t(T.blogPage.heading)}</h1>
        <p className="text-gray-500 text-sm mb-8">{t(T.blogPage.subheading)}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-guazi-green/30 transition-all duration-300"
            >
              <span className="text-xs text-guazi-green bg-guazi-green-light px-2 py-0.5 rounded">{a.category}</span>
              <h2 className="text-base font-bold text-guazi-dark mt-2 mb-1.5 group-hover:text-guazi-green transition-colors">{a.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{a.excerpt}</p>
              <span className="text-xs text-gray-400">{a.date}</span>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-guazi-green-light rounded-2xl p-8 text-center">
          <h2 className="text-lg font-bold text-guazi-dark mb-2">{t(T.newsletter.heading)}</h2>
          <p className="text-sm text-gray-500 mb-4">{t(T.newsletter.desc)}</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input type="email" placeholder={t(T.newsletter.placeholder)} className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-guazi-green" />
            <button className="bg-guazi-green text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-guazi-green-dark transition-all">{t(T.newsletter.subscribeBtn)}</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
