"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useT } from "@/i18n/useT";
import { T } from "@/i18n/translations";

const MACHINERY_TYPES = [
  { key: "excavator", icon: "⛏️" },
  { key: "loader",    icon: "🚜" },
  { key: "bulldozer", icon: "🏗️" },
  { key: "crane",     icon: "🏗️" },
  { key: "roller",    icon: "🛞" },
  { key: "forklift",  icon: "🔧" },
  { key: "grader",    icon: "📐" },
  { key: "dumper",    icon: "🚛" },
  { key: "mixer",     icon: "🔄" },
  { key: "tractor",   icon: "🚜" },
  { key: "other",     icon: "⚙️" },
];

export default function MachineryPage() {
  const t = useT();
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="bg-dark py-14 flex-1">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              {t(T.machinery.heading)}
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t(T.machinery.subheading)}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {MACHINERY_TYPES.map((m) => {
              const label = t((T.machinery as Record<string, {en:string;fr:string;es:string;zh:string;ar:string;sw:string;pt:string}>)[m.key]);
              return (
                <div key={m.key} className="bg-dark-soft rounded-xl p-5 text-center border border-gray-800 hover:border-gold/30 transition-all group">
                  <span className="text-3xl block mb-2">{m.icon}</span>
                  <span className="text-sm font-bold text-white group-hover:text-gold transition-colors">{label}</span>
                </div>
              );
            })}
          </div>

          <div className="text-center bg-dark-soft border border-gray-800 rounded-xl p-10 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-2">{t(T.machinery.noItems)}</h2>
            <Link
              href="/inquiry"
              className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-brand text-white rounded-lg font-bold text-sm hover:bg-brand-dark transition-all shadow-lg shadow-brand/20"
            >
              {t(T.hero.submitBtn)}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
