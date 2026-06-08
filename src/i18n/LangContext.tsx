"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type Lang, LANGS, DEFAULT_LANG } from "./types";

// 导出 LANGS / DEFAULT_LANG 供 layout SSR 使用
export { LANGS, DEFAULT_LANG };
export type { Lang };

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangCtx = createContext<LangState>({ lang: DEFAULT_LANG, setLang: () => {} });

const COOKIE_NAME = "hlj-lang";
const COOKIE_DAYS = 365;

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();
}

/**
 * 客户端检测语言：cookie → 浏览器偏好 → 默认
 * SSR 阶段不执行，由 layout 传 initialLang 兜底
 */
function detectLang(): Lang {
  if (typeof document === "undefined") return DEFAULT_LANG;
  // 1. Cookie
  const v = document.cookie.match("(^|;) ?" + COOKIE_NAME + "=([^;]*)(;|$)");
  const cookieVal = v ? v[2] : null;
  if (cookieVal && LANGS.includes(cookieVal as Lang)) return cookieVal as Lang;
  // 2. Browser preference
  const navLang = navigator.language.slice(0, 2);
  if (navLang === "zh") return "zh";
  if (navLang === "fr") return "fr";
  // 3. Default
  return DEFAULT_LANG;
}

export function LangProvider({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang || DEFAULT_LANG);

  // 客户端 hydration 后用 cookie/浏览器检测覆盖 SSR initialLang
  useEffect(() => {
    setLangState(detectLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    setCookie(COOKIE_NAME, l, COOKIE_DAYS);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang() {
  return useContext(LangCtx);
}
