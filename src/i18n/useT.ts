"use client";

import { useLang } from "./LangContext";
import { T } from "./translations";
import type { Lang } from "./types";

type TransEntry = Record<Lang, string>;

export function useT() {
  const { lang } = useLang();
  return function t(key: TransEntry): string {
    return key[lang] || key.en;
  };
}

// For non-component usage (e.g. metadata), access T directly
export { T };
