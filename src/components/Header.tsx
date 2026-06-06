"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useLang } from "@/i18n/LangContext";
import { useT, T } from "@/i18n/useT";
import { LANGS, LANG_NAMES, type Lang } from "@/i18n/types";

const FLAGS: Record<Lang, string> = {
  en: "🇬🇧",
  zh: "🇨🇳",
  fr: "🇫🇷",
  es: "🇪🇸",
};

export function Header() {
  const pathname = usePathname();
  const { lang: currentLang, setLang } = useLang();
  const t = useT();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const NAV_LINKS = [
    { href: "/", label: t(T.header.home) },
    { href: "/cars", label: t(T.header.allVehicles) },
    { href: "/inquiry", label: t(T.header.submitRequest) },
    { href: "/blog", label: t(T.header.blog) },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLangOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [langOpen]);

  const switchLang = (code: Lang) => {
    setLang(code);
    setLangOpen(false);
  };

  const current = FLAGS[currentLang] || "🇬🇧";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                CCE
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-gray-900 leading-tight">{t(T.site.name)}</div>
                <div className="text-[10px] text-gray-500 leading-tight tracking-wide">{t(T.site.tagline)}</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      active
                        ? "text-primary bg-primary-light"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                {t(T.header.login)}
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark hover:shadow-md transition-all active:scale-95"
              >
                {t(T.header.register)}
              </Link>
            </div>

            <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300"
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                <span className="text-base">{current}</span>
                <span className="uppercase text-xs font-bold">{currentLang.toUpperCase()}</span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 overflow-hidden animate-scale-in origin-top-right">
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t(T.header.language)}</div>
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLang(l)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 ${
                        currentLang === l
                          ? "bg-primary-light text-primary font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{FLAGS[l]}</span>
                      <span>{LANG_NAMES[l]}</span>
                      {currentLang === l && (
                        <svg className="w-4 h-4 ml-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 animate-fade-in-up">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                      active ? "bg-primary-light text-primary" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex gap-2 mt-3 px-4">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-semibold text-gray-600 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  {t(T.header.login)}
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-semibold bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark transition-colors">
                  {t(T.header.register)}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
