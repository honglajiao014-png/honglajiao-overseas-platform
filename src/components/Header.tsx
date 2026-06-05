"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/i18n/LangContext";
import { useT } from "@/i18n/useT";
import { type Lang, LANGS, LANG_SHORT } from "@/i18n/types";
import { T } from "@/i18n/translations";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang, setLang } = useLang();
  const t = useT();
  const pathname = usePathname();

  const navLinks = [
    { href: "/",         label: t(T.nav.home) },
    { href: "/cars",     label: t(T.nav.vehicles) },
    { href: "/machinery",label: t(T.nav.machinery) },
    { href: "/inquiry",  label: t(T.nav.inquiry) },
    { href: "/services", label: t(T.nav.services) },
    { href: "/about",    label: t(T.nav.about) },
    { href: "/contact",  label: t(T.nav.contact) },
  ];

  const currentLang = LANGS.find(l => l === lang) || "en";

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-border shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between h-[64px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-dark font-bold text-lg tracking-tight">Honglajiao</span>
              <span className="text-gray-400 text-xs ml-1.5">{t(T.nav.autoExport)}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-8">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? "bg-brand-light text-brand"
                      : "text-gray-600 hover:text-brand hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Lang Switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{LANG_SHORT[currentLang]}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-border z-20 py-1.5 overflow-hidden">
                    {LANGS.map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          lang === l ? "bg-brand-light text-brand font-semibold" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Login */}
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* CTA */}
            <Link
              href="/inquiry"
              className="hidden md:inline-flex items-center gap-2 bg-brand text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-all shadow-sm shadow-brand/20 hover:shadow-md hover:shadow-brand/30 hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {t(T.hero.submitBtn)}
            </Link>

            {/* Mobile hamburger */}
            <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-5 border-t border-border pt-4 animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-light hover:text-brand rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 px-2">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setMobileOpen(false); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      lang === l ? "bg-brand text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {LANG_SHORT[l]}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
