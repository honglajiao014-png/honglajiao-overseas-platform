"use client";

import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const { lang: currentLang, setLang } = useLang();
  const t = useT();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const NAV_LINKS = [
    { href: "/", label: t(T.header.home) },
    { href: "/cars", label: t(T.header.allVehicles) },
    { href: "/inquiry", label: t(T.header.submitRequest) },
    { href: "/blog", label: t(T.header.blog) },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { setLangOpen(false); setSearchOpen(false); } };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const switchLang = (code: Lang) => {
    setLang(code);
    setLangOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/cars?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  const current = FLAGS[currentLang] || "🇬🇧";

  return (
    <header className="bg-[#1a1a1a] sticky top-0 z-50">
      {/* 顶部栏 */}
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img
              src="/logo.png"
              alt="ChinaCarExport"
              className="w-10 h-10 rounded-xl object-cover shadow-lg group-hover:shadow-primary/30 transition-shadow"
            />
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-white leading-tight">{t(T.site.name)}</div>
              <div className="text-[10px] text-gray-400 leading-tight tracking-wide">{t(T.site.tagline)}</div>
            </div>
          </a>

          {/* 导航 */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? "text-primary bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-2">
            {/* 搜索按钮 */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="搜索"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* 电话 */}
            <a
              href="tel:+8615208423621"
              className="hidden md:flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors px-3 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +86 152 0842 3621
            </a>

            {/* 语言切换 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                aria-expanded={langOpen}
              >
                <span className="text-base">{current}</span>
                <span className="uppercase text-xs font-bold hidden sm:inline">{currentLang === "zh" ? "中" : currentLang.toUpperCase()}</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#2a2a2a] rounded-xl shadow-xl border border-gray-700 z-20 py-1 overflow-hidden">
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLang(l)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 ${
                        currentLang === l
                          ? "bg-primary/20 text-primary font-semibold"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-lg">{FLAGS[l]}</span>
                      <span>{LANG_NAMES[l]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 登录/注册 */}
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <a
                href="/login"
                className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
              >
                {t(T.header.login)}
              </a>
              <span className="text-gray-600">/</span>
              <a
                href="/register"
                className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
              >
                {t(T.header.register)}
              </a>
            </div>

            {/* 管理后台 */}
            <a
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold text-accent hover:text-accent-dark hover:bg-accent/10 transition-all"
              title="管理后台"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>管理者</span>
            </a>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="菜单"
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

        {/* 搜索栏展开 */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4">
            <div className="flex gap-2 max-w-xl">
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="搜索品牌、车型..."
                className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                autoFocus
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-primary-dark transition-all"
              >
                搜索
              </button>
            </div>
          </form>
        )}

        {/* 移动端菜单 */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-800 py-4">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active ? "bg-white/10 text-primary" : "text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="flex gap-2 mt-3 px-4">
                <a href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-medium text-gray-300 border border-gray-700 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                  {t(T.header.login)}
                </a>
                <a href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-medium bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark transition-colors">
                  {t(T.header.register)}
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
