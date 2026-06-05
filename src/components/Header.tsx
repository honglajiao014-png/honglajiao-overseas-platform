"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LANGS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "sw", label: "Kiswahili", flag: "🇹🇿" },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "All Vehicles" },
  { href: "/inquiry", label: "Submit Request" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center justify-between h-[56px]">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.png" alt="ChinaCarExport" className="h-9 w-auto object-contain" />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 text-sm font-semibold transition-colors relative ${
                      active
                        ? "text-guazi-green after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-guazi-green"
                        : "text-gray-600 hover:text-guazi-green after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-guazi-green after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Register / Login */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-guazi-green px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-guazi-green text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-guazi-green-dark transition-all"
              >
                Register
              </Link>
            </div>

            {/* Lang Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <span>{LANGS.find(l => l.code === currentLang)?.flag}</span>
                <span className="font-semibold text-xs uppercase">{currentLang}</span>
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-200 z-20 py-1 overflow-hidden">
                    {LANGS.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setCurrentLang(l.code); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                          currentLang === l.code ? "bg-guazi-green-light text-guazi-green font-semibold" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-base">{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button className="md:hidden p-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
