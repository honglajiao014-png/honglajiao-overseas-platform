"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type Lang, LANGS, DEFAULT_LANG } from "./types";

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangCtx = createContext<LangState>({ lang: DEFAULT_LANG, setLang: () => {} });

const COOKIE_NAME = "hlj-lang";
const COOKIE_DAYS = 365;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : null;
}

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();
}

function detectLang(): Lang {
  // 1. Cookie
  const cookieVal = getCookie(COOKIE_NAME);
  if (cookieVal && LANGS.includes(cookieVal as Lang)) return cookieVal as Lang;
  // 2. Browser preference
  if (typeof navigator !== "undefined") {
    const navLang = navigator.language.slice(0, 2);
    if (navLang === "zh") return "zh";
    if (navLang === "fr") return "fr";
    if (navLang === "es") return "es";
  }
  return DEFAULT_LANG;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

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
