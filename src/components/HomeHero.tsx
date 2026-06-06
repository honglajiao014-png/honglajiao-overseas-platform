"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/i18n/useT";
import { T } from "@/i18n/translations";

const STATS = [
  { value: "500+" },
  { value: "15+" },
  { value: "98%" },
  { value: "7" },
];

export function HomeHero() {
  const router = useRouter();
  const t = useT();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/cars?search=${encodeURIComponent(query.trim())}`);
  };

  const H = T.homeHero;
  const statsKeys = [H.statsVehicles, H.statsCountries, H.statsSatisfaction, H.statsYears];

  return (
    <section className="relative bg-gradient-to-br from-dark via-dark-800 to-dark overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative container-wide py-16 md:py-24 lg:py-28">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm text-primary-dark font-semibold mb-8 animate-fade-in-up">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            {t(H.trustBadge)}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {t(H.heroTitle)}
            <br />
            <span className="text-gray-400 text-2xl md:text-3xl lg:text-4xl">{t(H.heroSubtitle)}</span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg mb-8 max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {t(H.heroDesc)}
          </p>

          <form onSubmit={handleSearch} className="flex max-w-2xl gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <div className="flex-1 relative group">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t(H.searchPlaceholder)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white/15 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            <button type="submit" className="px-6 py-4 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t(H.search)}
            </button>
          </form>

          <div className="flex flex-wrap gap-4 mb-14 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <Link href="/inquiry" className="btn bg-accent text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-accent-dark hover:shadow-lg transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t(H.ctaInquiry)}
            </Link>
            <Link href="/cars" className="btn-outline bg-white/10 text-white border-white/30 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 hover:border-white/50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {t(H.ctaBrowse)}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl animate-fade-in-up" style={{ animationDelay: "500ms" }}>
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-400 font-medium">{t(statsKeys[i])}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="container-wide py-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {[
              { icon: "🔍", key: H.trust1 },
              { icon: "✅", key: H.trust2 },
              { icon: "🚢", key: H.trust3 },
              { icon: "🔒", key: H.trust4 },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400 text-xs md:text-sm font-medium">
                <span>{badge.icon}</span>
                <span>{t(badge.key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
