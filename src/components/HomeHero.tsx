"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/cars?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="hero-section relative bg-gradient-to-br from-guazi-dark via-gray-900 to-guazi-dark overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-guazi-green/20 to-transparent" />

      <div className="relative max-w-[1600px] mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-guazi-green/20 border border-guazi-green/30 rounded-full px-4 py-1.5 text-sm text-guazi-green mb-6">
            <span className="w-2 h-2 bg-guazi-green rounded-full animate-pulse" />
            Africa Vehicle Sourcing Platform — From China to Africa
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Source Used Cars, EVs &amp; Commercial Vehicles<br />from China to Africa
          </h1>
          <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
            ChinaCarExport — 专注非洲市场，从中国采购真实可核验的二手车、新能源车和工程机械。报价前提供真实照片、实车验车和出口流程支持。
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex max-w-xl gap-2 mb-8">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by brand, model, or keyword..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-guazi-green focus:bg-white/15 transition-all text-sm"
              />
            </div>
            <button type="submit" className="px-6 py-3.5 bg-guazi-green text-white rounded-lg font-bold text-sm hover:bg-guazi-green-dark transition-all">
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-4">
            <Link href="/inquiry"
              className="px-5 py-2.5 border-2 border-white/50 text-white text-sm font-semibold rounded-lg hover:bg-white/10 hover:border-white/80 transition-all duration-200 whitespace-nowrap">
              Submit Buying Request
            </Link>
            <Link href="/cars"
              className="px-5 py-2.5 bg-white text-guazi-green text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap shadow-sm">
              Browse All Vehicles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
