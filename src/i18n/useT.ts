"use client";

import { useLang } from "./LangContext";
import { T } from "./translations";
import type { Lang } from "./types";

type TransEntry = Record<Lang, string>;

/**
 * 客户端 useT hook — 带三级兜底：
 *   key[lang]（非空） → key.en → "(missing)" with console.warn
 */
export function useT() {
  const { lang } = useLang();
  return function t(key: TransEntry, keyName?: string): string {
    if (key[lang]) return key[lang];
    if (key.en) return key.en;
    if (keyName) console.warn("[i18n] Missing translation:", keyName);
    return keyName || "";
  };
}

/**
 * 服务端 t() 函数 — 接收显式 lang 参数
 * 用于 SSR / generateMetadata 等场景
 */
export function tServer(lang: Lang) {
  return function t(key: TransEntry, keyName?: string): string {
    if (key[lang]) return key[lang];
    if (key.en) return key.en;
    if (keyName) console.warn("[i18n ssr] Missing translation:", keyName);
    return keyName || "";
  };
}

export { T };
