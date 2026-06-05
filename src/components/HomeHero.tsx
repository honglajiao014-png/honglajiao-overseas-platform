"use client";

import Link from "next/link";
import { useT } from "@/i18n/useT";
import { T } from "@/i18n/translations";

export function HomeHero() {
  const t = useT();

  return (
    <section className="relative bg-gradient-to-br from-dark via-dark-soft to-brand-deep overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="relative max-w-[1280px] mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand/20 border border-brand/30 rounded-full px-5 py-2 text-sm text-blue-200 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {t(T.hero.badge)}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {t(T.hero.title)}
          </h1>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-4 max-w-3xl mx-auto">
            {t(T.hero.subtitle)}
          </p>
          <p className="text-blue-300/60 text-sm md:text-base mb-10">
            {t(T.hero.promise)}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
          <Link
            href="/inquiry"
            className="group h-14 px-10 bg-brand text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand/30 hover:shadow-xl hover:shadow-brand/40 hover:-translate-y-1"
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t(T.hero.submitBtn)}
          </Link>
          <Link
            href="/cars"
            className="group h-14 px-10 border-2 border-gold/50 text-gold rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold/10 hover:border-gold transition-all hover:-translate-y-1"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t(T.hero.browseBtn)}
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-gray-500">
          {[t(T.hero.trust1), t(T.hero.trust2), t(T.hero.trust3), t(T.hero.trust4)].map((text, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
