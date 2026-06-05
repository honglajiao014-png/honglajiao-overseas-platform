"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/cars", label: "全部车源" },
    { href: "/inquiry", label: "提交需求" },
    { href: "/blog", label: "博客" },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center justify-between h-[56px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="ChinaCarExport" className="h-8 w-auto" />
            <span className="hidden sm:inline text-sm text-gray-500">ChinaCarExport</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
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

          {/* Mobile */}
          <button className="md:hidden p-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
